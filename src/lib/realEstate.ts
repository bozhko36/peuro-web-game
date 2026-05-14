import { MINIMART_IMAGE } from "@/lib/constants";
import { getUpgradeCost } from "@/lib/upgrades";
import type { RealEstateProperty, UpgradeLevels } from "@/types/game";

export const realEstateProperties: RealEstateProperty[] = [
  {
    id: "mart",
    name: "Minimart",
    description: "Passive euro every second",
    image: MINIMART_IMAGE
  }
];

export function getRealEstateCost(upgrades: UpgradeLevels): number {
  return getUpgradeCost("mart", upgrades);
}

export function calculateRealEstateIncome(upgrades: UpgradeLevels, multiplier: number): number {
  return Math.round(upgrades.mart * multiplier);
}
