"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { AutoPlayToggle } from "@/components/AutoPlayToggle";
import { useGameStore } from "@/store/gameStore";
import { getUpgradeCost } from "@/lib/upgrades";
import { canPrestige } from "@/lib/prestige";

function NavLink({ href, label, badge, icon }: { href: string; label: string; badge?: string; icon: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <motion.div whileTap={{ scale: 0.96 }}>
      <Link className="control-button menu-toggle panel-surface" aria-expanded={active} aria-label={`Open ${label}`} href={href}>
        {badge ? <span className="nav-badge visible">{badge}</span> : null}
        {icon}
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

export function BottomNav() {
  const money = useGameStore((state) => state.money);
  const level = useGameStore((state) => state.level);
  const prestigeLevel = useGameStore((state) => state.prestigeLevel);
  const upgrades = useGameStore((state) => state.upgrades);
  const upgradeBadge = (["speed", "count"] as const).filter((id) => money >= getUpgradeCost(id, upgrades)).length + (canPrestige(level, prestigeLevel) ? 1 : 0);
  const estateBadge = money >= getUpgradeCost("mart", upgrades) ? "1" : "";

  return (
    <div className="side-controls">
      <div className="controls-row">
        <AutoPlayToggle />
        <NavLink
          href="/upgrades"
          label="Upgrades"
          badge={upgradeBadge ? String(upgradeBadge) : ""}
          icon={<span className="upgrades-icon grid place-items-center text-[26px]">☆</span>}
        />
        <NavLink
          href="/real-estate"
          label="Estate"
          badge={estateBadge}
          icon={<span className="estate-icon grid place-items-center text-[25px]">⌂</span>}
        />
        <NavLink
          href="/casino"
          label="Casino"
          badge={money >= 100 ? "NEW" : ""}
          icon={<span className="casino-icon grid place-items-center text-[26px]">☸</span>}
        />
      </div>
    </div>
  );
}
