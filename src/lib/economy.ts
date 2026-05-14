import type { AbilitiesState, UpgradeLevels } from "@/types/game";
import { calculatePrestigeMultiplier } from "@/lib/prestige";

export function isAbilityActive(abilities: AbilitiesState, id: keyof AbilitiesState, now = Date.now()): boolean {
  return abilities[id].activeUntil > now;
}

export function calculateTapMultiplier(prestigeLevel: number, abilities: AbilitiesState, now = Date.now()): number {
  let multiplier = calculatePrestigeMultiplier(prestigeLevel);
  if (isAbilityActive(abilities, "golden", now)) multiplier *= 3;
  if (isAbilityActive(abilities, "royal", now)) multiplier *= 5;
  return multiplier;
}

export function calculateIdleMultiplier(prestigeLevel: number, abilities: AbilitiesState, now = Date.now()): number {
  let multiplier = calculatePrestigeMultiplier(prestigeLevel);
  if (isAbilityActive(abilities, "business", now)) multiplier *= 2;
  if (isAbilityActive(abilities, "royal", now)) multiplier *= 5;
  return multiplier;
}

export function calculateTapValue(upgrades: UpgradeLevels, prestigeLevel: number, abilities: AbilitiesState): number {
  return Math.max(1, Math.round((1 + upgrades.count) * calculateTapMultiplier(prestigeLevel, abilities)));
}

export function calculateIdleIncome(upgrades: UpgradeLevels, prestigeLevel: number, abilities: AbilitiesState): number {
  return Math.round(upgrades.mart * calculateIdleMultiplier(prestigeLevel, abilities));
}
