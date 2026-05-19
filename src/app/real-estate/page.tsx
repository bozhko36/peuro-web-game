import { GameScreen } from "@/components/GameScreen";
import { RealEstateCard } from "@/components/RealEstateCard";
import { Modal } from "@/components/Modal";
import { EstateStrip } from "@/components/EstateStrip";

export default function RealEstatePage() {
  return (
    <main className="stage mobile-shell">
      <div className="menu-backdrop" aria-hidden="true">
        <GameScreen />
      </div>
      <Modal title="Real Estate">
        <RealEstateCard />
        <EstateStrip />
      </Modal>
    </main>
  );
}
