import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Pure presentational header for the dashboard. Receives the username and
 * a render-ready profile trigger; contains no API or business logic.
 *
 * The decorative gradient blobs live in their own absolutely-positioned,
 * overflow-hidden layer that sits behind the content. The content layer
 * (including the profile trigger/dropdown slot) has no overflow-hidden
 * ancestor, so a dropdown opened from `children` is free to render past
 * the header's bottom edge instead of being clipped by it.
 */
export default function DashboardHeader({ username, children }) {
  return (
    <header className="relative rounded-3xl border border-[#ECE5EA] bg-gradient-to-br from-[#970747] via-[#B03D6B] to-[#D65795] px-6 py-10 shadow-[0_20px_60px_-25px_rgba(151,7,71,0.55)] sm:px-10 sm:py-14">
      {/* Decorative layer - clipped to the rounded card, nothing else lives here */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-[#EAA7C4]/30 blur-3xl" />
      </div>

      {/* Content layer - unclipped, so the profile dropdown can escape the header freely */}
      <div className="relative flex items-start justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="min-w-0"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Sparkles size={14} strokeWidth={2.5} />
            AI Interview Coach
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome back{username ? `, ${username}` : ""}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            Track every interview report you've generated and see where to focus next.
          </p>
        </motion.div>

        <div className="shrink-0 pt-1">{children}</div>
      </div>
    </header>
  );
}