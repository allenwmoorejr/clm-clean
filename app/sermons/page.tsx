// app/sermons/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";

type Video = { id: string; title: string; published: string; thumbnail: string };

export default function SermonsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>("all");

  useEffect(() => {
    fetch("/api/videos?limit=60")
      .then(r => r.json())
      .then(d => setVideos(d.items || []))
      .catch(() => setVideos([]));
  }, []);

  const years = Array.from(new Set(videos.map(v => new Date(v.published).getFullYear()))).sort((a,b)=>b-a);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return videos.filter(v => {
      const y = String(new Date(v.published).getFullYear());
      const matchYear = year === "all" || y === year;
      const matchQ = !s || v.title.toLowerCase().includes(s);
      return matchYear && matchQ;
    });
  }, [videos, q, year]);

  return (
    <section className="container py-16">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1>Sermon Library</h1>
          <p className="text-white/70 mt-2">Search and filter recent messages.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={e=>setYear(e.target.value)}
            className="px-3 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            <option value="all" className="text-black leading-7">All years</option>
            {years.map(y => (
              <option key={y} value={y} className="text-black leading-7">{y}</option>
            ))}
          </select>
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Search titles…"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-brand-600 min-w-[260px]"
          />
        </div>
      </div>

      {/* GRID restored */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filtered.map(v => (
          <a
            key={v.id}
            href={`https://www.youtube.com/watch?v=${v.id}`}
            target="_blank"
            rel="noreferrer"
            className="card overflow-hidden group"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`; }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-base">{v.title}</h3>
              <p className="text-xs text-white/60 mt-1">{new Date(v.published).toLocaleDateString()}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

