import type { AbilitiesState, UpgradeLevels } from "@/types/game";

export const SAVE_KEY = "euro-slide-casino-save";
export const SAVE_VERSION = 2;
export const MAX_UPGRADE_LEVEL = 50;
export const MAX_PRESTIGE_LEVEL = 5;
export const PRESTIGE_LEVEL_REQUIREMENT = 20;
export const BILL_IMAGE = "/assets/banknote.png";
export const JACKPOT_IMAGE = "/assets/jackpot.png";
export const MINIMART_IMAGE = "/assets/minimart.png";

export const DEFAULT_UPGRADES: UpgradeLevels = {
  speed: 0,
  count: 0,
  mart: 0
};

export const DEFAULT_ABILITIES: AbilitiesState = {
  golden: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
  autoCollector: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
  lucky: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
  business: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
  royal: { unlocked: false, cooldownUntil: 0, activeUntil: 0 }
};

export const SLOT_SYMBOLS = ["🍒", "jackpot", "⭐", "🍀", "🔥", "💰", "⚡", "🍋"] as const;
