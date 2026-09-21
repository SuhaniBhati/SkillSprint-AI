import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { getMatchScoreBand } from "../../../utils/matchScore";

/**
 * Presentational card for a single report. Emits click intents via props;
 * never calls the backend or contains business logic itself.
 *
 * Structure note: the whole card used to be a single <button> with
 * role="button" spans nested inside it for Rename/Delete - invalid
 * interactive nesting. It's now a plain container with three real,
 * sibling controls: an "open" button wrapping the title/score/meta, and
 * two icon buttons for Rename/Delete alongside it.
 */
export default function ReportCard({ report, onOpen, onRename, onDelete, isBusy }) {
  const band = getMatchScoreBand(report.matchScore);

  const handleRename = (event) => {
    event.stopPropagation();
    onRename(report);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(report);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-[#ECE5EA] bg-white shadow-sm transition-shadow hover:shadow-[0_20px_45px_-22px_rgba(151,7,71,0.45)] focus-within:shadow-[0_20px_45px_-22px_rgba(151,7,71,0.45)]"
    >
      {/* Subtle branded accent - not a full-card gradient */}
      <div className="h-1 bg-gradient-to-r from-[#970747] to-[#D65795]" />

      <div className="p-5">
        <button
          type="button"
          onClick={() => onOpen(report._id)}
          aria-label={`Open report ${report.title}`}
          className="flex w-full flex-col rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAA7C4] focus-visible:ring-offset-2"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-semibold text-[#1F1F1F]">
              {report.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${band.bg} ${band.text}`}
            >
              {report.matchScore ?? 0}%
            </span>
          </div>

          <p className={`mt-1 text-xs font-medium ${band.text}`}>{band.short} Match</p>

          <div className="mt-4 text-xs text-[#666666]">
            <p>Created {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</p>
            <p className="mt-0.5">
              Updated {formatDistanceToNow(new Date(report.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </button>

        <div className="mt-4 flex items-center justify-end gap-1 border-t border-[#ECE5EA] pt-3">
          {isBusy ? (
            <span className="flex h-8 w-8 items-center justify-center text-[#970747]">
              <Loader2 size={16} className="animate-spin" />
            </span>
          ) : (
            <div className="flex items-center gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
              <button
                type="button"
                onClick={handleRename}
                aria-label="Rename report"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666666] transition hover:bg-[#FAF8FB] hover:text-[#970747] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAA7C4]"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Delete report"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#666666] transition hover:bg-red-50 hover:text-[#FF3B30] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}