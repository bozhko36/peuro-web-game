"use client";

import { motion } from "motion/react";

export function CasinoButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button className="slot-spin" type="button" disabled={disabled} whileTap={{ scale: disabled ? 1 : 0.97 }} onClick={onClick}>
      Spin
    </motion.button>
  );
}
