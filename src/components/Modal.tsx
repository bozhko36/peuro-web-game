import type { ReactNode } from "react";

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="casino-panel relative z-10 mx-auto mt-28 grid w-[min(calc(100%-28px),396px)] gap-4 p-4 text-white">
      <h1 className="text-center text-2xl font-black text-[var(--gold)]">{title}</h1>
      {children}
    </section>
  );
}
