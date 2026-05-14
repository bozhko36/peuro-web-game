"use client";

import { motion } from "motion/react";
import { formatMultiplier } from "@/lib/format";
import { canPrestige } from "@/lib/prestige";
import { getUpgradeCost } from "@/lib/upgrades";
import { MAX_PRESTIGE_LEVEL, MAX_UPGRADE_LEVEL, PRESTIGE_LEVEL_REQUIREMENT } from "@/lib/constants";
import { useGameStore } from "@/store/gameStore";
import type { UpgradeId } from "@/types/game";

export function UpgradeCard({ id, name }: { id: UpgradeId | "prestige"; name: string }) {
  const money = useGameStore((state) => state.money);
  const level = useGameStore((state) => state.level);
  const prestigeLevel = useGameStore((state) => state.prestigeLevel);
  const upgrades = useGameStore((state) => state.upgrades);
  const buyUpgrade = useGameStore((state) => state.buyUpgrade);

  const isPrestige = id === "prestige";
  const upgradeLevel = isPrestige ? prestigeLevel : upgrades[id];
  const disabled = isPrestige
    ? !canPrestige(level, prestigeLevel)
    : upgradeLevel >= MAX_UPGRADE_LEVEL || money < getUpgradeCost(id, upgrades);
  const cost = isPrestige
    ? prestigeLevel >= MAX_PRESTIGE_LEVEL ? "Max" : `Level ${PRESTIGE_LEVEL_REQUIREMENT} · ${prestigeLevel}/${MAX_PRESTIGE_LEVEL}`
    : upgradeLevel >= MAX_UPGRADE_LEVEL ? "Max" : `${getUpgradeCost(id, upgrades)} euro`;

  return (
    <motion.button
      className={`upgrade-tab ${isPrestige ? "prestige-tab" : ""}`}
      type="button"
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={() => buyUpgrade(id)}
    >
      <span className="upgrade-name">{name}</span>
      <span className="upgrade-level">{isPrestige ? "Bonus" : "Level"} <span>{isPrestige ? formatMultiplier(1 + prestigeLevel * 0.35) : `${upgradeLevel}/50`}</span></span>
      <span className="upgrade-cost">{cost}</span>
    </motion.button>
  );
}
