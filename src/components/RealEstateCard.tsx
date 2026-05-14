"use client";

import { motion } from "motion/react";
import { MINIMART_IMAGE } from "@/lib/constants";
import { getRealEstateCost } from "@/lib/realEstate";
import { useGameStore } from "@/store/gameStore";

export function RealEstateCard() {
  const money = useGameStore((state) => state.money);
  const upgrades = useGameStore((state) => state.upgrades);
  const buyRealEstate = useGameStore((state) => state.buyRealEstate);
  const cost = getRealEstateCost(upgrades);

  return (
    <motion.button className="estate-card" type="button" disabled={money < cost} whileTap={{ scale: money < cost ? 1 : 0.98 }} onClick={() => buyRealEstate("mart")}>
      <span className="estate-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MINIMART_IMAGE} alt="" />
      </span>
      <span className="estate-copy">
        <span className="estate-name">Minimart</span>
        <span className="estate-level">Level <span>{upgrades.mart}</span>/50</span>
        <span className="estate-note">Passive euro every second</span>
      </span>
      <span className="estate-cost">{cost ? `${cost} euro` : "Max"}</span>
    </motion.button>
  );
}
