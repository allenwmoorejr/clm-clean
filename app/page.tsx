// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LiveData = { live: boolean; videoId?: string; latestId?: string };

export default function HomePage() {
  const [live, setLive] = useState<LiveData | null>(null);
  const [imgSrc, setImgSrc] = useState("/live-preview.jpg");

  useEffect(() => {
    fetch("/api/live")
      .then((r) => r.json())
      .then((d: LiveData) => {
        setLive(d);
        const id = d?.live ? d.videoId : d?.latestId;
        if (id) {
          // try maxres first; fallback to hqdefault if it 404s
          const hi = new Image();
          hi.onload = () => setImgSrc(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
          hi.onerror = () => setImgSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
          hi.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
        }
      })
      .catch(() => {});
  }, []);

  const heroId = live?.live ? live.videoId : live?.latestId;

  return (
    <section className="container py-16">
      <h1 className="text-4xl font-semibold">Welcome to CLM</h1>
      <p className="text-white/70 mt-2">Live Sundays at 10:00am CT</p>

      <div className="card p-0 mt-6 overflow-hidden">
        <div className="aspect-video relative">
          <img src={imgSrc} alt="CLM Live Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-end p-4 gap-3">
            <a
              href={
                heroId
                  ? `https://www.youtube.com/watch?v=${heroId}`
                  : `https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_CHANNEL_ID ?? ""}/live`
              }
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Watch on YouTube
            </a>
            <Link href="/watch" className="btn-ghost">
              Open Watch Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

