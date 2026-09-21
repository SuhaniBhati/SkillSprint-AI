import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2 } from "lucide-react";

/**
 * Renders the day-by-day preparation plan as a vertical timeline.
 */
export default function PreparationTimeline({ id, plan = [] }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <CalendarDays size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#1F1F1F] sm:text-2xl">
            Preparation Timeline
          </h2>
          <p className="mt-0.5 text-sm text-[#666666]">
            Your day-by-day roadmap heading into the interview.
          </p>
        </div>
      </div>

      {plan.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE5EA] bg-white/60 px-6 py-10 text-center text-sm text-[#666666]">
          No preparation plan available.
        </div>
      ) : (
        <div className="relative pl-8">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#970747] via-[#C74D81] to-[#ECE5EA]"
          />

          <div className="space-y-6">
            {plan.map((day, index) => (
              <motion.div
                key={day.day ?? index}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-8 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#970747] to-[#D65795] text-[10px] font-bold text-white ring-4 ring-[#FAF8FB]">
                  {day.day}
                </span>

                <div className="rounded-2xl border border-[#ECE5EA] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#970747]">
                    Day {day.day}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-[#1F1F1F]">{day.focus}</h3>
                  {day.tasks?.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {day.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-2 text-sm text-[#666666]">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#34C759]" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}