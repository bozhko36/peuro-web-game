"use client";

import { motion } from "motion/react";
import { formatWholeEuro } from "@/lib/format";
import { useGameStore } from "@/store/gameStore";

export function BalanceHud() {
  const money = useGameStore((state) => state.money);
  const label = formatWholeEuro(money).replace("€", "");

  return (
    <motion.div className="score panel-surface" aria-live="polite" aria-label={`${label} euro`}>
      <span className="score-flare" aria-hidden="true" />
      <span className="balance-caption">Balance</span>
      <motion.span className="score-label" key={Math.floor(money)} initial={{ scale: 0.96 }} animate={{ scale: 1 }}>
        <span className="amount" id="slides">{label}</span>
        <span className="currency">euro</span>
      </motion.span>
    </motion.div>
  );
}
