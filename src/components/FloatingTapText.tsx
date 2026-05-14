"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { formatEuro } from "@/lib/format";
import { useGameStore } from "@/store/gameStore";

export function FloatingTapText() {
  const floatingTexts = useGameStore((state) => state.floatingTexts);
  const removeFloatingText = useGameStore((state) => state.removeFloatingText);

  return (
    <AnimatePresence>
      {floatingTexts.map((text) => (
        <motion.span
          key={text.id}
          className="tap-float"
          style={{ "--x": `${text.x}%`, "--y": `${text.y}%` } as CSSProperties}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -22 }}
          exit={{ opacity: 0, y: -52 }}
          transition={{ duration: 0.65 }}
          onAnimationComplete={() => removeFloatingText(text.id)}
        >
          +{formatEuro(text.amount)}
        </motion.span>
      ))}
    </AnimatePresence>
  );
}
