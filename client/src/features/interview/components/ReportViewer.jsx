import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Code2, Download, Loader2, MessagesSquare, Pencil, Trash2 } from "lucide-react";
import MatchScoreCard from "./MatchScoreCard";
import QuestionSection from "./QuestionSection";
import SkillGapSection from "./SkillGapSection";
import PreparationTimeline from "./PreparationTimeline";
import { cn } from "../../../utils/cn";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "technical", label: "Technical" },
  { id: "behavioral", label: "Behavioral" },
  { id: "skill-gaps", label: "Skill Gaps" },
  { id: "preparation-plan", label: "Preparation Plan" },
];

/**
 * Renders a full interview report. Receives the report data and all
 * action callbacks (rename/delete/download) from the Interview page;
 * contains no API calls of its own.
 */
export default function ReportViewer({
  report,
  onBack,
  onRenameClick,
  onDeleteClick,
  onDownload,
  isDownloading,
}) {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      {/*
        Reserve real horizontal space for the table-of-contents sidebar on
        large screens instead of floating it over the content (the previous
        `fixed` nav overlapped the report body). Below xl the sidebar is
        simply omitted from the flow rather than repositioned.
      */}
      <div className="xl:grid xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start xl:gap-10">
        <aside className="sticky top-24 hidden self-start xl:block">
          <nav className="rounded-2xl border border-[#ECE5EA] bg-white/90 p-2 shadow-sm backdrop-blur-md">
            <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-[#999999]">
              On this page
            </p>
            <div className="flex flex-col gap-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                    activeSection === section.id
                      ? "bg-[#970747]/10 text-[#970747]"
                      : "text-[#666666] hover:bg-[#FAF8FB] hover:text-[#1F1F1F]"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <div className="min-w-0">
          {/* Hero */}
          <motion.section
            id="overview"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="scroll-mt-28 relative overflow-hidden rounded-3xl border border-[#ECE5EA] bg-gradient-to-br from-white to-[#FAF8FB] p-8 shadow-sm"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#EAA7C4]/20 blur-3xl" />
            <button
              type="button"
              onClick={onBack}
              className="relative mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#666666] transition hover:text-[#970747]"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
            <h1 className="relative text-2xl font-bold tracking-tight text-[#1F1F1F] sm:text-3xl">
              {report.title}
            </h1>
            <p className="relative mt-2 text-sm text-[#666666]">
              Generated {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })} •
              Last updated {formatDistanceToNow(new Date(report.updatedAt), { addSuffix: true })}
            </p>
          </motion.section>

          {/* Match score */}
          <div className="mt-10 flex justify-center rounded-3xl border border-[#ECE5EA] bg-white py-12 shadow-sm">
            <MatchScoreCard score={report.matchScore} />
          </div>

          {/* Sticky action bar */}
          <div className="sticky top-4 z-20 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ECE5EA] bg-white/90 p-3 shadow-md backdrop-blur-md">
            <div className="flex flex-wrap gap-2">
              <ActionButton icon={Pencil} label="Rename" onClick={onRenameClick} />
              <ActionButton
                icon={isDownloading ? Loader2 : Download}
                label={isDownloading ? "Preparing PDF..." : "Download PDF"}
                onClick={onDownload}
                disabled={isDownloading}
                spin={isDownloading}
              />
              <ActionButton icon={Trash2} label="Delete" onClick={onDeleteClick} tone="danger" />
            </div>
            <button
              type="button"
              onClick={onBack}
              className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-[#666666] transition hover:bg-[#FAF8FB] sm:flex"
            >
              <ArrowLeft size={14} />
              Dashboard
            </button>
          </div>

          <div className="mt-14 space-y-16">
            <QuestionSection
              id="technical"
              title="Technical Interview Questions"
              description="These personalized technical questions are generated based on your resume and job description."
              icon={Code2}
              questions={report.technicalQuestions}
              emptyMessage="No technical questions available."
              accentColor="#970747"
            />

            <QuestionSection
              id="behavioral"
              title="Behavioral Interview Questions"
              description="Practice telling your story using the STAR method for these common behavioral prompts."
              icon={MessagesSquare}
              questions={report.behavioralQuestions}
              emptyMessage="No behavioral questions available."
              accentColor="#2563EB"
            />

            <SkillGapSection id="skill-gaps" skillGaps={report.skillGaps} />

            <PreparationTimeline id="preparation-plan" plan={report.preparationPlan} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, disabled, tone = "default", spin }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70",
        tone === "danger"
          ? "bg-red-50 text-[#FF3B30] hover:bg-red-100"
          : "bg-gradient-to-r from-[#970747] to-[#D65795] text-white hover:shadow-md"
      )}
    >
      <Icon size={15} className={spin ? "animate-spin" : ""} />
      {label}
    </button>
  );
}