import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../utils/cn";

/**
 * Reusable accordion list for interview questions. Used for both the
 * Technical and Behavioral sections with different copy/icon/accent props.
 */
export default function QuestionSection({
  id,
  title,
  description,
  icon: Icon,
  questions = [],
  emptyMessage,
  accentColor = "#970747",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-6 flex items-center gap-3">
        {Icon && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
          >
            <Icon size={20} />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-[#1F1F1F] sm:text-2xl">{title}</h2>
          <p className="mt-0.5 text-sm text-[#666666]">{description}</p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ECE5EA] bg-white/60 px-6 py-10 text-center text-sm text-[#666666]">
          {emptyMessage || "No questions available."}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                style={{ borderLeftColor: accentColor }}
                className="overflow-hidden rounded-2xl border border-[#ECE5EA] border-l-4 bg-white transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                      Question {index + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1F1F1F] sm:text-base">
                      {item.question}
                    </p>
                  </div>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-[#666666] transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="px-5"
                    >
                      <div className="space-y-4 border-t border-[#ECE5EA] pb-5 pt-4">
                        {item.intention && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                              Why the interviewer asks this
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#666666]">
                              {item.intention}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                            Suggested Answer
                          </p>
                          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#1F1F1F]">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}