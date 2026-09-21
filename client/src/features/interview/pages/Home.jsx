import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AuthContext } from "../../auth/auth.context";
import useReports from "../hooks/useReports";
import useSearchReports from "../hooks/useSearchReports";
import DashboardHeader from "../components/DashboardHeader";
import ProfileDropdown from "../components/ProfileDropdown";
import SearchBar from "../components/SearchBar";
import ReportList from "../components/ReportList";
import RenameDialog from "../components/RenameDialog";
import DeleteDialog from "../components/DeleteDialog";

export default function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const { query, setQuery, debouncedQuery, clearQuery, isSearching } = useSearchReports();
  const {
    reports,
    isLoading,
    error,
    actionLoadingId,
    isSearchEmpty,
    refetch,
    renameReportById,
    deleteReportById,
  } = useReports(debouncedQuery);

  const [reportToRename, setReportToRename] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleRenameSave = async (title) => {
    const success = await renameReportById(reportToRename._id, title);
    if (success) setReportToRename(null);
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteReportById(reportToDelete._id);
    if (success) setReportToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8FB] pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <DashboardHeader username={user?.username}>
          <ProfileDropdown user={user} onLogout={handleLogout} />
        </DashboardHeader>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="sm:flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              onClear={clearQuery}
              isSearching={isSearching}
            />
          </div>
          <button
            type="button"
            onClick={() => navigate("/interview/new")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#970747] to-[#D65795] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-95"
          >
            <Plus size={16} />
            Create Interview Report
          </button>
        </div>

        <div className="mt-8">
          <ReportList
            reports={reports}
            isLoading={isLoading}
            error={error}
            isSearchEmpty={isSearchEmpty}
            actionLoadingId={actionLoadingId}
            onOpen={(id) => navigate(`/interview/${id}`)}
            onRename={(report) => setReportToRename(report)}
            onDelete={(report) => setReportToDelete(report)}
            onCreate={() => navigate("/interview/new")}
            onRetry={refetch}
          />
        </div>
      </div>

      <RenameDialog
        isOpen={Boolean(reportToRename)}
        onClose={() => setReportToRename(null)}
        initialTitle={reportToRename?.title}
        onSave={handleRenameSave}
        isSaving={actionLoadingId === reportToRename?._id}
      />

      <DeleteDialog
        isOpen={Boolean(reportToDelete)}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={actionLoadingId === reportToDelete?._id}
        reportTitle={reportToDelete?.title}
      />
    </div>
  );
}