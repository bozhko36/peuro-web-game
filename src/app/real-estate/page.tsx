import { BackgroundDecor } from "@/components/BackgroundDecor";
import { BottomNav } from "@/components/BottomNav";
import { RealEstateCard } from "@/components/RealEstateCard";
import { Modal } from "@/components/Modal";
import { EstateStrip } from "@/components/EstateStrip";

export default function RealEstatePage() {
  return (
    <main className="stage mobile-shell">
      <BackgroundDecor />
      <Modal title="Real Estate">
        <RealEstateCard />
        <EstateStrip />
      </Modal>
      <BottomNav />
    </main>
  );
}
