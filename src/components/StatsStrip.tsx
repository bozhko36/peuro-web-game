"use client";

import { formatEuro, formatMultiplier } from "@/lib/format";
import { calculateIdleIncome, calculateTapValue } from "@/lib/economy";
import { calculatePrestigeMultiplier } from "@/lib/prestige";
import { useGameStore } from "@/store/gameStore";

export function StatsStrip() {
  const upgrades = useGameStore((state) => state.upgrades);
  const prestigeLevel = useGameStore((state) => state.prestigeLevel);
  const abilities = useGameStore((state) => state.abilities);

  return (
    <section className="stats-strip" aria-label="Idle game stats">
      <div className="stat-item">
        <span className="stat-icon" aria-hidden="true">€</span>
        <span>
          <span className="stat-label">Earn / Tap</span>
          <span className="stat-value">{formatEuro(calculateTapValue(upgrades, prestigeLevel, abilities))}</span>
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-icon" aria-hidden="true">◴</span>
        <span>
          <span className="stat-label">Idle / Sec</span>
          <span className="stat-value">{formatEuro(calculateIdleIncome(upgrades, prestigeLevel, abilities))}</span>
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-icon" aria-hidden="true">↗</span>
        <span>
          <span className="stat-label">Prestige</span>
          <span className="stat-value">{formatMultiplier(calculatePrestigeMultiplier(prestigeLevel))}</span>
        </span>
      </div>
    </section>
  );
}
