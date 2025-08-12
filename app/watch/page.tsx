// app/watch/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type LiveResponse = { live: boolean; videoId?: string; latestId?: string };

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WatchPage() {
  const [data, setData] = useState<LiveResponse | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resume, setResume] = useState<number | null>(null);
  const [poster, setPoster] = useState("/pastor-hero.jpg"); // curated default
  const timerRef = useRef<any>(null);

  // fetch live/latest
  useEffect(() => {
    fetch("/api/live")
      .then((r) => r.json())
      .then((d: LiveResponse) => setData(d))
      .catch(() => setData({ live: false }));
  }, []);

  const videoId = data?.live ? data.videoId : data?.latestId;

  // update poster from videoId (with maxres -> hq fallback)
  useEffect(() => {
    if (!videoId) {
      setPoster("/pastor-hero.jpg");
      return;
    }
    const test = new Image();
    test.onload = () =>
      setPoster(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
    test.onerror = () =>
      setPoster(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    test.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }, [videoId]);

  // load saved resume position
  useEffect(() => {
    if (!videoId) return;
    const raw = localStorage.getItem(`yt-progress-${videoId}`);
    if (raw) {
      try {
        const v = JSON.parse(raw);
        if (typeof v.seconds === "number") setResume(v.seconds);
      } catch {}
    }
  }, [videoId]);

  // basic in-page progress timer (for share timestamp)
  useEffect(() => {
    if (!showIframe || !videoId) return;
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 1;
        if (next % 5 === 0) {
          localStorage.setItem(
            `yt-progress-${videoId}`,
            JSON.stringify({ seconds: next, at: Date.now() })
          );
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [showIframe, videoId]);

  const shareUrl = useMemo(() => {
    if (!videoId) return "";
    const t = resume ?? progress;
    return `https://www.youtube.com/watch?v=${videoId}${t > 0 ? `&t=${t}s` : ""}`;
  }, [videoId, progress, resume]);

  const topButtons = (
    <>
      <a
        href={
          videoId
            ? `https://www.youtube.com/watch?v=${videoId}`
            : `https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_CHANNEL_ID ?? ""}/live`
        }
        target="_blank"
        rel="noreferrer"
        className="btn-primary"
      >
        Watch on YouTube
      </a>
      {videoId && (
        <button onClick={() => setShowIframe(true)} className="btn-ghost">
          {resume && resume > 15 ? `Resume in Page (${formatTime(resume)})` : "Play in Page"}
        </button>
      )}
      {videoId && resume && resume > 15 && (
        <a
          href={`https://www.youtube.com/watch?v=${videoId}&t=${resume}s`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          Resume on YouTube ({formatTime(resume)})
        </a>
      )}
    </>
  );

  return (
    <section className="container py-16">
      <h1>{data?.live ? "We’re Live Now" : "Watch"}</h1>
      <p className="text-white/70 mt-2">
        {data?.live
          ? "Thanks for worshiping with us!"
          : "We’re not live right now — enjoy the latest message below."}
      </p>

      <div className="card overflow-hidden mt-8 relative">
        <div className="aspect-video relative">
          {!showIframe ? (
            <>
              <img src={poster} alt="CLM Live Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Desktop/tablet overlay */}
              <div className="hidden sm:flex absolute inset-0 items-start justify-start">
                <div className="p-4 md:p-6">
                  <div className="flex flex-wrap gap-3">{topButtons}</div>
                </div>
              </div>
            </>
          ) : (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
              title="CLM Live"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* Mobile buttons below poster */}
        {!showIframe && <div className="sm:hidden p-4 flex flex-wrap gap-3">{topButtons}</div>}

        <div className="p-5 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <p className="text-white/90 font-medium">{data?.live ? "Live Stream" : "Latest Sermon"}</p>
            {showIframe && <span className="text-white/60 text-sm">Playing — {formatTime(progress)}</span>}
          </div>
          <div className="flex items-center gap-3">
            {videoId && (
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl);
                }}
                className="btn-ghost"
                title="Copy a link that starts at the current time"
              >
                Copy timestamp link
              </button>
            )}
            <Link href="/sermons" className="btn-primary">
              Browse Sermons
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

