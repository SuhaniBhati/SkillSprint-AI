import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { SEVERITY_STYLES } from "../../../utils/matchScore";

/**
 * Renders the skill gap analysis as a responsive grid of cards.
 */
export default function SkillGapSection({ id, skillGaps = [] }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#FF9500]">
          <AlertCircle size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#1F1F1F] sm:text-2xl">Skill Gap Analysis</h2>
          <p className="mt-0.5 text-sm text-[#666666]">
            Areas to strengthen before your interview, ranked by severity.
          </p>
        </div>
      </div>

      {skillGaps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE5EA] bg-white/60 px-6 py-10 text-center text-sm text-[#666666]">
          No skill gaps identified.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skillGaps.map((gap, index) => {
            const severity = SEVERITY_STYLES[gap.severity] || SEVERITY_STYLES.low;
            return (
              <motion.div
                key={`${gap.skill}-${index}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`rounded-2xl border ${severity.border} bg-white p-5 shadow-sm transition hover:shadow-md`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[#1F1F1F]">{gap.skill}</h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full ${severity.bg} px-2.5 py-1 text-xs font-semibold ${severity.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} />
                    {severity.label}
                  </span>
                </div>
                {gap.reason && (
                  <p className="mt-2.5 text-sm leading-relaxed text-[#666666]">{gap.reason}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}