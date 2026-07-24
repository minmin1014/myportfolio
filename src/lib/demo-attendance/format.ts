const WEEKDAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];

export function formatMonthDay(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatFullDateJP(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS_JP[date.getDay()]}）`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}
