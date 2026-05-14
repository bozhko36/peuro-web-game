"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { BILL_IMAGE } from "@/lib/constants";
import { useGameStore } from "@/store/gameStore";
import { FloatingTapText } from "@/components/FloatingTapText";

type DragState = {
  pointerId: number | null;
  lastX: number;
  lastY: number;
  x: number;
  y: number;
};

const idleDrag: DragState = { pointerId: null, lastX: 0, lastY: 0, x: 0, y: 0 };

export function BillStage() {
  const tapBill = useGameStore((state) => state.tapBill);
  const [drag, setDrag] = useState<DragState>(idleDrag);
  const [flying, setFlying] = useState(false);
  const [dragStarted, setDragStarted] = useState(false);
  const noteRef = useRef<HTMLDivElement | null>(null);

  const completeSlide = () => {
    if (flying) return;
    setFlying(true);
    tapBill({ x: 50, y: 42 });
    window.setTimeout(() => {
      setFlying(false);
      setDrag(idleDrag);
    }, 420);
  };

  const threshold = () => Math.min(120, window.innerHeight * 0.32);

  return (
    <section className="bill-stage panel-surface" aria-label="Slide the banknote upward">
      <div className="bill-stage-inner">
        <section
          className="playfield"
          aria-label="Slide the banknote upward"
          onPointerMove={(event) => {
            if (flying || drag.pointerId !== event.pointerId) return;
            event.preventDefault();
            const deltaX = event.clientX - drag.lastX;
            const deltaY = event.clientY - drag.lastY;
            const upward = Math.max(0, -deltaY);
            const downward = Math.max(0, deltaY);
            const nextX = Math.max(-28, Math.min(28, drag.x + deltaX * 0.18));
            const nextY = Math.min(32, drag.y + downward * 0.22) - upward * 1.62;
            if (Math.abs(nextY) > 8 || Math.abs(nextX) > 8) setDragStarted(true);

            if (nextY <= -threshold()) {
              completeSlide();
              return;
            }

            setDrag({ pointerId: drag.pointerId, lastX: event.clientX, lastY: event.clientY, x: nextX, y: nextY });
          }}
          onPointerUp={(event) => {
            if (drag.pointerId !== event.pointerId) return;
            noteRef.current?.releasePointerCapture(event.pointerId);
            setDrag(idleDrag);
            if (!dragStarted && !flying) completeSlide();
            window.setTimeout(() => setDragStarted(false), 0);
          }}
          onPointerCancel={() => setDrag(idleDrag)}
          onWheel={(event) => {
            event.preventDefault();
            if (event.deltaY > 0) completeSlide();
          }}
        >
          <div className="money-stack" aria-hidden="true">
            {Array.from({ length: 15 }, (_, index) => (
              <div className="stack-note" style={{ "--stack-index": 14 - index } as CSSProperties} key={index}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="bill-art" src={BILL_IMAGE} alt="" />
              </div>
            ))}
          </div>

          <div
            ref={noteRef}
            className={`banknote ${drag.pointerId !== null ? "dragging pressed" : "pop"} ${flying ? "fly" : ""}`}
            role="button"
            aria-label="Euro banknote. Move upward to slide."
            tabIndex={0}
            style={{
              transform: `translate3d(calc(-50% + ${drag.x}px), ${drag.y}px, 0) rotate(${Math.max(-10, Math.min(10, drag.x / 18))}deg) scale(${drag.pointerId !== null ? 0.985 : 1})`
            }}
            onPointerDown={(event) => {
              if (flying || !noteRef.current) return;
              event.preventDefault();
              noteRef.current.setPointerCapture(event.pointerId);
              setDragStarted(false);
              setDrag({ pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY, x: drag.x, y: drag.y });
            }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowUp" && event.key !== " ") return;
              event.preventDefault();
              completeSlide();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bill-art" src={BILL_IMAGE} alt="Euro bill" />
          </div>
        </section>
        <span className="bill-hint">Swipe to earn</span>
      </div>
      <FloatingTapText />
    </section>
  );
}
