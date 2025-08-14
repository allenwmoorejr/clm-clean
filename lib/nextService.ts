// lib/nextService.ts

/** Returns the next Sunday at 10:00 AM local time. */
export function nextServiceDate(): Date {
  const now = new Date();
  const d = new Date(now);
  const day = d.getDay(); // 0 = Sun
  const daysToSunday = (7 - day) % 7;
  // if it's already Sunday 10:00 or later, go to next week
  d.setDate(d.getDate() + (daysToSunday === 0 && d.getHours() >= 10 ? 7 : daysToSunday));
  d.setHours(10, 0, 0, 0);
  return d;
}

/** Breaks down the time remaining until target into days/hours/minutes. */
export function countdownParts(target: Date) {
  const now = Date.now();
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

/** Generates the next N Sunday services (10:00–12:00) for the Events page. */
export function upcomingSundays(count = 8) {
  const out: {
    id: string;
    title: string;
    date: Date;
    end: Date;
    location: string;
    description: string;
  }[] = [];

  let d = nextServiceDate(); // next Sunday 10:00
  for (let i = 0; i < count; i++) {
    const start = new Date(d);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const id = `sun-${start.toISOString().slice(0, 10)}`;
    out.push({
      id,
      title: "Sunday Worship Service",
      date: start,
      end,
      location: "Christ Like Ministries, Birmingham, AL",
      description: "Join us for worship and the Word.",
    });
    d = new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000); // +1 week
  }
  return out;
}

