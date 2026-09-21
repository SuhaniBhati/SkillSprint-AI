/**
 * Centralized localStorage keys for the "generate report" form's drafts.
 * GenerateReportForm.jsx (presentational) writes these as the user types;
 * useGenerateReport.js (business logic) clears them once generation has
 * actually succeeded. Both import from here so the raw key strings exist
 * in exactly one place.
 */
export const REPORT_DRAFT_KEYS = {
  jobDescription: "interviewCoach:draft:jobDescription",
  selfDescription: "interviewCoach:draft:selfDescription",
};