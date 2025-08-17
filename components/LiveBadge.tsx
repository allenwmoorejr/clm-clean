// components/LiveBadge.tsx
"use client";
import { useEffect, useState } from "react";
import { countdownParts, nextServiceDate } from "@/lib/nextService";

type LiveData = { live: boolean; videoId?: string; latestId?: string };

function proximityVars(hours: number) {
  // >72h = no animation; 24–72h = slow; 6–24h = medium; 1–6h = faster; <1h = urgent
  if (hours <= 1)   return { dur: "0.85s", glow: "0.36", animated: true };
  if (hours <= 6)   return { dur: "1.2s",  glow: "0.28", animated: true };
  if (hours <= 24)  return { dur: "1.8s",  glow: "0.22", animated: true };
  if (hours <= 72)  return { dur: "2.7s",  glow: "0.18", animated: true };
  return { dur: "0s", glow: "0", animated: false };
}

export function LiveBadge() {
  const [live, setLive] = useState(false);
  const [countdown, setCountdown] = useState(() => countdownParts(nextServiceDate()));

  useEffect(() => {
    let mounted = true;
    const tick = () => setCountdown(countdownParts(nextServiceDate()));
    const poll = () =>
      fetch("/api/live")
        .then(r => r.json())
        .then((d: LiveData) => mounted && setLive(!!d?.live))
        .catch(() => {});
    tick(); poll();
    const t = setInterval(tick, 30_000);
    const p = setInterval(poll, 60_000);
    return () => { mounted = false; clearInterval(t); clearInterval(p); };
  }, []);

  const nextSvc = nextServiceDate();
  const hoursToNext = Math.max(0, (nextSvc.getTime() - Date.now()) / 36e5);
  const prox = proximityVars(hoursToNext);

  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={[
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full",
          live ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white/70",
          !live && prox.animated ? "pill-animated" : ""
        ].join(" ")}
        style={!live ? ({ ["--dur" as any]: prox.dur, ["--glow" as any]: prox.glow } as any) : undefined}
      >
        <span className={`w-2 h-2 rounded-full ${live ? "bg-red-400 animate-pulse" : "bg-white/40"}`} />
        {live ? "LIVE" : "Offline"}
      </span>

      {!live && (
        <span className="countdown-pill text-white/70">
          Next: Sun 10:00am CT · {countdown.days}d {countdown.hours}h {countdown.minutes}m
        </span>
      )}
    </div>
  );
}

