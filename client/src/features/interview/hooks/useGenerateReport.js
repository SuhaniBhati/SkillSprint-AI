import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as interviewService from "../services/interview.service";
import { REPORT_DRAFT_KEYS } from "../../../utils/DraftKeys";

const MIN_JOB_DESCRIPTION_LENGTH = 20;

function clearDrafts() {
  try {
    window.localStorage.removeItem(REPORT_DRAFT_KEYS.jobDescription);
    window.localStorage.removeItem(REPORT_DRAFT_KEYS.selfDescription);
  } catch {
    // localStorage unavailable - nothing to clean up.
  }
}

/**
 * Owns all business logic for the "generate a new report" flow: validation,
 * upload progress tracking, error handling, and redirecting on success.
 *
 * This is also the only place that clears the Job Description/About You
 * localStorage drafts. It does so immediately after `generateReport`
 * resolves - i.e. only on a confirmed successful API response - and never
 * in a `finally` block, so a failed or cancelled run always leaves the
 * user's drafts intact.
 */
export default function useGenerateReport() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const validate = ({ resume, jobDescription }) => {
    if (!resume) {
      return "Please upload your resume as a PDF before generating a report.";
    }
    if (resume.type !== "application/pdf") {
      return "Your resume must be a PDF file.";
    }
    if (resume.size > 10 * 1024 * 1024) {
      return "Your resume must be smaller than 10MB.";
    }
    if (!jobDescription || jobDescription.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
      return `Please add a job description with at least ${MIN_JOB_DESCRIPTION_LENGTH} characters.`;
    }
    return null;
  };

  const generate = async ({ resume, jobDescription, selfDescription }) => {
    const validationError = validate({ resume, jobDescription });
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return false;
    }

    setError(null);
    setIsGenerating(true);
    setUploadProgress(0);
    try {
      const report = await interviewService.generateReport(
        { resume, jobDescription, selfDescription },
        setUploadProgress
      );

      // Only reached on a confirmed successful response - safe to clear
      // the drafts here, before navigating away.
      clearDrafts();

      navigate(`/interview/${report._id}`);
      return true;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "We couldn't generate your report. Please check your files and try again.";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating, uploadProgress, error };
}