const PDFDocument = require("pdfkit");

/* =========================================================
 * BRAND / LAYOUT CONSTANTS
 * ========================================================= */

const COLORS = {
  primary: "#970747",
  secondary: "#D65795",
  accentLight: "#EAA7C4",
  background: "#FAF8FB",
  text: "#1F1F1F",
  muted: "#666666",
  border: "#ECE5EA",
  cardBg: "#FDF5F9",
  white: "#FFFFFF"
};

const SEVERITY_COLORS = {
  high: COLORS.primary,
  medium: COLORS.secondary,
  low: COLORS.accentLight
};

const MARGINS = {
  top: 105,
  bottom: 70,
  left: 50,
  right: 50
};

const FONT = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
  oblique: "Helvetica-Oblique"
};

/* =========================================================
 * ENTRY POINT
 * ========================================================= */

async function generateInterviewReportPDF(report, res) {
  const doc = new PDFDocument({
    size: "A4",
    margins: MARGINS,
    bufferPages: true
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="interview-report-${report._id}.pdf"`
  );

  doc.pipe(res);

  drawCover(doc, report);

  drawSection(
    doc,
    "Technical Interview Questions",
    report.technicalQuestions,
    "No technical questions were generated.",
    (item, index) => addQuestionCard(doc, index + 1, item, COLORS.primary)
  );

  drawSection(
    doc,
    "Behavioral Interview Questions",
    report.behavioralQuestions,
    "No behavioral questions were generated.",
    (item, index) => addQuestionCard(doc, index + 1, item, COLORS.secondary)
  );

  drawSection(
    doc,
    "Skill Gap Analysis",
    report.skillGaps,
    "No skill gaps were identified.",
    (item) => addSkillGapCard(doc, item)
  );

  drawSection(
    doc,
    "Preparation Roadmap",
    report.preparationPlan,
    "No preparation plan was generated.",
    (item) => addPreparationDay(doc, item)
  );

  finalizePagesWithHeaderFooter(doc);

  doc.end();
}

/* =========================================================
 * SECTION HELPERS
 * ========================================================= */

function drawSection(doc, title, items, emptyMessage, renderItem) {
  addSectionTitle(doc, title);

  if (!Array.isArray(items) || items.length === 0) {
    addEmptyMessage(doc, emptyMessage);
    return;
  }

  items.forEach((item, index) => renderItem(item, index));
}

function addSectionTitle(doc, title) {
  ensureSpace(doc, 46);

  resetX(doc);
  const y = doc.y + 4;

  doc
    .rect(MARGINS.left, y, 4, 20)
    .fill(COLORS.primary);

  doc
    .fillColor(COLORS.primary)
    .font(FONT.bold)
    .fontSize(17)
    .text(title, MARGINS.left + 14, y - 2, { width: contentWidth(doc) - 14 });

  doc.y = y + 26;
  resetX(doc);

  doc
    .moveTo(MARGINS.left, doc.y)
    .lineTo(doc.page.width - MARGINS.right, doc.y)
    .lineWidth(0.75)
    .strokeColor(COLORS.border)
    .stroke();

  doc.y += 14;
  resetX(doc);
}

function addEmptyMessage(doc, message) {
  ensureSpace(doc, 30);
  doc
    .fillColor(COLORS.muted)
    .font(FONT.oblique)
    .fontSize(10.5)
    .text(message, MARGINS.left, doc.y, { width: contentWidth(doc) });
  doc.y += 24;
  resetX(doc);
}

/* =========================================================
 * COVER / SCORE
 * ========================================================= */

function drawCover(doc, report) {
  const pageWidth = doc.page.width;

  // Hero band
  doc.rect(0, 0, pageWidth, 150).fill(COLORS.primary);
  doc.rect(0, 150, pageWidth, 6).fill(COLORS.secondary);

  doc
    .fillColor(COLORS.white)
    .font(FONT.bold)
    .fontSize(13)
    .text("INTERVIEW PREPARATION REPORT", MARGINS.left, 40, {
      width: contentWidth(doc),
      characterSpacing: 1
    });

  const title = report.title || "Interview Preparation Report";
  doc
    .fillColor(COLORS.white)
    .font(FONT.bold)
    .fontSize(26)
    .text(title, MARGINS.left, 64, { width: contentWidth(doc) });

  const generatedDate = formatDate(report.createdAt);
  doc
    .fillColor(COLORS.accentLight)
    .font(FONT.regular)
    .fontSize(10.5)
    .text(`Generated on ${generatedDate}`, MARGINS.left, 120, {
      width: contentWidth(doc)
    });

  doc.y = 190;
  resetX(doc);

  drawScoreCard(doc, report.matchScore);

  doc.y += 26;
  resetX(doc);
}

function drawScoreCard(doc, matchScoreRaw) {
  const matchScore = clampScore(matchScoreRaw);
  const category = getScoreCategory(matchScore);

  const cardX = MARGINS.left;
  const cardY = doc.y;
  const cardWidth = contentWidth(doc);
  const cardHeight = 150;

  doc
    .roundedRect(cardX, cardY, cardWidth, cardHeight, 10)
    .fillAndStroke(COLORS.cardBg, COLORS.border);

  // Circular score badge
  const circleCx = cardX + 95;
  const circleCy = cardY + cardHeight / 2;
  const outerR = 52;
  const innerR = 42;

  doc.circle(circleCx, circleCy, outerR).fill(category.color);
  doc.circle(circleCx, circleCy, innerR).fill(COLORS.white);

  const scoreText = matchScore === null ? "N/A" : `${matchScore}%`;

  doc
    .fillColor(category.color)
    .font(FONT.bold)
    .fontSize(matchScore === null ? 16 : 26)
    .text(scoreText, circleCx - innerR, circleCy - 16, {
      width: innerR * 2,
      align: "center"
    });

  // Labels + progress bar to the right of the circle
  const textX = cardX + 95 + outerR + 30;
  const textWidth = cardX + cardWidth - textX - 24;

  doc
    .fillColor(COLORS.muted)
    .font(FONT.bold)
    .fontSize(10)
    .text("INTERVIEW READINESS", textX, cardY + 34, {
      width: textWidth,
      characterSpacing: 0.5
    });

  doc
    .fillColor(category.color)
    .font(FONT.bold)
    .fontSize(16)
    .text(category.label, textX, cardY + 50, { width: textWidth });

  // Progress bar (also readable in grayscale)
  const barY = cardY + 90;
  const barWidth = textWidth;
  const barHeight = 10;

  doc
    .roundedRect(textX, barY, barWidth, barHeight, 5)
    .fill(COLORS.border);

  const fillWidth = matchScore === null ? 0 : (barWidth * matchScore) / 100;

  if (fillWidth > 0) {
    doc
      .roundedRect(textX, barY, fillWidth, barHeight, 5)
      .fill(category.color);
  }

  doc
    .fillColor(COLORS.muted)
    .font(FONT.regular)
    .fontSize(8.5)
    .text("0", textX, barY + 14)
    .text("100", textX + barWidth - 20, barY + 14, { width: 20, align: "right" });

  doc.y = cardY + cardHeight;
  resetX(doc);
}

function getScoreCategory(score) {
  if (score === null) {
    return { label: "Not Available", color: COLORS.muted };
  }
  if (score >= 85) return { label: "Excellent Match", color: COLORS.primary };
  if (score >= 70) return { label: "Strong Match", color: COLORS.secondary };
  if (score >= 50) return { label: "Moderate Match", color: "#B85A82" };
  return { label: "Needs Improvement", color: COLORS.muted };
}

function clampScore(score) {
  if (typeof score !== "number" || Number.isNaN(score)) return null;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/* =========================================================
 * QUESTION CARDS (Technical / Behavioral)
 * ========================================================= */

function addQuestionCard(doc, index, item, accentColor) {
  const question = safeText(item && item.question);
  const intention = safeText(item && item.intention);
  const answer = safeText(item && item.answer);

  const paddingX = 18;
  const paddingY = 16;
  const width = contentWidth(doc);
  const innerWidth = width - paddingX * 2;
  const badgeSize = 24;
  const gapSmall = 4;
  const gapBlock = 12;

  const qH = measure(doc, question, FONT.regular, 11.5, innerWidth);
  const whyLabelH = measure(doc, "WHY THIS IS ASKED", FONT.bold, 9, innerWidth);
  const whyH = measure(doc, intention, FONT.regular, 10, innerWidth);
  const ansLabelH = measure(doc, "SUGGESTED ANSWER", FONT.bold, 9, innerWidth);
  const ansH = measure(doc, answer, FONT.regular, 10.5, innerWidth);

  const contentHeight =
    badgeSize +
    gapBlock +
    qH +
    gapBlock +
    whyLabelH +
    gapSmall +
    whyH +
    gapBlock +
    ansLabelH +
    gapSmall +
    ansH;

  const cardHeight = paddingY * 2 + contentHeight;
  const maxSinglePageHeight = usableHeight(doc) - 20;

  if (cardHeight > maxSinglePageHeight) {
    // Content too long to fit any single page as a card — fall back to
    // plain flowing text so nothing is clipped or overlapped.
    renderFlowingQuestion(doc, index, question, intention, answer, accentColor, innerWidth);
    return;
  }

  ensureSpace(doc, cardHeight + 16);

  const cardX = MARGINS.left;
  const cardTop = doc.y;

  doc.roundedRect(cardX, cardTop, width, cardHeight, 8).fill(COLORS.cardBg);
  doc.roundedRect(cardX, cardTop, 4, cardHeight, 2).fill(accentColor);

  const textX = cardX + paddingX;
  let cursorY = cardTop + paddingY;

  doc.roundedRect(textX, cursorY, badgeSize, badgeSize, 5).fill(accentColor);
  doc
    .fillColor(COLORS.white)
    .font(FONT.bold)
    .fontSize(10)
    .text(String(index).padStart(2, "0"), textX, cursorY + 6, {
      width: badgeSize,
      align: "center"
    });

  doc
    .fillColor(accentColor)
    .font(FONT.bold)
    .fontSize(11)
    .text("Question", textX + badgeSize + 10, cursorY + 6, {
      width: innerWidth - badgeSize - 10
    });

  cursorY += badgeSize + gapBlock;

  doc
    .fillColor(COLORS.text)
    .font(FONT.regular)
    .fontSize(11.5)
    .text(question, textX, cursorY, { width: innerWidth });
  cursorY += qH + gapBlock;

  doc
    .fillColor(COLORS.secondary)
    .font(FONT.bold)
    .fontSize(9)
    .text("WHY THIS IS ASKED", textX, cursorY, {
      width: innerWidth,
      characterSpacing: 0.4
    });
  cursorY += whyLabelH + gapSmall;

  doc
    .fillColor(COLORS.muted)
    .font(FONT.regular)
    .fontSize(10)
    .text(intention, textX, cursorY, { width: innerWidth });
  cursorY += whyH + gapBlock;

  doc
    .fillColor(COLORS.secondary)
    .font(FONT.bold)
    .fontSize(9)
    .text("SUGGESTED ANSWER", textX, cursorY, {
      width: innerWidth,
      characterSpacing: 0.4
    });
  cursorY += ansLabelH + gapSmall;

  doc
    .fillColor(COLORS.text)
    .font(FONT.regular)
    .fontSize(10.5)
    .text(answer, textX, cursorY, { width: innerWidth });

  doc.y = cardTop + cardHeight + 16;
  resetX(doc);
}

function renderFlowingQuestion(doc, index, question, intention, answer, accentColor, width) {
  ensureSpace(doc, 30);
  doc
    .fillColor(accentColor)
    .font(FONT.bold)
    .fontSize(12)
    .text(`Question ${String(index).padStart(2, "0")}`, MARGINS.left, doc.y, { width });
  doc.y += 6;
  resetX(doc);

  doc
    .fillColor(COLORS.text)
    .font(FONT.regular)
    .fontSize(11.5)
    .text(question, MARGINS.left, doc.y, { width });
  doc.y += 10;
  resetX(doc);

  doc
    .fillColor(COLORS.secondary)
    .font(FONT.bold)
    .fontSize(9)
    .text("WHY THIS IS ASKED", MARGINS.left, doc.y, { width });
  doc.y += 4;
  resetX(doc);

  doc
    .fillColor(COLORS.muted)
    .font(FONT.regular)
    .fontSize(10)
    .text(intention, MARGINS.left, doc.y, { width });
  doc.y += 10;
  resetX(doc);

  doc
    .fillColor(COLORS.secondary)
    .font(FONT.bold)
    .fontSize(9)
    .text("SUGGESTED ANSWER", MARGINS.left, doc.y, { width });
  doc.y += 4;
  resetX(doc);

  doc
    .fillColor(COLORS.text)
    .font(FONT.regular)
    .fontSize(10.5)
    .text(answer, MARGINS.left, doc.y, { width });
  doc.y += 20;
  resetX(doc);
}

/* =========================================================
 * SKILL GAP CARDS
 * ========================================================= */

function addSkillGapCard(doc, gap) {
  const skill = safeText(gap && gap.skill) || "Unspecified skill";
  const severity = ((gap && gap.severity) || "").toLowerCase();
  const reason = safeText(gap && gap.reason);

  const paddingX = 18;
  const paddingY = 14;
  const width = contentWidth(doc);
  const innerWidth = width - paddingX * 2;
  const headerH = 22;
  const gapBlock = 8;

  const reasonH = reason ? measure(doc, reason, FONT.regular, 10, innerWidth) : 0;

  const cardHeight = paddingY * 2 + headerH + (reason ? gapBlock + reasonH : 0);

  ensureSpace(doc, cardHeight + 14);

  const cardX = MARGINS.left;
  const cardTop = doc.y;
  const accentColor = SEVERITY_COLORS[severity] || COLORS.muted;

  doc.roundedRect(cardX, cardTop, width, cardHeight, 8).fill(COLORS.cardBg);
  doc.roundedRect(cardX, cardTop, 4, cardHeight, 2).fill(accentColor);

  const textX = cardX + paddingX;
  let cursorY = cardTop + paddingY;

  doc
    .fillColor(COLORS.text)
    .font(FONT.bold)
    .fontSize(13)
    .text(skill, textX, cursorY, { width: innerWidth - 90 });

  const badgeLabel = severity ? severity.toUpperCase() : "N/A";
  const badgeWidth = 78;
  const badgeX = cardX + width - paddingX - badgeWidth;

  doc
    .roundedRect(badgeX, cursorY - 2, badgeWidth, 20, 10)
    .fill(accentColor);
  doc
    .fillColor(COLORS.white)
    .font(FONT.bold)
    .fontSize(9)
    .text(badgeLabel, badgeX, cursorY + 3, { width: badgeWidth, align: "center" });

  cursorY += headerH;

  if (reason) {
    cursorY += gapBlock;
    doc
      .fillColor(COLORS.muted)
      .font(FONT.regular)
      .fontSize(10)
      .text(reason, textX, cursorY, { width: innerWidth });
  }

  doc.y = cardTop + cardHeight + 14;
  resetX(doc);
}

/* =========================================================
 * PREPARATION ROADMAP
 * ========================================================= */

function addPreparationDay(doc, day) {
  const dayNumber = day && day.day != null ? day.day : "";
  const focus = safeText(day && day.focus) || "Focus area";
  const tasks = Array.isArray(day && day.tasks) ? day.tasks.filter(Boolean) : [];

  const paddingX = 18;
  const paddingY = 14;
  const width = contentWidth(doc);
  const innerWidth = width - paddingX * 2;
  const headerH = 24;
  const gapBlock = 8;
  const taskGap = 5;

  const taskHeights = tasks.map((task) =>
    measure(doc, `•  ${safeText(task)}`, FONT.regular, 10.5, innerWidth)
  );
  const tasksTotalH = taskHeights.reduce((sum, h) => sum + h + taskGap, 0);

  const cardHeight =
    paddingY * 2 + headerH + (tasks.length ? gapBlock + tasksTotalH : 0);

  ensureSpace(doc, cardHeight + 14);

  const cardX = MARGINS.left;
  const cardTop = doc.y;

  doc.roundedRect(cardX, cardTop, width, cardHeight, 8).fill(COLORS.cardBg);
  doc.roundedRect(cardX, cardTop, 4, cardHeight, 2).fill(COLORS.primary);

  const textX = cardX + paddingX;
  let cursorY = cardTop + paddingY;

  const dayBadgeWidth = 62;
  doc
    .roundedRect(textX, cursorY, dayBadgeWidth, 20, 10)
    .fill(COLORS.primary);
  doc
    .fillColor(COLORS.white)
    .font(FONT.bold)
    .fontSize(9.5)
    .text(`DAY ${dayNumber}`, textX, cursorY + 5, {
      width: dayBadgeWidth,
      align: "center"
    });

  doc
    .fillColor(COLORS.text)
    .font(FONT.bold)
    .fontSize(12.5)
    .text(focus, textX + dayBadgeWidth + 12, cursorY + 4, {
      width: innerWidth - dayBadgeWidth - 12
    });

  cursorY += headerH;

  if (tasks.length) {
    cursorY += gapBlock;
    tasks.forEach((task, i) => {
      doc
        .fillColor(COLORS.muted)
        .font(FONT.regular)
        .fontSize(10.5)
        .text(`•  ${safeText(task)}`, textX, cursorY, { width: innerWidth });
      cursorY += taskHeights[i] + taskGap;
    });
  }

  doc.y = cardTop + cardHeight + 14;
  resetX(doc);
}

/* =========================================================
 * HEADER / FOOTER (applied after buffering all pages)
 * ========================================================= */

function finalizePagesWithHeaderFooter(doc) {
  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const pageNumber = i - range.start + 1;
    const totalPages = range.count;

    if (pageNumber > 1) {
      addPageHeader(doc);
    }

    addPageFooter(doc, pageNumber, totalPages);
  }
}

function addPageHeader(doc) {
  const y = 34;

  // Text drawn via doc.text() is subject to PDFKit's automatic page-break
  // check (it compares the target y against doc.page.maxY()). y=34 sits
  // safely above that boundary here, but we still disable line-wrapping
  // so a single short header line can never re-trigger that check.
  doc
    .fillColor(COLORS.primary)
    .font(FONT.bold)
    .fontSize(9.5)
    .text("INTERVIEW PREPARATION REPORT", MARGINS.left, y, {
      width: contentWidth(doc),
      characterSpacing: 0.6,
      lineBreak: false
    });

  doc
    .moveTo(MARGINS.left, y + 16)
    .lineTo(doc.page.width - MARGINS.right, y + 16)
    .lineWidth(0.5)
    .strokeColor(COLORS.border)
    .stroke();
}

function addPageFooter(doc, pageNumber, totalPages) {
  const page = doc.page;

  // The footer is drawn *inside* the reserved bottom-margin strip
  // (page.height - MARGINS.bottom + offset). doc.text() checks the target
  // y against page.maxY() = page.height - page.margins.bottom, and if the
  // y is past that boundary it silently calls doc.addPage() and draws on
  // the NEW page instead — which is what was producing the trailing
  // footer-only pages. Temporarily zeroing the bottom margin makes
  // maxY() equal page.height for the duration of this draw, so the
  // footer renders on the CURRENT page with no page break triggered.
  const originalBottomMargin = page.margins.bottom;
  page.margins.bottom = 0;

  const y = page.height - originalBottomMargin + 22;

  doc
    .moveTo(MARGINS.left, y - 10)
    .lineTo(page.width - MARGINS.right, y - 10)
    .lineWidth(0.5)
    .strokeColor(COLORS.border)
    .stroke();

  doc
    .fillColor(COLORS.muted)
    .font(FONT.regular)
    .fontSize(8.5)
    .text("Generated by the SkillSprint AI", MARGINS.left, y, {
      width: contentWidth(doc) / 2,
      lineBreak: false
    });

  doc
    .fillColor(COLORS.muted)
    .font(FONT.regular)
    .fontSize(8.5)
    .text(`Page ${pageNumber} of ${totalPages}`, MARGINS.left + contentWidth(doc) / 2, y, {
      width: contentWidth(doc) / 2,
      align: "right",
      lineBreak: false
    });

  page.margins.bottom = originalBottomMargin;
}

/* =========================================================
 * LOW-LEVEL UTILITIES
 * ========================================================= */

function contentWidth(doc) {
  return doc.page.width - MARGINS.left - MARGINS.right;
}

function usableHeight(doc) {
  return doc.page.height - MARGINS.top - MARGINS.bottom;
}

function resetX(doc) {
  doc.x = MARGINS.left;
}

function ensureSpace(doc, requiredHeight) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + requiredHeight > bottom) {
    doc.addPage();
    resetX(doc);
  }
}

function measure(doc, text, font, size, width) {
  doc.font(font).fontSize(size);
  return doc.heightOfString(text || "", { width });
}

function safeText(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function formatDate(date) {
  const d = date ? new Date(date) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toLocaleDateString();
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

module.exports = {
  generateInterviewReportPDF
};