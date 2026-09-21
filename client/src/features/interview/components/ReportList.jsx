import { AnimatePresence } from "framer-motion";
import { SearchX } from "lucide-react";
import ReportCard from "./ReportCard";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import DashboardSkeleton from "./DashboardSkeleton";

/**
 * Composes the dashboard's report grid. Pages pass down state produced by
 * useReports; this component only decides which visual state to render.
 */
export default function ReportList({
  reports,
  isLoading,
  error,
  isSearchEmpty,
  actionLoadingId,
  onOpen,
  onRename,
  onDelete,
  onCreate,
  onRetry,
}) {
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load your reports"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (isSearchEmpty) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#ECE5EA] bg-gradient-to-b from-white to-[#FAF8FB] px-6 py-14 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAA7C4]/15">
          <SearchX size={26} strokeWidth={1.5} className="text-[#970747]" />
        </div>
        <h3 className="text-base font-semibold text-[#1F1F1F]">No matching reports</h3>
        <p className="mt-1 max-w-sm text-sm text-[#666666]">
          Try a different keyword or clear your search to see every report.
        </p>
      </div>
    );
  }

  if (reports.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {reports.map((report) => (
          <ReportCard
            key={report._id}
            report={report}
            onOpen={onOpen}
            onRename={onRename}
            onDelete={onDelete}
            isBusy={actionLoadingId === report._id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}