"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

type FlyingNote = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  tilt: number;
  drift: number;
};

type NoteStyle = CSSProperties & {
  "--fly-x": string;
  "--fly-y": string;
  "--fly-r": string;
  "--fly-drift": string;
  "--fly-spin": string;
};

type DragStyle = CSSProperties & Pick<NoteStyle, "--fly-x" | "--fly-y" | "--fly-r">;

const idleDrag: DragState = { pointerId: null, lastX: 0, lastY: 0, x: 0, y: 0 };

export function BillStage({ autoPlayEnabled = false }: { autoPlayEnabled?: boolean }) {
  const tapBill = useGameStore((state) => state.tapBill);
  const [drag, setDrag] = useState<DragState>(idleDrag);
  const [flyingNotes, setFlyingNotes] = useState<FlyingNote[]>([]);
  const [dragStarted, setDragStarted] = useState(false);
  const noteRef = useRef<HTMLDivElement | null>(null);
  const flyingTimersRef = useRef<number[]>([]);
  const lockTimerRef = useRef<number | null>(null);
  const lockedRef = useRef(false);

  const completeSlide = useCallback((launch = { x: 0, y: 0 }, pointerId?: number) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    const flyingNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      x: launch.x,
      y: launch.y,
      rotation: Math.max(-10, Math.min(10, launch.x / 18)),
      tilt: -4 + Math.random() * 8,
      drift: -8 + Math.random() * 28
    };
    setFlyingNotes((notes) => [...notes, flyingNote].slice(-10));
    const timer = window.setTimeout(() => {
      setFlyingNotes((notes) => notes.filter((note) => note.id !== flyingNote.id));
      const timerIndex = flyingTimersRef.current.indexOf(timer);
      if (timerIndex >= 0) flyingTimersRef.current.splice(timerIndex, 1);
    }, 720);
    flyingTimersRef.current.push(timer);
    if (pointerId !== undefined && noteRef.current?.hasPointerCapture(pointerId)) {
      noteRef.current.releasePointerCapture(pointerId);
    }
    setDrag(idleDrag);
    setDragStarted(false);
    tapBill({ x: 50, y: 42 });
    if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      lockTimerRef.current = null;
      lockedRef.current = false;
    }, 520);
  }, [tapBill]);

  const threshold = () => Math.min(120, window.innerHeight * 0.32);

  useEffect(() => {
    const flyingTimers = flyingTimersRef.current;
    return () => {
      flyingTimers.forEach((timer) => window.clearTimeout(timer));
      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!autoPlayEnabled) return undefined;
    const timer = window.setInterval(() => completeSlide(), 780);
    return () => window.clearInterval(timer);
  }, [autoPlayEnabled, completeSlide]);

  return (
    <section className="bill-stage panel-surface" aria-label="Slide the banknote upward">
      <div className="bill-stage-inner">
        <section
          className="playfield"
          aria-label="Slide the banknote upward"
          onPointerMove={(event) => {
            if (lockedRef.current || drag.pointerId !== event.pointerId) return;
            event.preventDefault();
            const deltaX = event.clientX - drag.lastX;
            const deltaY = event.clientY - drag.lastY;
            const upward = Math.max(0, -deltaY);
            const downward = Math.max(0, deltaY);
            const nextX = Math.max(-28, Math.min(28, drag.x + deltaX * 0.18));
            const nextY = Math.min(32, drag.y + downward * 0.22) - upward * 1.62;
            if (Math.abs(nextY) > 8 || Math.abs(nextX) > 8) setDragStarted(true);

            if (nextY <= -threshold()) {
              completeSlide({ x: nextX, y: nextY }, event.pointerId);
              return;
            }

            setDrag({ pointerId: drag.pointerId, lastX: event.clientX, lastY: event.clientY, x: nextX, y: nextY });
          }}
          onPointerUp={(event) => {
            if (drag.pointerId !== event.pointerId) return;
            if (!dragStarted) {
              completeSlide({ x: drag.x, y: drag.y }, event.pointerId);
              return;
            }
            if (noteRef.current?.hasPointerCapture(event.pointerId)) {
              noteRef.current.releasePointerCapture(event.pointerId);
            }
            setDrag(idleDrag);
            window.setTimeout(() => setDragStarted(false), 0);
          }}
          onPointerCancel={() => setDrag(idleDrag)}
          onWheel={(event) => {
            event.preventDefault();
            if (event.deltaY > 0 && !lockedRef.current) completeSlide();
          }}
        >
          <div className="money-stack" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="stack-note" style={{ "--stack-index": 7 - index } as CSSProperties} key={index} />
            ))}
          </div>

          <div className="money-stream" aria-hidden="true">
            {flyingNotes.map((note) => (
              <span
                className="flying-note"
                style={{
                  "--fly-x": `${note.x}px`,
                  "--fly-y": `${note.y}px`,
                  "--fly-r": `${note.rotation}deg`,
                  "--fly-drift": `${note.drift}px`,
                  "--fly-spin": `${note.tilt + 18}deg`
                } as NoteStyle}
                key={note.id}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="bill-art" src={BILL_IMAGE} alt="" loading="eager" decoding="async" />
              </span>
            ))}
          </div>

          <div
            ref={noteRef}
            className={`banknote ${drag.pointerId !== null ? "dragging pressed" : "pop"}`}
            role="button"
            aria-label="Euro banknote. Move upward to slide."
            tabIndex={0}
            style={{
              "--fly-x": `${drag.x}px`,
              "--fly-y": `${drag.y}px`,
              "--fly-r": `${Math.max(-10, Math.min(10, drag.x / 18))}deg`,
              transform: `translate3d(calc(-50% + ${drag.x}px), ${drag.y}px, 0) rotate(${Math.max(-10, Math.min(10, drag.x / 18))}deg) scale(${drag.pointerId !== null ? 0.985 : 1})`
            } as DragStyle}
            onPointerDown={(event) => {
              if (!noteRef.current) return;
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
            <img className="bill-art" src={BILL_IMAGE} alt="Euro bill" loading="eager" decoding="async" />
          </div>
        </section>
        <span className="bill-hint">Swipe to earn</span>
      </div>
      <FloatingTapText />
    </section>
  );
}
