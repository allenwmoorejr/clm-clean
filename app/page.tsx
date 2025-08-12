// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, PlayCircle, Radio, MapPin, HeartHandshake } from "lucide-react";
import { countdownParts, nextServiceDate } from "@/lib/nextService";

type LiveData = { live: boolean; videoId?: string; latestId?: string };
type Video = { id: string; title: string; published: string; thumbnail: string };

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};
const stagger = { animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

export default function HomePage() {
  const [live, setLive] = useState<LiveData | null>(null);
  const [heroSrc, setHeroSrc] = useState("/live-preview.jpg");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [countdown, setCountdown] = useState(() => countdownParts(nextServiceDate()));

  // --- Parallax for glow ---
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // --- Pointer tilt state (desktop only) ---
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [enableTilt, setEnableTilt] = useState(false);
  useEffect(() => {
    setEnableTilt(window.matchMedia?.("(pointer: fine)").matches ?? false);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enableTilt) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;  // 0..1
    const py = (e.clientY - rect.top) / rect.height;  // 0..1
    const max = 6; // degrees
    const rx = (py - 0.5) * -2 * max; // rotateX
    const ry = (px - 0.5) * 2 * max;  // rotateY
    setTilt({ x: rx, y: ry });
  }
  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  useEffect(() => {
    fetch("/api/live")
      .then((r) => r.json())
      .then((d: LiveData) => {
        setLive(d);
        const id = d?.live ? d.videoId : d?.latestId;
        if (id) {
          const test = new Image();
          test.onload = () => setHeroSrc(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
          test.onerror = () => setHeroSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
          test.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
        } else {
          setHeroSrc("/live-preview.jpg");
        }
      })
      .catch(() => {});

    fetch("/api/videos?limit=12")
      .then((r) => r.json())
      .then((d) => setVideos(d.items || []))
      .catch(() => setVideos([]))
      .finally(() => setLoadingVideos(false));

    const t = setInterval(() => setCountdown(countdownParts(nextServiceDate())), 30_000);
    return () => clearInterval(t);
  }, []);

  const heroId = live?.live ? live.videoId : live?.latestId;
  const nextSvc = nextServiceDate();
  const watchHref = heroId
    ? `https://www.youtube.com/watch?v=${heroId}`
    : `https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_CHANNEL_ID ?? ""}/live`;

  return (
    <div>
      {/* HERO */}
      <section className="container py-16" ref={heroRef}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side copy */}
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.div {...fadeUp} className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${
                  live?.live ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white/70"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${live?.live ? "bg-red-400 animate-pulse" : "bg-white/40"}`} />
                {live?.live ? "LIVE" : "Offline"}
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight"
            >
              Join us Sundays at 10:00am
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="mt-6 text-white/80 max-w-2xl"
            >
              Teaching saved people how to stay saved — and sharing Jesus with the world. Watch live, explore past sermons,
              or send a prayer request.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.18 }}
              className="mt-6 flex flex-wrap gap-3 text-white/80"
            >
              <span className="badge"><CalendarDays size={14} /> Sundays · 10:00am CT</span>
              <span className="badge"><Radio size={14} /> WJLD 1400 AM · 1–2pm</span>
              <span className="badge"><MapPin size={14} /> Birmingham, AL</span>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.26 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/watch" className="btn-primary"><PlayCircle size={18} /> Watch Live</Link>
              <Link href="/sermons" className="btn-ghost">Sermon Library</Link>
              <a href="/prayer" className="btn-ghost">Prayer Request</a>
            </motion.div>

            {!live?.live && (
              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.34 }}
                className="mt-5 text-white/70 text-sm"
              >
                Next service: <strong>{nextSvc.toLocaleString()}</strong> · {countdown.days}d {countdown.hours}h {countdown.minutes}m
              </motion.p>
            )}
          </motion.div>

          {/* Right side visual: Ken Burns + Tilt */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.12 }}
            className="card overflow-hidden relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            style={{
              perspective: 1000,
              willChange: "transform",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Parallax glow */}
            <motion.div
              style={{ y: parallaxY }}
              className="absolute -inset-8 -z-10 rounded-[40px] blur-3xl opacity-30"
            >
              <div className="h-full w-full bg-gradient-to-tr from-brand-600 to-cyan-400/40 rounded-[40px]" />
            </motion.div>

            {/* Tilted inner container */}
            <motion.div
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="aspect-video relative"
            >
              {/* Ken Burns: slow zoom in & out */}
              <motion.img
                key={heroSrc}
                src={heroSrc}
                alt="CLM Preview"
                className="w-full h-full object-cover"
                initial={{ scale: 1.02 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                style={{ transformOrigin: "50% 60%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-end p-4 md:p-6" style={{ transform: "translateZ(20px)" }}>
                <div className="flex flex-wrap gap-3">
                  <a href={watchHref} target="_blank" rel="noreferrer" className="btn-primary">Watch on YouTube</a>
                  <Link href="/watch" className="btn-ghost">Open Watch Page</Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            { title: "Give Online", desc: "Partner with CLM — secure giving.", href: "/give", icon: <HeartHandshake size={18} /> },
            { title: "Prayer Request", desc: "We’d love to pray with you.", href: "/prayer", icon: <PlayCircle size={18} /> },
            { title: "Plan a Visit", desc: "See what’s happening this month.", href: "/events", icon: <CalendarDays size={18} /> },
          ].map((c, i) => (
            <motion.a
              key={c.title}
              href={c.href}
              className="card p-6 block hover:scale-[1.01] transition"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-3">
                {c.icon}
                <h3 className="text-xl font-semibold">{c.title}</h3>
              </div>
              <p className="text-white/70 mt-2">{c.desc}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Latest Sermons rail */}
      <section className="container pb-6">
        <div className="flex items-center justify-between">
          <h2>Latest Sermons</h2>
          <Link href="/sermons" className="text-white/70 hover:text-white text-sm">View all</Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="mt-6 overflow-x-auto"
        >
          <div className="flex gap-4 min-w-full pr-2">
            {loadingVideos && <div className="text-white/60 text-sm">Loading sermons…</div>}
            {!loadingVideos && videos.length === 0 && <div className="text-white/60 text-sm">No videos found yet.</div>}
            {videos.map((v) => (
              <motion.a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                className="card overflow-hidden w-[290px] shrink-0 group"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base line-clamp-2">{v.title}</h3>
                  <p className="text-xs text-white/60 mt-1">{new Date(v.published).toLocaleDateString()}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Upcoming + Radio */}
      <section className="container pb-16 grid md:grid-cols-2 gap-6">
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="card p-6">
          <h3 className="text-xl font-semibold">Upcoming Service</h3>
          <p className="text-white/70 mt-2">{nextServiceDate().toLocaleString()} · Birmingham, AL</p>
          <p className="text-white/80 mt-3">
            Starts in <strong>{countdown.days}d {countdown.hours}h {countdown.minutes}m</strong>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="btn-primary"
              href={`/api/ics?title=${encodeURIComponent("CLM Sunday Service")}&desc=${encodeURIComponent(
                "Join us for worship and the Word."
              )}&start=${encodeURIComponent(nextServiceDate().toISOString())}&end=${encodeURIComponent(
                new Date(nextServiceDate().getTime() + 2 * 60 * 60 * 1000).toISOString()
              )}&loc=${encodeURIComponent("Christ Like Ministries, Birmingham, AL")}`}
            >
              Add to Calendar
            </a>
            <Link href="/events" className="btn-ghost">See all events</Link>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.12 }} className="card p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Listen on the Radio</h3>
            <p className="text-white/70 mt-1">WJLD 1400 AM · Sundays 1–2 pm</p>
          </div>
          <Radio />
        </motion.div>
      </section>
    </div>
  );
}

