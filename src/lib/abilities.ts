import type { Ability, AbilityId, AbilitiesState } from "@/types/game";

export const abilityDefinitions: Ability[] = [
  { id: "golden", label: "Golden Tap", type: "euro", cost: 50000, duration: 60, cooldown: 120 },
  { id: "autoCollector", label: "Auto Collector", type: "euro", cost: 250000, cooldown: 600 },
  { id: "lucky", label: "Lucky Streak", type: "level", requirement: 20, passive: true },
  { id: "business", label: "Business Rush", type: "level", requirement: 50, duration: 60, cooldown: 600 },
  { id: "royal", label: "Royal Reset", type: "prestige", requirement: 1, duration: 45, cooldown: 1800 }
];

export const abilityById = Object.fromEntries(abilityDefinitions.map((ability) => [ability.id, ability])) as Record<AbilityId, Ability>;

export function getAbilityUnlocked(abilityId: AbilityId, level: number, money: number, prestigeLevel: number): boolean {
  const ability = abilityById[abilityId];
  if (ability.type === "euro") return money >= (ability.cost ?? 0);
  if (ability.type === "level") return level >= (ability.requirement ?? 0);
  return prestigeLevel >= (ability.requirement ?? 0);
}

export function isOnCooldown(abilities: AbilitiesState, id: AbilityId, now = Date.now()): boolean {
  return abilities[id].cooldownUntil > now;
}
