import { MAX_PRESTIGE_LEVEL, PRESTIGE_LEVEL_REQUIREMENT } from "@/lib/constants";

export function calculatePrestigeMultiplier(prestigeLevel: number): number {
  return 1 + prestigeLevel * 0.35;
}

export function canPrestige(level: number, prestigeLevel: number): boolean {
  return prestigeLevel < MAX_PRESTIGE_LEVEL && level >= PRESTIGE_LEVEL_REQUIREMENT;
}
