import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useReport from "../hooks/useReport";
import useDownloadPdf from "../hooks/useDownloadPdf";
import ReportViewer from "../components/ReportViewer";
import ReportSkeleton from "../components/ReportSkeleton";
import ErrorState from "../components/ErrorState";
import RenameDialog from "../components/RenameDialog";
import DeleteDialog from "../components/DeleteDialog";

export default function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const { report, isLoading, error, notFound, isRenaming, isDeleting, refetch, renameReport, deleteReport } =
    useReport(interviewId);
  const { download, isDownloading } = useDownloadPdf();

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleRenameSave = async (title) => {
    const success = await renameReport(title);
    if (success) setIsRenameOpen(false);
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteReport();
    if (success) setIsDeleteOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8FB]">
        <ReportSkeleton />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8FB] px-4">
        <ErrorState
          title="Report not found"
          message="This interview report doesn't exist or may have been deleted."
          onRetry={() => navigate("/home")}
          retryLabel="Back to Dashboard"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8FB] px-4">
        <ErrorState title="Unable to load report" message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8FB] px-4">
        <ErrorState
          title="No report data"
          message="We couldn't find any data for this report."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FB]">
      <ReportViewer
        report={report}
        onBack={() => navigate("/home")}
        onRenameClick={() => setIsRenameOpen(true)}
        onDeleteClick={() => setIsDeleteOpen(true)}
        onDownload={() => download(interviewId, report.title)}
        isDownloading={isDownloading}
      />

      <RenameDialog
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        initialTitle={report.title}
        onSave={handleRenameSave}
        isSaving={isRenaming}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        reportTitle={report.title}
      />
    </div>
  );
}