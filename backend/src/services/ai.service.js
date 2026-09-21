const { GoogleGenAI } = require("@google/genai");
const z = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_KEY,
});

const MODEL = "gemini-3-flash-preview"; // unchanged, per requirement

const isDev = process.env.NODE_ENV !== "production";

// ---------------------------------------------------------------------------
// Custom errors — never leak raw Gemini/SDK errors to the frontend
// ---------------------------------------------------------------------------

class AIGenerationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "AIGenerationError";
    this.cause = cause;
  }
}

class AIValidationError extends Error {
  constructor(message, issues) {
    super(message);
    this.name = "AIValidationError";
    this.issues = issues;
  }
}

// ---------------------------------------------------------------------------
// Logging — verbose in dev, silent in prod
// ---------------------------------------------------------------------------

const logger = {
  debug: (...args) => isDev && console.log("[ai.service]", ...args),
  warn: (...args) => isDev && console.warn("[ai.service]", ...args),
  error: (...args) => console.error("[ai.service]", ...args), // always log errors
};

// ---------------------------------------------------------------------------
// 1. Handwritten JSON Schema (Gemini's OpenAPI subset)
//
// This is deliberately NOT derived from Zod. zodToJsonSchema emits `anyOf`,
// `$ref`, and other constructs Gemini's schema engine does not reliably honor
// for arrays-of-objects. Handwriting it means every property, its order
// (propertyOrdering), and its nesting is exactly what Gemini receives —
// no lossy translation layer in between.
//
// propertyOrdering matters: Gemini can be sensitive to it, and mismatches
// between schema order and prompt order have been observed to degrade
// structure adherence. We keep schema field order and prompt section order
// aligned.
// ---------------------------------------------------------------------------

const qaObjectSchema = {
  type: "object",
  properties: {
    question: { type: "string" },
    intention: { type: "string" },
    answer: { type: "string" },
  },
  required: ["question", "intention", "answer"],
  propertyOrdering: ["question", "intention", "answer"],
};

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    matchScore: { type: "number" },
    technicalQuestions: {
      type: "array",
      items: qaObjectSchema,
      minItems: 10,
      maxItems: 10,
    },
    behavioralQuestions: {
      type: "array",
      items: qaObjectSchema,
      minItems: 8,
      maxItems: 8,
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          reason: { type: "string" },
        },
        required: ["skill", "severity", "reason"],
        propertyOrdering: ["skill", "severity", "reason"],
      },
      minItems: 7,
      maxItems: 7,
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "integer" },
          focus: { type: "string" },
          tasks: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
          },
        },
        required: ["day", "focus", "tasks"],
        propertyOrdering: ["day", "focus", "tasks"],
      },
      minItems: 20,
      maxItems: 20,
    },
  },
  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
  propertyOrdering: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

// ---------------------------------------------------------------------------
// 2. Zod schema — the runtime source of truth for validation.
// Kept separate from the Gemini schema on purpose: Gemini's schema shapes
// what the model *tries* to emit, Zod verifies what it *actually* emitted
// before it ever reaches Mongoose.
// ---------------------------------------------------------------------------

const qaZod = z.object({
  question: z.string().min(1),
  intention: z.string().min(1),
  answer: z.string().min(1),
});

const interviewReportZodSchema = z.object({
  title: z.string().min(1),
  matchScore: z.number().min(0).max(100),
  technicalQuestions: z.array(qaZod).min(1),
  behavioralQuestions: z.array(qaZod).min(1),
  skillGaps: z.array(
    z.object({
      skill: z.string().min(1),
      severity: z.enum(["low", "medium", "high"]),
      reason: z.string().min(1),
    })
  ).min(1),
  preparationPlan: z.array(
    z.object({
      day: z.number().int(),
      focus: z.string().min(1),
      tasks: z.array(z.string().min(1)).min(1),
    })
  ).min(1),
});

// Note on exact counts (10/8/7/20): Gemini's minItems/maxItems are hints,
// not hard guarantees. We enforce them at the schema + prompt level, but
// Zod validation is deliberately lenient (`.min(1)`) rather than exact.
// Why: if generation comes back with 9 technical questions instead of 10,
// that is NOT something a repair pass should fabricate its way around —
// inventing a 10th question would violate "do not change any information."
// Under-count is logged as a warning and surfaced, not silently patched.

// ---------------------------------------------------------------------------
// 3. Generation config — deterministic, tuned for structured JSON
// ---------------------------------------------------------------------------

const GENERATION_CONFIG = {
  temperature: 0.3,
  // Low but non-zero. 0 can make Gemini repeat degenerate patterns on long
  // structured outputs; 0.3 keeps content varied/personalized across
  // candidates while keeping JSON structure stable run-to-run.
  topP: 0.9,
  // Keeps sampling within the high-probability mass; avoids low-probability
  // tokens that tend to break strict JSON syntax (stray commas, unclosed
  // brackets) without over-constraining wording quality.
  topK: 40,
  // Standard mid-range value; with temperature already low this mostly acts
  // as a secondary guard rail rather than the primary determinism lever.
  maxOutputTokens: 16384,
  // This report is large: 10 detailed technical answers + 8 STAR answers +
  // 7 skill gaps + 20 days of tasks. Truncation mid-JSON is a common cause
  // of "malformed" output that isn't Gemini's fault — it's a token budget
  // problem. 16384 gives headroom; increase if you see truncation in logs.
  candidateCount: 1,
  // We only ever use one candidate — requesting more wastes tokens/latency
  // for a use case with no "pick the best of N" step.
};

// ---------------------------------------------------------------------------
// 4. Prompt builder — shorter, denser, same rigor
// ---------------------------------------------------------------------------

function buildPrompt({ resume, jobDescription, selfDescription }) {
  return `You are a senior technical recruiter, engineering hiring manager, and career coach producing a personalized interview-preparation report.

Ground every claim strictly in the three inputs below. Never invent skills, experience, or achievements not present in them. Where information is missing, note the gap rather than guessing.

Produce, in this exact structure and order:
- title: short title summarizing candidate + target role
- matchScore: honest 0-100 score, based on skills/experience/projects/education vs. the job description — do not inflate
- technicalQuestions: exactly 10 questions tailored to the candidate's actual stack/projects and the job's requirements. Each "answer" is interview coaching (ideal reasoning, key concepts, common mistakes, senior-level framing) — not a short sample reply.
- behavioralQuestions: exactly 8 questions. Each "answer" is STAR-method coaching (what situation to pick, what to emphasize, how to frame the result) tailored to this candidate's background.
- skillGaps: exactly 7 gaps found by comparing resume vs. job description. Each has severity (low/medium/high) and a reason tied to real evidence.
- preparationPlan: exactly 20 daily entries, each with a focus and 3+ concrete, measurable tasks that progressively close the identified gaps.

Return ONLY valid JSON matching the provided schema. No markdown, no commentary, no code fences.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription || "Not provided."}`;
}

function buildRepairPrompt(brokenJsonText, issues) {
  return `The following text was supposed to be valid JSON matching a strict schema but failed validation.

Repair ONLY the JSON structure and formatting. Do NOT change, add, remove, or reword any factual content — question text, answers, scores, or tasks must stay exactly as written.

Validation errors to fix:
${issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n")}

Broken JSON:
${brokenJsonText}

Return ONLY the corrected, valid JSON. No markdown, no commentary, no code fences.`;
}

// ---------------------------------------------------------------------------
// 5. Low-level Gemini call
// ---------------------------------------------------------------------------

async function callGemini(prompt, { schema = RESPONSE_SCHEMA, config = GENERATION_CONFIG } = {}) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        ...config,
      },
    });

    logger.debug("Raw Gemini response:", response.text);
    return response.text;
  } catch (error) {
    logger.error("Gemini API call failed:", error);
    throw new AIGenerationError("Failed to generate content from AI provider", error);
  }
}

// ---------------------------------------------------------------------------
// 6. JSON extraction — defensive even though responseMimeType should
// guarantee raw JSON. Cheap insurance against stray fences/whitespace.
// ---------------------------------------------------------------------------

function extractJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new AIGenerationError("Empty response from AI provider");
  }

  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    logger.warn("JSON.parse failed on cleaned text:", error.message);
    throw new AIGenerationError("AI response was not valid JSON", error);
  }
}

// ---------------------------------------------------------------------------
// 7. Validation
// ---------------------------------------------------------------------------

function validateResponse(data) {
  const result = interviewReportZodSchema.safeParse(data);

  if (!result.success) {
    logger.warn("Zod validation errors:", result.error.issues);
    return { success: false, issues: result.error.issues };
  }

  // Soft-check exact counts; log but don't hard-fail the whole pipeline on
  // this alone — a report with 9/10 questions is still usable, and the
  // caller/frontend can decide how to handle it.
  const expectedCounts = {
    technicalQuestions: 10,
    behavioralQuestions: 8,
    skillGaps: 7,
    preparationPlan: 20,
  };
  for (const [field, expected] of Object.entries(expectedCounts)) {
    const actual = result.data[field]?.length;
    if (actual !== expected) {
      logger.warn(`Count mismatch for ${field}: expected ${expected}, got ${actual}`);
    }
  }

  return { success: true, data: result.data };
}

// ---------------------------------------------------------------------------
// 8. Repair pass — fix structure only, one attempt per generation
// ---------------------------------------------------------------------------

async function repairJson(brokenRawText, issues) {
  const repairPrompt = buildRepairPrompt(brokenRawText, issues);

  const repairedText = await callGemini(repairPrompt, {
    config: {
      ...GENERATION_CONFIG,
      temperature: 0, // repair should be as literal/deterministic as possible
    },
  });

  const parsed = extractJson(repairedText);
  return validateResponse(parsed);
}

// ---------------------------------------------------------------------------
// 9. Orchestration with retry + exponential backoff
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(prompt) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const rawText = await callGemini(prompt);
      const parsed = extractJson(rawText);
      const validation = validateResponse(parsed);

      if (validation.success) {
        logger.debug(`Generation succeeded on attempt ${attempt}`);
        return validation.data;
      }

      logger.warn(`Attempt ${attempt}: validation failed, trying repair pass`);
      const repaired = await repairJson(rawText, validation.issues);

      if (repaired.success) {
        logger.debug(`Repair succeeded on attempt ${attempt}`);
        return repaired.data;
      }

      logger.warn(`Attempt ${attempt}: repair also failed`, repaired.issues);
      lastError = new AIValidationError(
        "AI response failed validation after repair",
        repaired.issues
      );
    } catch (error) {
      lastError = error;
      logger.warn(`Attempt ${attempt} threw:`, error.message);
    }

    if (attempt < MAX_RETRIES) {
      const backoff = BASE_BACKOFF_MS * 2 ** (attempt - 1);
      logger.debug(`Retrying in ${backoff}ms...`);
      await sleep(backoff);
    }
  }

  throw new AIGenerationError(
    "Failed to generate a valid interview report after multiple attempts",
    lastError
  );
}

// ---------------------------------------------------------------------------
// 10. Public API — same signature as before, controller needs zero changes
// ---------------------------------------------------------------------------

async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
  const prompt = buildPrompt({ resume, jobDescription, selfDescription });
  return generateWithRetry(prompt);
}

module.exports = {
  generateInterviewReport,
  // exported for testing
  _internal: {
    buildPrompt,
    buildRepairPrompt,
    extractJson,
    validateResponse,
    callGemini,
    repairJson,
    generateWithRetry,
    RESPONSE_SCHEMA,
    interviewReportZodSchema,
  },
  AIGenerationError,
  AIValidationError,
};