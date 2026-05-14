import { MAX_UPGRADE_LEVEL } from "@/lib/constants";
import type { Upgrade, UpgradeId, UpgradeLevels } from "@/types/game";

export const upgradeDefinitions: Upgrade[] = [
  { id: "speed", name: "Speed", description: "Faster bill and auto-play animations.", baseCost: 5, maxLevel: MAX_UPGRADE_LEVEL },
  { id: "count", name: "Count", description: "More euro earned per slide.", baseCost: 10, maxLevel: MAX_UPGRADE_LEVEL },
  { id: "prestige", name: "Prestige", description: "Reset progress for permanent multiplier." }
];

export const upgradeBaseCosts: Record<UpgradeId, number> = {
  speed: 5,
  count: 10,
  mart: 50
};

export function getUpgradeCost(id: UpgradeId, upgrades: UpgradeLevels): number {
  if (upgrades[id] >= MAX_UPGRADE_LEVEL) return 0;
  const nextLevel = upgrades[id] + 1;
  return upgradeBaseCosts[id] * nextLevel * nextLevel;
}

export function getSpeedMultiplier(upgrades: UpgradeLevels): number {
  return 1 + upgrades.speed * 0.045;
}
