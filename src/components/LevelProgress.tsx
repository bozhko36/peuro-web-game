"use client";

import { motion } from "motion/react";
import { formatProgressNumber } from "@/lib/format";
import { calculateXpToNextLevel } from "@/lib/leveling";
import { useGameStore } from "@/store/gameStore";

export function LevelProgress() {
  const level = useGameStore((state) => state.level);
  const xp = useGameStore((state) => state.xp);
  const needed = calculateXpToNextLevel(level);
  const progress = Math.max(0, Math.min(100, (xp / needed) * 100));

  return (
    <div className="level-panel panel-surface">
      <span className="level-text" id="level">Level {level}</span>
      <span className="xp-track" aria-hidden="true">
        <motion.span className="xp-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.25 }} />
      </span>
      <span className="xp-progress-text" id="xp-progress">
        {formatProgressNumber(xp)} / {needed} XP · {Math.round(progress)}%
      </span>
    </div>
  );
}
