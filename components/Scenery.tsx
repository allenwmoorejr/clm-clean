// components/Scenery.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/** Cinematic background with graceful fallbacks and readability mask. */
export default function Scenery() {
  const [useVideo, setUseVideo] = useState(true);
  const [posterSrc, setPosterSrc] = useState("/scenery.jpg");
  const vidRef = useRef<HTMLVideoElement | null>(null);

  // Tweak to taste: 0.6 ~ 40% slower; 0.5 = half speed
  const PLAYBACK_RATE = 0.6;

  useEffect(() => {
    // Respect user prefs, but don’t disable for no reason.
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const saveData = (navigator as any)?.connection?.saveData ?? false;
    if (reduced || saveData) setUseVideo(false);

    // Fallback poster if scenery.jpg is missing
    const img = new Image();
    img.onerror = () => setPosterSrc("/pastor-hero.jpg");
    img.src = "/scenery.jpg";
  }, []);

  // Ensure autoplay + slower playback
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;

    let interval: number | null = null;

    const applyRate = () => {
      try {
        v.playbackRate = PLAYBACK_RATE;
      } catch {}
    };

    const ensurePlaying = async () => {
      try {
        // Some browsers won’t start until play() is called even with autoplay+muted
        await v.play().catch(() => {});
        applyRate();
      } catch {}
    };

    const onReady = () => {
      applyRate();
      ensurePlaying();
    };

    const onError = () => setUseVideo(false);

    v.addEventListener("loadedmetadata", onReady);
    v.addEventListener("canplay", onReady);
    v.addEventListener("play", applyRate);
    v.addEventListener("ratechange", applyRate);
    v.addEventListener("stalled", ensurePlaying);
    v.addEventListener("waiting", ensurePlaying);
    v.addEventListener("error", onError);

    // Re-assert rate & playing a few times after mount (handles Safari quirks)
    interval = window.setInterval(() => {
      if (!v.paused) applyRate();
      else ensurePlaying();
    }, 1000) as any;

    // Kick it once immediately
    ensurePlaying();

    return () => {
      v.removeEventListener("loadedmetadata", onReady);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("play", applyRate);
      v.removeEventListener("ratechange", applyRate);
      v.removeEventListener("stalled", ensurePlaying);
      v.removeEventListener("waiting", ensurePlaying);
      v.removeEventListener("error", onError);
      if (interval) window.clearInterval(interval);
    };
  }, [PLAYBACK_RATE]);

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      {useVideo ? (
        <video
          ref={vidRef}
          className="w-full h-full object-cover opacity-35"
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setUseVideo(false)}
        >
          <source src="/scenery.mp4" type="video/mp4" />
        </video>
      ) : (
        <img src={posterSrc} alt="" className="w-full h-full object-cover opacity-35" />
      )}
      <div className="scenery-mask" />
    </div>
  );
}

