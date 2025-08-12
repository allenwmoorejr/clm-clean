// components/LiveBadge.tsx
"use client";
import { useEffect, useState } from "react";
import { countdownParts, nextServiceDate } from "@/lib/nextService";

type LiveData = { live: boolean; videoId?: string; latestId?: string };

export function LiveBadge() {
  const [live, setLive] = useState(false);
  const [countdown, setCountdown] = useState(() => countdownParts(nextServiceDate()));

  useEffect(() => {
    let mounted = true;

    const tick = () => setCountdown(countdownParts(nextServiceDate()));
    const poll = () =>
      fetch("/api/live")
        .then((r) => r.json())
        .then((d: LiveData) => mounted && setLive(!!d?.live))
        .catch(() => {});

    // initial
    tick();
    poll();

    // every 30s update countdown; every 60s poll live
    const t = setInterval(tick, 30_000);
    const p = setInterval(poll, 60_000);
    return () => {
      mounted = false;
      clearInterval(t);
      clearInterval(p);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${
          live ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white/70"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${live ? "bg-red-400 animate-pulse" : "bg-white/40"}`} />
        {live ? "LIVE" : "Offline"}
      </span>

      {!live && (
        <span className="text-white/70">
          Next: Sun 10:00am CT · {countdown.days}d {countdown.hours}h {countdown.minutes}m
        </span>
      )}
    </div>
  );
}

