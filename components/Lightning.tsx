// components/Lightning.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Bolt = { id: number; path: string };

function genBoltPath(w: number, h: number) {
  // Start near top, wander down with jittery segments
  const segs = 8 + Math.floor(Math.random() * 6); // 8–13 segments
  const startX = Math.random() * w;
  let x = startX;
  let y = Math.random() * (h * 0.2); // somewhere in the upper 20%
  const pts: [number, number][] = [[x, y]];

  for (let i = 0; i < segs; i++) {
    const dx = (Math.random() - 0.5) * (w * 0.12); // horizontal jitter
    const dy = (h / (segs + 2)) * (0.7 + Math.random() * 0.8); // mostly downward
    x = Math.max(0, Math.min(w, x + dx));
    y = Math.min(h, y + dy);
    pts.push([x, y]);

    // small chance of a micro “kink”
    if (Math.random() < 0.25) {
      const kx = Math.max(0, Math.min(w, x + (Math.random() - 0.5) * (w * 0.06)));
      const ky = Math.min(h, y + (Math.random() * (h * 0.05)));
      pts.push([kx, ky]);
    }
  }

  // Build SVG path
  return "M " + pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(" L ");
}

export default function Lightning() {
  const [bolt, setBolt] = useState<Bolt | null>(null);
  const [flash, setFlash] = useState(false);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const saveData = (navigator as any)?.connection?.saveData ?? false;
    if (reduced || saveData) return; // respect user prefs

    const scheduleNext = (minSec = 55, maxSec = 85) => {
      const delay = (minSec + Math.random() * (maxSec - minSec)) * 1000;
      timerRef.current = window.setTimeout(() => strike(), delay) as any;
    };

    const strike = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setBolt({ id: Date.now(), path: genBoltPath(w, h) });

      // quick flash + flicker phases
      setFlash(true);
      setVisible(true);
      window.setTimeout(() => setFlash(false), 110);
      window.setTimeout(() => setVisible(false), 90);
      window.setTimeout(() => setVisible(true), 160);
      window.setTimeout(() => setVisible(false), 230);
      window.setTimeout(() => {
        setBolt(null);
        scheduleNext();
      }, 320);
    };

    scheduleNext();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!bolt) return null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* Screen flash */}
      {flash && <div className="absolute inset-0 bg-white/70 animate-lightning-flash" />}

      {/* Bolt (two strokes for glow) */}
      <svg className="absolute inset-0 w-full h-full">
        <g style={{ opacity: visible ? 1 : 0 }}>
          <path
            d={bolt.path}
            stroke="rgba(170,210,255,0.45)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d={bolt.path}
            stroke="rgba(230,245,255,0.95)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

