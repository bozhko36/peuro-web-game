"use client";

import { motion } from "motion/react";
import { abilityById } from "@/lib/abilities";
import { formatAbilityTime } from "@/lib/format";
import { useGameStore } from "@/store/gameStore";
import type { AbilityId } from "@/types/game";

const icons: Record<AbilityId, string> = {
  golden: "€",
  autoCollector: "◴",
  lucky: "×10",
  business: "⌂",
  royal: "★"
};

const names: Record<AbilityId, string> = {
  golden: "Golden",
  autoCollector: "Collect",
  lucky: "Lucky",
  business: "Rush",
  royal: "Royal"
};

export function AbilityButton({ id, now }: { id: AbilityId; now: number }) {
  const ability = abilityById[id];
  const state = useGameStore((store) => store.abilities[id]);
  const money = useGameStore((store) => store.money);
  const level = useGameStore((store) => store.level);
  const prestigeLevel = useGameStore((store) => store.prestigeLevel);
  const activateAbility = useGameStore((store) => store.activateAbility);

  const unlocked = state.unlocked
    || (ability.type === "euro" ? money >= (ability.cost ?? 0) : ability.type === "level" ? level >= (ability.requirement ?? 0) : prestigeLevel >= (ability.requirement ?? 0));
  const active = state.activeUntil > now;
  const cooldown = state.cooldownUntil > now;
  const unaffordable = ability.type === "euro" && money < (ability.cost ?? 0);
  const unavailable = !unlocked || cooldown || ability.passive || unaffordable;
  const meta = !unlocked
    ? ability.type === "euro"
      ? `${(ability.cost ?? 0).toLocaleString("en-US")}€`
      : ability.type === "level"
        ? `Lv ${ability.requirement}`
        : `P${ability.requirement}`
    : active
      ? formatAbilityTime(state.activeUntil - now)
      : cooldown
        ? formatAbilityTime(state.cooldownUntil - now)
        : ability.passive
          ? "ON"
          : "Ready";

  return (
    <motion.button
      className={`ability-button ${!unlocked ? "locked" : ""} ${cooldown ? "cooldown" : ""} ${active ? "active" : ""} ${unavailable ? "is-disabled" : ""}`}
      type="button"
      whileTap={{ scale: unavailable ? 1 : 0.96 }}
      onClick={() => activateAbility(id)}
      aria-label={`${ability.label} ${meta}`}
    >
      <span className="ability-icon">{icons[id]}</span>
      <span className="ability-name">{names[id]}</span>
      <span className="ability-meta">{meta}</span>
    </motion.button>
  );
}
