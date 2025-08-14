// app/events/page.tsx
"use client";
import { upcomingSundays } from "@/lib/nextService";

export default function EventsPage() {
  const items = upcomingSundays(8); // next 8 Sundays

  return (
    <section className="container py-16">
      <h1>Events</h1>
      <p className="text-white/70 mt-2">Weekly Sunday service and upcoming dates.</p>

      <div className="mt-8 grid gap-6">
        {items.map((ev) => (
          <div key={ev.id} className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3>{ev.title}</h3>
              <p className="text-white/70 mt-1">
                {ev.date.toLocaleString()} – {ev.end.toLocaleTimeString()}
              </p>
              <p className="text-white/60">{ev.location}</p>
              <p className="text-white/70 mt-2">{ev.description}</p>
            </div>
            <a
              className="btn-primary"
              href={`/api/ics?title=${encodeURIComponent(ev.title)}&desc=${encodeURIComponent(
                ev.description
              )}&start=${encodeURIComponent(ev.date.toISOString())}&end=${encodeURIComponent(
                ev.end.toISOString()
              )}&loc=${encodeURIComponent(ev.location)}`}
            >
              Add to Calendar
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

