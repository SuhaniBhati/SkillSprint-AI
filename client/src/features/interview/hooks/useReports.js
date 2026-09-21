import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as interviewService from "../services/interview.service";

/**
 * Owns all business logic for the dashboard's report list: fetching,
 * server-side search, renaming, and deleting. Pages should only call the
 * functions this hook exposes - never the service directly.
 * @param {string} search - already-debounced search term
 */
export default function useReports(search) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // interviewService.getReports() already unwraps the Axios response
      // and resolves directly to the array of reports (see its JSDoc:
      // Promise<object[]>), so `data` is the reports array itself - not
      // wrapped in { reports: [...] }.
      const data = await interviewService.getReports(search);
      setReports(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "We couldn't load your interview reports. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const renameReportById = useCallback(async (interviewId, title) => {
    setActionLoadingId(interviewId);
    try {
      const updated = await interviewService.renameReport(interviewId, title);
      setReports((prev) =>
        prev.map((report) =>
          report._id === interviewId ? { ...report, title: updated?.title ?? title } : report
        )
      );
      toast.success("Report renamed successfully.");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't rename this report. Please try again.");
      return false;
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  const deleteReportById = useCallback(async (interviewId) => {
    setActionLoadingId(interviewId);
    try {
      await interviewService.deleteReport(interviewId);
      setReports((prev) => prev.filter((report) => report._id !== interviewId));
      toast.success("Report deleted.");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't delete this report. Please try again.");
      return false;
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  return {
    reports,
    isLoading,
    error,
    actionLoadingId,
    isEmpty: !isLoading && !error && reports.length === 0,
    isSearchEmpty: !isLoading && !error && reports.length === 0 && Boolean(search),
    refetch: fetchReports,
    renameReportById,
    deleteReportById,
  };
}