import { motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";

/**
 * Shown when there are zero reports. Purely presentational.
 */
export default function EmptyState({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#ECE5EA] bg-white/60 px-6 py-20 text-center"
    >
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#EAA7C4]/40 to-[#970747]/20">
        <FileText size={40} strokeWidth={1.5} className="text-[#970747]" />
      </div>
      <h3 className="text-xl font-semibold text-[#1F1F1F]">No Interview Reports Yet</h3>
      <p className="mt-2 max-w-sm text-sm text-[#666666]">
        Generate your first AI-powered interview report to see your match score, personalized
        questions, and a preparation plan.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#970747] to-[#D65795] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-105 active:scale-95"
      >
        <Plus size={16} />
        Create New Report
      </button>
    </motion.div>
  );
}