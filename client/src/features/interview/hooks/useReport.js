import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as interviewService from "../services/interview.service";

/**
 * Owns all business logic for a single interview report: fetching,
 * renaming, and deleting (with redirect back to the dashboard on delete).
 * @param {string} interviewId
 */
export default function useReport(interviewId) {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReport = useCallback(async () => {
    if (!interviewId) return;
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await interviewService.getReport(interviewId);
      setReport(data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err?.response?.data?.message || "Unable to load this report right now.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const renameReport = useCallback(
    async (title) => {
      setIsRenaming(true);
      try {
        const updated = await interviewService.renameReport(interviewId, title);
        setReport((prev) => (prev ? { ...prev, title: updated?.title ?? title } : prev));
        toast.success("Report renamed successfully.");
        return true;
      } catch (err) {
        toast.error(err?.response?.data?.message || "Couldn't rename this report. Please try again.");
        return false;
      } finally {
        setIsRenaming(false);
      }
    },
    [interviewId]
  );

  const deleteReport = useCallback(async () => {
    setIsDeleting(true);
    try {
      await interviewService.deleteReport(interviewId);
      toast.success("Report deleted.");
      navigate("/home");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't delete this report. Please try again.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [interviewId, navigate]);

  return {
    report,
    isLoading,
    error,
    notFound,
    isRenaming,
    isDeleting,
    refetch: fetchReport,
    renameReport,
    deleteReport,
  };
}