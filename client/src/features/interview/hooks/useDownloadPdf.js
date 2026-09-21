import { useState } from "react";
import toast from "react-hot-toast";
import * as interviewService from "../services/interview.service";

/**
 * Owns all business logic for downloading a report's PDF export.
 */
export default function useDownloadPdf() {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async (interviewId, fileName = "interview-report") => {
    setIsDownloading(true);
    try {
      const blob = await interviewService.downloadPdf(interviewId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Interview report downloaded successfully.");
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't download the PDF. Please try again.");
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
}