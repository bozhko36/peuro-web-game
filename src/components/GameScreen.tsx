"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { BalanceHud } from "@/components/BalanceHud";
import { LevelProgress } from "@/components/LevelProgress";
import { BillStage } from "@/components/BillStage";
import { BottomNav } from "@/components/BottomNav";
import { AbilityButton } from "@/components/AbilityButton";
import { useGameStore } from "@/store/gameStore";
import type { AbilityId } from "@/types/game";

const abilityIds: AbilityId[] = ["golden", "autoCollector", "lucky", "business", "royal"];

export function GameScreen() {
  const [now, setNow] = useState(() => Date.now());
  const autoPlayEnabled = useGameStore((state) => state.autoPlayEnabled);
  const abilities = useGameStore((state) => state.abilities);
  const collectIdleIncome = useGameStore((state) => state.collectIdleIncome);
  const hasTimedAbility = Object.values(abilities).some((ability) => ability.activeUntil > now || ability.cooldownUntil > now);

  useEffect(() => {
    const timer = window.setInterval(() => collectIdleIncome(), 1000);
    return () => window.clearInterval(timer);
  }, [collectIdleIncome]);

  useEffect(() => {
    if (!hasTimedAbility) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [hasTimedAbility]);

  return (
    <main className="stage mobile-shell" aria-label="Euro Slide game">
      <BackgroundDecor />

      <header className="hud">
        <Link href="/" aria-label="Main game">
          <BalanceHud />
        </Link>
        <LevelProgress />
      </header>

      <BillStage autoPlayEnabled={autoPlayEnabled} />

      <section className="abilities-strip panel-surface" aria-label="Abilities">
        {abilityIds.map((id) => <AbilityButton id={id} now={now} key={id} />)}
      </section>

      <BottomNav />
    </main>
  );
}
