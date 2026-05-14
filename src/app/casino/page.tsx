"use client";

import { useState } from "react";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { BottomNav } from "@/components/BottomNav";
import { CasinoButton } from "@/components/CasinoButton";
import { Modal } from "@/components/Modal";
import { JACKPOT_IMAGE } from "@/lib/constants";
import { useGameStore } from "@/store/gameStore";
import type { CasinoReward } from "@/types/game";

const baseBets = [100, 500, 1000];
const midBets = [5000, 10000, 20000];
const highBets = [50000, 100000, 200000];

function betsForMoney(money: number) {
  if (money >= 100000) return highBets;
  if (money >= 10000) return midBets;
  return baseBets;
}

export default function CasinoPage() {
  const [result, setResult] = useState<CasinoReward | null>(null);
  const money = useGameStore((state) => state.money);
  const selectedCasinoBet = useGameStore((state) => state.selectedCasinoBet);
  const setCasinoBet = useGameStore((state) => state.setCasinoBet);
  const spinCasino = useGameStore((state) => state.spinCasino);
  const bets = betsForMoney(money);

  return (
    <main className="stage mobile-shell">
      <BackgroundDecor />
      <Modal title="Casino">
        <div className="slot-reels" aria-live="polite">
          {(result?.symbols ?? ["🍒", "jackpot", "⭐"]).map((symbol, index) => (
            <div className="slot-reel spin" key={`${symbol}-${index}`}>
              {symbol === "jackpot" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="slot-jackpot" src={JACKPOT_IMAGE} alt="Jackpot" />
              ) : symbol}
            </div>
          ))}
        </div>
        <div className="slot-bet-row">
          <span className="slot-bet-label">Bet</span>
          <span className="slot-bet-value">{selectedCasinoBet.toLocaleString("en-US")} euro</span>
          <div className="slot-bet-options" role="group" aria-label="Choose casino bet">
            {bets.map((bet) => (
              <button className={`slot-bet-option ${selectedCasinoBet === bet ? "selected" : ""}`} type="button" aria-pressed={selectedCasinoBet === bet} key={bet} onClick={() => setCasinoBet(bet)}>
                <span>{bet.toLocaleString("en-US")}</span>
              </button>
            ))}
          </div>
        </div>
        <CasinoButton disabled={money < selectedCasinoBet} onClick={() => setResult(spinCasino())} />
        <div className="slot-result">
          {result ? result.payout > 0 ? `Won ${result.payout.toLocaleString("en-US")} euro` : `Lost ${selectedCasinoBet.toLocaleString("en-US")} euro` : "Pick a bet and spin"}
        </div>
      </Modal>
      <BottomNav />
    </main>
  );
}
