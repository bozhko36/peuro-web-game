import { GameScreen } from "@/components/GameScreen";
import { UpgradeCard } from "@/components/UpgradeCard";
import { Modal } from "@/components/Modal";

export default function UpgradesPage() {
  return (
    <main className="stage mobile-shell">
      <div className="menu-backdrop" aria-hidden="true">
        <GameScreen />
      </div>
      <Modal title="Upgrades">
        <nav className="grid gap-3" aria-label="Upgrades">
          <UpgradeCard id="speed" name="Speed" />
          <UpgradeCard id="count" name="Count" />
          <UpgradeCard id="prestige" name="Prestige" />
        </nav>
      </Modal>
    </main>
  );
}
