import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, Loader2, Sparkles, UserCircle2 } from "lucide-react";
import ResumeUpload from "./ResumeUpload";
import { REPORT_DRAFT_KEYS } from "../../../utils/DraftKeys";

// Re-exported for anything that previously imported the keys from this
// component; the strings themselves now live in utils/DraftKeys.js so the
// hook layer can clear them without importing from a component file.
export { REPORT_DRAFT_KEYS };

function readDraft(key) {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

/**
 * Composes the "generate report" form. Local component state only tracks
 * raw field values; submission and all business rules live in
 * useGenerateReport, invoked through onSubmit. Job Description and About
 * You are persisted to localStorage as drafts, loaded on mount and updated
 * as the user types.
 *
 * Draft cleanup happens in useGenerateReport.js, the layer that actually
 * knows whether generation succeeded - see that file for details. This
 * component only ever reads/writes drafts, never clears them.
 */
export default function GenerateReportForm({ onSubmit, isGenerating, uploadProgress, error }) {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(() =>
    readDraft(REPORT_DRAFT_KEYS.jobDescription)
  );
  const [selfDescription, setSelfDescription] = useState(() =>
    readDraft(REPORT_DRAFT_KEYS.selfDescription)
  );
  const [fieldError, setFieldError] = useState(null);

  // Persist drafts as the user types.
  useEffect(() => {
    try {
      window.localStorage.setItem(REPORT_DRAFT_KEYS.jobDescription, jobDescription);
    } catch {
      // localStorage unavailable (private mode, quota, etc.) - fail silently.
    }
  }, [jobDescription]);

  useEffect(() => {
    try {
      window.localStorage.setItem(REPORT_DRAFT_KEYS.selfDescription, selfDescription);
    } catch {
      // localStorage unavailable - fail silently.
    }
  }, [selfDescription]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFieldError(null);
    onSubmit({ resume, jobDescription, selfDescription });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-7 rounded-3xl border border-[#ECE5EA] bg-white p-6 shadow-sm sm:p-8"
    >
      <FormField step={1} icon={FileText} label="Resume" required>
        <ResumeUpload
          file={resume}
          onFileSelect={setResume}
          onRemove={() => setResume(null)}
          onError={setFieldError}
        />
      </FormField>

      <FormField
        step={2}
        icon={Briefcase}
        label="Job Description"
        required
        htmlFor="jobDescription"
        helper="Paste the role's job posting so the report can tailor questions to it."
      >
        <div className="relative">
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            rows={6}
            placeholder="Paste the job description you're preparing for..."
            className="w-full resize-y rounded-2xl border border-[#ECE5EA] bg-[#FAF8FB] p-4 text-sm leading-relaxed text-[#1F1F1F] outline-none transition placeholder:text-[#999999] focus:border-[#C74D81] focus:bg-white focus:ring-4 focus:ring-[#EAA7C4]/30"
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-[11px] font-medium text-[#999999]">
            {jobDescription.length.toLocaleString()} characters
          </span>
        </div>
      </FormField>

      <FormField
        step={3}
        icon={UserCircle2}
        label="About You"
        optional
        htmlFor="selfDescription"
        helper="Anything you'd like the interviewer to know - background, focus areas, goals."
      >
        <div className="relative">
          <textarea
            id="selfDescription"
            value={selfDescription}
            onChange={(event) => setSelfDescription(event.target.value)}
            rows={4}
            placeholder="Share anything you'd like the interviewer to know about you..."
            className="w-full resize-y rounded-2xl border border-[#ECE5EA] bg-[#FAF8FB] p-4 text-sm leading-relaxed text-[#1F1F1F] outline-none transition placeholder:text-[#999999] focus:border-[#C74D81] focus:bg-white focus:ring-4 focus:ring-[#EAA7C4]/30"
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-[11px] font-medium text-[#999999]">
            {selfDescription.length.toLocaleString()} characters
          </span>
        </div>
      </FormField>

      {(fieldError || error) && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-[#FF3B30]">
          {fieldError || error}
        </p>
      )}

      {isGenerating && (
        <div>
          <div className="mb-1.5 flex justify-between text-xs font-medium text-[#666666]">
            <span>Uploading resume</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#ECE5EA]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#970747] to-[#D65795]"
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <div className="pt-1">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#970747]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#970747]/10 text-[10px]">
            4
          </span>
          Generate Report
        </div>
        <button
          type="submit"
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#970747] to-[#D65795] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(151,7,71,0.55)] transition hover:shadow-[0_16px_36px_-8px_rgba(151,7,71,0.6)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Report
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}

/**
 * Shared wrapper giving every step of the form the same icon + label +
 * required/optional + helper-text treatment.
 */
function FormField({ step, icon: Icon, label, htmlFor, required, optional, helper, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-semibold text-[#1F1F1F]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#970747]/10 text-[11px] font-bold text-[#970747]">
            {step}
          </span>
          <Icon size={15} className="text-[#970747]" />
          {label}
          {required && <span className="text-[#D65795]">*</span>}
        </label>
        {optional && <span className="text-xs font-medium text-[#666666]">Optional</span>}
      </div>
      {helper && <p className="mb-2 pl-8 text-xs text-[#666666]">{helper}</p>}
      {children}
    </div>
  );
}