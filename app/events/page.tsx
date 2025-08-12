// app/events/page.tsx
"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  title: string;
  date: string;       // ISO string
  end?: string;       // ISO string
  location?: string;
  description?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/events.json")
      .then((r) => r.json())
      .then((d: Event[]) => setEvents(d))
      .catch(() => setEvents([]));
  }, []);

  return (
    <section className="container py-16">
      <h1>Events</h1>
      <p className="text-white/70 mt-2">Upcoming gatherings and special services.</p>

      <div className="mt-8 grid gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h3>{ev.title}</h3>
              <p className="text-white/70 mt-1">
                {new Date(ev.date).toLocaleString()}{" "}
                {ev.end ? "– " + new Date(ev.end).toLocaleTimeString() : ""}
              </p>
              {ev.location && <p className="text-white/60">{ev.location}</p>}
              {ev.description && <p className="text-white/70 mt-2">{ev.description}</p>}
            </div>

            <a
              className="btn-primary"
              href={`/api/ics?title=${encodeURIComponent(ev.title)}&desc=${encodeURIComponent(
                ev.description ?? ""
              )}&start=${encodeURIComponent(ev.date)}&end=${encodeURIComponent(
                ev.end ?? ev.date
              )}&loc=${encodeURIComponent(ev.location ?? "Christ Like Ministries, Birmingham, AL")}`}
            >
              Add to Calendar
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

