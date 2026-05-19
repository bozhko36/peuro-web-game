import type { ReactNode } from "react";
import Link from "next/link";

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="casino-panel app-modal relative z-10 mx-auto mt-28 grid w-[min(calc(100%-28px),396px)] gap-4 p-4 text-white">
      <header className="app-modal-head">
        <h1 className="app-modal-title">{title}</h1>
        <Link className="modal-exit" href="/" aria-label="Exit to main game">
          ×
        </Link>
      </header>
      {children}
    </section>
  );
}
