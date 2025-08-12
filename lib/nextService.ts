// lib/nextService.ts
export function nextServiceDate(): Date {
  // Next Sunday at 10:00 AM (local time)
  const now = new Date();
  const d = new Date(now);
  const day = d.getDay(); // 0 = Sun
  const daysToSunday = (7 - day) % 7;
  d.setDate(d.getDate() + (daysToSunday === 0 && d.getHours() >= 10 ? 7 : daysToSunday));
  d.setHours(10, 0, 0, 0);
  return d;
}

export function countdownParts(target: Date) {
  const now = Date.now();
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

