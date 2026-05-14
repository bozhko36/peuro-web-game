"use client";

import { BackgroundDecor } from "@/components/BackgroundDecor";
import { BottomNav } from "@/components/BottomNav";
import { Modal } from "@/components/Modal";
import { formatMultiplier } from "@/lib/format";
import { calculatePrestigeMultiplier, canPrestige } from "@/lib/prestige";
import { MAX_PRESTIGE_LEVEL, PRESTIGE_LEVEL_REQUIREMENT } from "@/lib/constants";
import { useGameStore } from "@/store/gameStore";

export default function PrestigePage() {
  const level = useGameStore((state) => state.level);
  const prestigeLevel = useGameStore((state) => state.prestigeLevel);
  const prestige = useGameStore((state) => state.prestige);
  const ready = canPrestige(level, prestigeLevel);

  return (
    <main className="stage mobile-shell">
      <BackgroundDecor />
      <Modal title="Prestige">
        <p className="text-center text-sm text-[var(--muted)]">
          Reset money, level, upgrades, estate, and abilities for a permanent income bonus.
        </p>
        <div className="casino-panel p-4 text-center">
          <div className="text-sm uppercase tracking-[0.2em] text-[var(--gold)]">Current Bonus</div>
          <div className="mt-2 text-4xl font-black">{formatMultiplier(calculatePrestigeMultiplier(prestigeLevel))}</div>
          <div className="mt-2 text-xs text-[var(--muted)]">Prestige {prestigeLevel} / {MAX_PRESTIGE_LEVEL}</div>
        </div>
        <button className="slot-spin" type="button" disabled={!ready} onClick={() => prestige()}>
          {ready ? "Prestige" : `Reach Level ${PRESTIGE_LEVEL_REQUIREMENT}`}
        </button>
      </Modal>
      <BottomNav />
    </main>
  );
}
