import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Full-page loader displayed while the AI report is being generated.
 */
export default function LoadingScreen({ progress = 0 }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8FB]">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#970747] to-[#D65795] opacity-20 blur-2xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-full w-full rounded-full border-4 border-[#EAA7C4]/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute h-full w-full rounded-full border-t-4 border-[#970747]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#970747] to-[#D65795] text-white shadow-lg"
        >
          <Sparkles size={24} />
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-lg font-semibold text-[#1F1F1F]"
      >
        Generating your personalized interview report...
      </motion.h2>
      <p className="mt-2 text-sm text-[#666666]">
        Analyzing your resume and matching it against the job description.
      </p>

      <div className="mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-[#ECE5EA]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#970747] to-[#D65795]"
          animate={{ width: `${Math.max(progress, 8)}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>
    </div>
  );
}