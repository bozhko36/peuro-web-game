export type UpgradeId = "speed" | "count" | "mart";
export type AbilityId = "golden" | "autoCollector" | "lucky" | "business" | "royal";
export type AbilityType = "euro" | "level" | "prestige";

export type UpgradeLevels = Record<UpgradeId, number>;

export interface AbilityState {
  unlocked: boolean;
  cooldownUntil: number;
  activeUntil: number;
}

export type AbilitiesState = Record<AbilityId, AbilityState>;

export interface Upgrade {
  id: UpgradeId | "prestige";
  name: string;
  description: string;
  baseCost?: number;
  maxLevel?: number;
}

export interface RealEstateProperty {
  id: "mart";
  name: string;
  description: string;
  image: string;
}

export interface Ability {
  id: AbilityId;
  label: string;
  type: AbilityType;
  cost?: number;
  requirement?: number;
  duration?: number;
  cooldown?: number;
  passive?: boolean;
}

export interface CasinoReward {
  symbols: string[];
  payout: number;
  jackpot: boolean;
}

export interface FloatingText {
  id: string;
  amount: number;
  x: number;
  y: number;
}

export interface PrestigeState {
  level: number;
  multiplier: number;
  maxLevel: number;
}

export interface GameState {
  money: number;
  totalEarned: number;
  level: number;
  xp: number;
  successfulSwipes: number;
  prestigeLevel: number;
  autoPlayEnabled: boolean;
  upgrades: UpgradeLevels;
  abilities: AbilitiesState;
  selectedCasinoBet: number;
  lastPassiveIncomeAt: number;
  floatingTexts: FloatingText[];
}

export interface LegacySaveState {
  slides?: number;
  playerLevel?: number;
  swipeExp?: number;
  successfulSwipes?: number;
  prestigeLevel?: number;
  upgradeLevels?: Partial<UpgradeLevels>;
  abilityState?: Partial<Record<AbilityId, Partial<AbilityState>>>;
}
