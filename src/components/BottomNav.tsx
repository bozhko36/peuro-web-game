"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { AutoPlayToggle } from "@/components/AutoPlayToggle";

function NavLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <motion.div whileTap={{ scale: 0.96 }}>
      <Link className="control-button menu-toggle panel-surface" aria-expanded={active} aria-label={`Open ${label}`} href={href}>
        {icon}
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

export function BottomNav() {
  return (
    <div className="side-controls">
      <div className="controls-row">
        <AutoPlayToggle />
        <NavLink
          href="/upgrades"
          label="Upgrades"
          icon={<span className="upgrades-icon grid place-items-center text-[26px]">☆</span>}
        />
        <NavLink
          href="/real-estate"
          label="Estate"
          icon={<span className="estate-icon grid place-items-center text-[25px]">⌂</span>}
        />
        <NavLink
          href="/casino"
          label="Casino"
          icon={<span className="casino-icon grid place-items-center text-[26px]">☸</span>}
        />
      </div>
    </div>
  );
}
