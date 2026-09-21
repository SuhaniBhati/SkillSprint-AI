/**
 * Central source of truth for how a match score (0-100) is presented
 * across the app. Keeping this in one place guarantees ReportCard,
 * MatchScoreCard, and any future component agree on the same bands.
 */
export const MATCH_SCORE_BANDS = [
  {
    min: 90,
    max: 100,
    label: "Excellent Match",
    short: "Excellent",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "#0F9D58",
    gradient: ["#0F9D58", "#34C759"],
  },
  {
    min: 80,
    max: 89,
    label: "Great Match",
    short: "Great",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "#34C759",
    gradient: ["#34C759", "#6EE7A8"],
  },
  {
    min: 70,
    max: 79,
    label: "Good Match",
    short: "Good",
    text: "text-blue-600",
    bg: "bg-blue-50",
    ring: "#2563EB",
    gradient: ["#2563EB", "#60A5FA"],
  },
  {
    min: 60,
    max: 69,
    label: "Average Match",
    short: "Average",
    text: "text-amber-600",
    bg: "bg-amber-50",
    ring: "#FF9500",
    gradient: ["#FF9500", "#FFC24B"],
  },
  {
    min: 0,
    max: 59,
    label: "Needs Improvement",
    short: "Needs Work",
    text: "text-red-600",
    bg: "bg-red-50",
    ring: "#FF3B30",
    gradient: ["#FF3B30", "#FF7A70"],
  },
];

export function getMatchScoreBand(score) {
  const normalized = Number.isFinite(score) ? score : 0;
  return (
    MATCH_SCORE_BANDS.find((band) => normalized >= band.min && normalized <= band.max) ??
    MATCH_SCORE_BANDS[MATCH_SCORE_BANDS.length - 1]
  );
}

export const SEVERITY_STYLES = {
  high: {
    label: "High",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
};