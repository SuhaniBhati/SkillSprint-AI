import { useEffect, useState } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { getMatchScoreBand } from "../../../utils/matchScore";

/**
 * Large animated circular progress showing the overall match score.
 * Animates from 0 to the final score once on mount.
 */
export default function MatchScoreCard({ score }) {
  const band = getMatchScoreBand(score);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimatedScore(score ?? 0));
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-56 w-56 sm:h-64 sm:w-64">
        <div
          className="absolute inset-4 rounded-full opacity-30 blur-2xl"
          style={{ backgroundColor: band.ring }}
        />
        <CircularProgressbarWithChildren
          value={animatedScore}
          strokeWidth={8}
          styles={buildStyles({
            pathTransitionDuration: 1,
            pathColor: band.ring,
            trailColor: "#ECE5EA",
          })}
        >
          <motion.span
            key={animatedScore}
            initial={{ opacity: 0.4, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-5xl font-bold text-[#1F1F1F]"
          >
            {animatedScore}
            <span className="text-2xl align-top">%</span>
          </motion.span>
          <span className={`mt-1 text-sm font-semibold ${band.text}`}>{band.label}</span>
        </CircularProgressbarWithChildren>
      </div>

      <p className="mt-6 max-w-md text-center text-sm text-[#666666]">
        Your profile aligns {band.min >= 70 ? "strongly" : "moderately"} with this role. Focus on
        strengthening the identified skill gaps to maximize interview success.
      </p>
    </div>
  );
}