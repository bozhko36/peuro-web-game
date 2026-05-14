"use client";

import { MINIMART_IMAGE } from "@/lib/constants";
import { useGameStore } from "@/store/gameStore";

export function EstateStrip() {
  const count = useGameStore((state) => state.upgrades.mart);

  return (
    <div className="estate-strip" aria-hidden="true">
      <div className="estate-line">
        {Array.from({ length: count }, (_, index) => (
          <span className="estate-building" style={{ animationDelay: `${index * 24}ms` }} key={index}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MINIMART_IMAGE} alt="" />
          </span>
        ))}
      </div>
      {count === 0 ? <div className="estate-empty">Buy Minimart to grow your block</div> : null}
    </div>
  );
}
