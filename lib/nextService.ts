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

/** Returns major holiday events for the given year. */
function majorHolidays(year: number) {
  const events: {
    id: string;
    title: string;
    date: Date;
    end: Date;
    location: string;
    description: string;
  }[] = [];

  // helper to create an all-day event
  const addHoliday = (id: string, title: string, month: number, day: number, description: string) => {
    const start = new Date(year, month, day, 0, 0, 0, 0);
    const end = new Date(year, month, day, 23, 59, 59, 999);
    events.push({
      id: `${id}-${year}`,
      title,
      date: start,
      end,
      location: "Christ Like Ministries, Birmingham, AL",
      description,
    });
  };

  // New Year's Day – January 1
  addHoliday(
    "new-years",
    "New Year's Day",
    0,
    1,
    "Happy New Year from Christ Like Ministries!"
  );

  // Memorial Day – last Monday in May
  const memorial = new Date(year, 4, 31);
  while (memorial.getDay() !== 1) memorial.setDate(memorial.getDate() - 1);
  addHoliday(
    "memorial-day",
    "Memorial Day",
    memorial.getMonth(),
    memorial.getDate(),
    "Remembering and honoring those who served."
  );

  // Independence Day – July 4
  addHoliday(
    "independence-day",
    "Independence Day",
    6,
    4,
    "Happy Independence Day from CLM!"
  );

  // Labor Day – first Monday in September
  const labor = new Date(year, 8, 1);
  while (labor.getDay() !== 1) labor.setDate(labor.getDate() + 1);
  addHoliday(
    "labor-day",
    "Labor Day",
    labor.getMonth(),
    labor.getDate(),
    "Wishing you a restful Labor Day from CLM."
  );

  // Thanksgiving – fourth Thursday in November
  const thanksgiving = new Date(year, 10, 1);
  while (thanksgiving.getDay() !== 4) thanksgiving.setDate(thanksgiving.getDate() + 1);
  thanksgiving.setDate(thanksgiving.getDate() + 3 * 7);
  addHoliday(
    "thanksgiving",
    "Thanksgiving Day",
    thanksgiving.getMonth(),
    thanksgiving.getDate(),
    "Give thanks with a grateful heart – Happy Thanksgiving from CLM!"
  );

  // Christmas – December 25
  addHoliday(
    "christmas",
    "Christmas Day",
    11,
    25,
    "Wishing everyone a Merry Christmas from Christ Like Ministries!"
  );

  // Easter – computed
  const easter = calculateEaster(year);
  addHoliday(
    "easter",
    "Easter Sunday",
    easter.getMonth(),
    easter.getDate(),
    "He is risen! Celebrate the resurrection with CLM."
  );

  return events;
}

/** Calculates Easter Sunday for a given year (Gregorian calendar). */
function calculateEaster(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Generates upcoming Sunday services and major holidays.
 * Holiday events are returned for the current year and next year if needed.
 */
export function upcomingEvents(count = 8) {
  const now = new Date();
  const year = now.getFullYear();
  const events = [...upcomingSundays(count), ...majorHolidays(year)];

  // include next year's holidays if the current date is near year end
  if (now.getMonth() > 10) {
    events.push(...majorHolidays(year + 1));
  }

  return events.filter((ev) => ev.date >= now).sort((a, b) => a.date.getTime() - b.date.getTime());
}

