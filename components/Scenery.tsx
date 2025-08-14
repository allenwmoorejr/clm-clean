// components/Scenery.tsx
"use client";

import { useEffect, useState } from "react";

/** Cinematic background with graceful fallbacks. */
export default function Scenery() {
  const [useVideo, setUseVideo] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const saveData = (navigator as any)?.connection?.saveData ?? false;
    const smallScreen = window.innerWidth < 640; // phones
    if (reduced || saveData) setUseVideo(false);
    // If phone, we still try video; if it errors, we’ll fall back to image below.
  }, []);

  return (
      // before: -z-20
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      {useVideo ? (
        <video
          className="w-full h-full object-cover opacity-35"
          poster="/scenery.jpg"
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
        <img
          src="/scenery.jpg"
          alt=""
          className="w-full h-full object-cover opacity-35"
        />
      )}
      {/* Gentle mask to keep text readable over the scenery */}
      <div className="scenery-mask" />
    </div>
  );
}

