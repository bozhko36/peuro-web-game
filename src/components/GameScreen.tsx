"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { BalanceHud } from "@/components/BalanceHud";
import { LevelProgress } from "@/components/LevelProgress";
import { BillStage } from "@/components/BillStage";
import { StatsStrip } from "@/components/StatsStrip";
import { BottomNav } from "@/components/BottomNav";
import { AbilityButton } from "@/components/AbilityButton";
import { useGameStore } from "@/store/gameStore";
import type { AbilityId } from "@/types/game";

const abilityIds: AbilityId[] = ["golden", "autoCollector", "lucky", "business", "royal"];

export function GameScreen() {
  const [statsOpen, setStatsOpen] = useState(false);
  const [now, setNow] = useState(0);
  const autoPlayEnabled = useGameStore((state) => state.autoPlayEnabled);
  const tapBill = useGameStore((state) => state.tapBill);
  const collectIdleIncome = useGameStore((state) => state.collectIdleIncome);

  useEffect(() => {
    const timer = window.setInterval(() => {
      collectIdleIncome();
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [collectIdleIncome]);

  useEffect(() => {
    if (!autoPlayEnabled) return undefined;
    const timer = window.setInterval(() => tapBill(), 780);
    return () => window.clearInterval(timer);
  }, [autoPlayEnabled, tapBill]);

  return (
    <main className="stage mobile-shell" aria-label="Euro Slide game">
      <BackgroundDecor />
      <button className="stats-toggle panel-surface" type="button" aria-expanded={statsOpen} aria-label={statsOpen ? "Close stats menu" : "Open stats menu"} onClick={() => setStatsOpen((open) => !open)}>
        Menu
      </button>

      <aside className={`stats-menu panel-surface ${statsOpen ? "open" : ""}`} aria-label="Game stats">
        <div className="stats-title">Stats</div>
        <StatsStrip />
      </aside>

      <header className="hud">
        <Link href="/" aria-label="Main game">
          <BalanceHud />
        </Link>
        <LevelProgress />
      </header>

      <BillStage />

      <section className="abilities-strip panel-surface" aria-label="Abilities">
        {abilityIds.map((id) => <AbilityButton id={id} now={now} key={id} />)}
      </section>

      <BottomNav />
    </main>
  );
}
