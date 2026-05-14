"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_ABILITIES, DEFAULT_UPGRADES, MAX_PRESTIGE_LEVEL, MAX_UPGRADE_LEVEL, SAVE_KEY } from "@/lib/constants";
import { abilityById, abilityDefinitions, getAbilityUnlocked, isOnCooldown } from "@/lib/abilities";
import { addExperience, calculateXpToNextLevel } from "@/lib/leveling";
import { canPrestige } from "@/lib/prestige";
import { calculateIdleIncome, calculateTapValue } from "@/lib/economy";
import { getUpgradeCost } from "@/lib/upgrades";
import type { AbilitiesState, AbilityId, FloatingText, GameState, LegacySaveState, UpgradeId, UpgradeLevels } from "@/types/game";
import { SLOT_SYMBOLS } from "@/lib/constants";
import type { CasinoReward } from "@/types/game";

type GameActions = {
  tapBill: (origin?: { x: number; y: number }) => number;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  addXp: (amount: number) => void;
  levelUpIfNeeded: () => void;
  toggleAutoPlay: () => void;
  setAutoPlay: (enabled: boolean) => void;
  buyUpgrade: (id: UpgradeId | "prestige") => boolean;
  buyRealEstate: (id: "mart") => boolean;
  activateAbility: (id: AbilityId) => boolean;
  setCasinoBet: (amount: number) => void;
  spinCasino: () => CasinoReward | null;
  prestige: () => boolean;
  resetGame: () => void;
  collectIdleIncome: () => void;
  removeFloatingText: (id: string) => void;
  hydrateFromSave: (save: LegacySaveState) => void;
};

export type GameStore = GameState & GameActions;

const initialState: GameState = {
  money: 56,
  totalEarned: 56,
  level: 0,
  xp: 0,
  successfulSwipes: 0,
  prestigeLevel: 0,
  autoPlayEnabled: false,
  upgrades: { ...DEFAULT_UPGRADES },
  abilities: structuredClone(DEFAULT_ABILITIES),
  selectedCasinoBet: 100,
  lastPassiveIncomeAt: Date.now(),
  floatingTexts: []
};

function sanitizeUpgradeLevels(upgrades?: Partial<UpgradeLevels>): UpgradeLevels {
  return {
    speed: Math.min(MAX_UPGRADE_LEVEL, Math.max(0, Math.floor(upgrades?.speed ?? 0))),
    count: Math.min(MAX_UPGRADE_LEVEL, Math.max(0, Math.floor(upgrades?.count ?? 0))),
    mart: Math.min(MAX_UPGRADE_LEVEL, Math.max(0, Math.floor(upgrades?.mart ?? 0)))
  };
}

function sanitizeAbilities(abilities?: Partial<Record<AbilityId, Partial<AbilitiesState[AbilityId]>>>): AbilitiesState {
  const next = structuredClone(DEFAULT_ABILITIES);
  abilityDefinitions.forEach(({ id }) => {
    const ability = abilities?.[id];
    next[id] = {
      unlocked: ability?.unlocked === true,
      cooldownUntil: Math.max(0, Math.floor(ability?.cooldownUntil ?? 0)),
      activeUntil: Math.max(0, Math.floor(ability?.activeUntil ?? 0))
    };
  });
  return next;
}

function migrateLegacySave(): Partial<GameState> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: LegacySaveState };
    const legacy = parsed?.state;
    if (!legacy || typeof legacy !== "object" || "money" in legacy) return null;

    return {
      money: Math.max(0, Math.floor(legacy.slides ?? 56)),
      totalEarned: Math.max(0, Math.floor(legacy.slides ?? 56)),
      level: Math.max(0, Math.floor(legacy.playerLevel ?? 0)),
      xp: Math.max(0, Math.floor(legacy.swipeExp ?? 0)),
      successfulSwipes: Math.max(0, Math.floor(legacy.successfulSwipes ?? 0)),
      prestigeLevel: Math.min(MAX_PRESTIGE_LEVEL, Math.max(0, Math.floor(legacy.prestigeLevel ?? 0))),
      upgrades: sanitizeUpgradeLevels(legacy.upgradeLevels),
      abilities: sanitizeAbilities(legacy.abilityState),
      lastPassiveIncomeAt: Date.now()
    };
  } catch {
    return null;
  }
}

function addFloatingText(state: GameState, amount: number, origin?: { x: number; y: number }): FloatingText[] {
  return [
    ...state.floatingTexts,
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      amount,
      x: origin?.x ?? 50,
      y: origin?.y ?? 42
    }
  ].slice(-8);
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      tapBill: (origin) => {
        const state = get();
        const hasLucky = state.abilities.lucky.unlocked || getAbilityUnlocked("lucky", state.level, state.money, state.prestigeLevel);
        const luckyMultiplier = state.autoPlayEnabled || !hasLucky || Math.random() >= 0.01 ? 1 : 10;
        const reward = calculateTapValue(state.upgrades, state.prestigeLevel, state.abilities) * luckyMultiplier;
        const leveled = addExperience(state.level, state.xp, reward);
        set({
          money: state.money + reward,
          totalEarned: state.totalEarned + reward,
          level: leveled.level,
          xp: leveled.xp,
          successfulSwipes: state.successfulSwipes + 1,
          floatingTexts: addFloatingText(state, reward, origin)
        });
        return reward;
      },

      addMoney: (amount) => {
        set((state) => ({
          money: Math.max(0, state.money + amount),
          totalEarned: state.totalEarned + Math.max(0, amount)
        }));
      },

      spendMoney: (amount) => {
        if (get().money < amount) return false;
        set((state) => ({ money: Math.max(0, state.money - amount) }));
        return true;
      },

      addXp: (amount) => {
        const state = get();
        set(addExperience(state.level, state.xp, amount));
      },

      levelUpIfNeeded: () => {
        const state = get();
        set(addExperience(state.level, state.xp, 0));
      },

      toggleAutoPlay: () => set((state) => ({ autoPlayEnabled: !state.autoPlayEnabled })),
      setAutoPlay: (enabled) => set({ autoPlayEnabled: enabled }),

      buyUpgrade: (id) => {
        if (id === "prestige") return get().prestige();
        const state = get();
        if (state.upgrades[id] >= MAX_UPGRADE_LEVEL) return false;
        const cost = getUpgradeCost(id, state.upgrades);
        if (state.money < cost) return false;
        set({
          money: state.money - cost,
          upgrades: { ...state.upgrades, [id]: state.upgrades[id] + 1 }
        });
        return true;
      },

      buyRealEstate: (id) => get().buyUpgrade(id),

      activateAbility: (id) => {
        const state = get();
        const ability = abilityById[id];
        const now = Date.now();
        const current = state.abilities[id];
        const unlocked = current.unlocked || getAbilityUnlocked(id, state.level, state.money, state.prestigeLevel);
        if (!unlocked || ability.passive || isOnCooldown(state.abilities, id, now)) return false;
        if (ability.type === "euro" && state.money < (ability.cost ?? 0)) return false;

        const nextAbilities = {
          ...state.abilities,
          [id]: {
            unlocked: true,
            activeUntil: ability.duration ? now + ability.duration * 1000 : current.activeUntil,
            cooldownUntil: ability.cooldown ? now + ability.cooldown * 1000 : current.cooldownUntil
          }
        };
        let money = ability.type === "euro" ? state.money - (ability.cost ?? 0) : state.money;
        let totalEarned = state.totalEarned;

        if (id === "autoCollector") {
          const collected = calculateIdleIncome(state.upgrades, state.prestigeLevel, state.abilities) * 300;
          money += collected;
          totalEarned += collected;
        }

        set({ money, totalEarned, abilities: nextAbilities });
        return true;
      },

      setCasinoBet: (amount) => set({ selectedCasinoBet: amount }),

      spinCasino: () => {
        const state = get();
        const bet = Math.min(state.selectedCasinoBet, Math.floor(state.money));
        if (bet <= 0 || state.money < bet) return null;
        const symbols = Array.from({ length: 3 }, () => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
        const jackpot = symbols.every((symbol) => symbol === symbols[0]);
        const pair = !jackpot && new Set(symbols).size === 2;
        const payout = jackpot ? bet * 8 : pair ? bet * 2 : 0;
        const money = state.money - bet + payout;
        set({
          money,
          totalEarned: state.totalEarned + payout
        });
        return { symbols: [...symbols], payout, jackpot };
      },

      prestige: () => {
        const state = get();
        if (!canPrestige(state.level, state.prestigeLevel)) return false;
        set({
          money: 0,
          level: 0,
          xp: 0,
          successfulSwipes: 0,
          prestigeLevel: state.prestigeLevel + 1,
          autoPlayEnabled: false,
          upgrades: { ...DEFAULT_UPGRADES },
          abilities: structuredClone(DEFAULT_ABILITIES),
          lastPassiveIncomeAt: Date.now(),
          floatingTexts: []
        });
        return true;
      },

      resetGame: () => set({ ...initialState, abilities: structuredClone(DEFAULT_ABILITIES), upgrades: { ...DEFAULT_UPGRADES } }),

      collectIdleIncome: () => {
        const state = get();
        const now = Date.now();
        const elapsedSeconds = Math.floor(Math.max(0, now - state.lastPassiveIncomeAt) / 1000);
        if (elapsedSeconds <= 0) return;
        const income = calculateIdleIncome(state.upgrades, state.prestigeLevel, state.abilities) * elapsedSeconds;
        set({
          money: state.money + income,
          totalEarned: state.totalEarned + income,
          lastPassiveIncomeAt: state.lastPassiveIncomeAt + elapsedSeconds * 1000
        });
      },

      removeFloatingText: (id) => set((state) => ({ floatingTexts: state.floatingTexts.filter((text) => text.id !== id) })),

      hydrateFromSave: (save) => {
        set({
          money: Math.max(0, Math.floor(save.slides ?? 56)),
          totalEarned: Math.max(0, Math.floor(save.slides ?? 56)),
          level: Math.max(0, Math.floor(save.playerLevel ?? 0)),
          xp: Math.max(0, Math.floor(save.swipeExp ?? 0)),
          successfulSwipes: Math.max(0, Math.floor(save.successfulSwipes ?? 0)),
          prestigeLevel: Math.min(MAX_PRESTIGE_LEVEL, Math.max(0, Math.floor(save.prestigeLevel ?? 0))),
          upgrades: sanitizeUpgradeLevels(save.upgradeLevels),
          abilities: sanitizeAbilities(save.abilityState),
          lastPassiveIncomeAt: Date.now()
        });
      }
    }),
    {
      name: SAVE_KEY,
      version: 2,
      partialize: (state) => ({
        money: state.money,
        totalEarned: state.totalEarned,
        level: state.level,
        xp: state.xp,
        successfulSwipes: state.successfulSwipes,
        prestigeLevel: state.prestigeLevel,
        autoPlayEnabled: state.autoPlayEnabled,
        upgrades: state.upgrades,
        abilities: state.abilities,
        selectedCasinoBet: state.selectedCasinoBet,
        lastPassiveIncomeAt: state.lastPassiveIncomeAt
      }),
      migrate: (persisted) => {
        const legacy = migrateLegacySave();
        if (legacy) return { ...initialState, ...legacy };
        return persisted as GameState;
      }
    }
  )
);

export function useXpToNextLevel(): number {
  return useGameStore((state) => calculateXpToNextLevel(state.level));
}
