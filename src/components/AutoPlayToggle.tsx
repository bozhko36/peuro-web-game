"use client";

import { motion } from "motion/react";
import { useGameStore } from "@/store/gameStore";

export function AutoPlayToggle() {
  const enabled = useGameStore((state) => state.autoPlayEnabled);
  const toggleAutoPlay = useGameStore((state) => state.toggleAutoPlay);

  return (
    <motion.button
      className="control-card auto-toggle panel-surface"
      type="button"
      aria-pressed={enabled}
      aria-label={enabled ? "Auto Play on" : "Auto Play off"}
      whileTap={{ scale: 0.96 }}
      onClick={toggleAutoPlay}
    >
      <span className="auto-title">Auto Play</span>
      <span className="auto-switch" aria-hidden="true" />
      <span className="auto-state">{enabled ? "ON" : "OFF"}</span>
    </motion.button>
  );
}
