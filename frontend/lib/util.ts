import {
  CalendarDateTime,
  fromDate,
  getLocalTimeZone,
  Time,
  toTimeZone,
  ZonedDateTime,
} from "@internationalized/date";
// Already available

export function getDurationString(
  from: Date | CalendarDateTime | ZonedDateTime,
  to: Date | CalendarDateTime | ZonedDateTime,
): string {
  const fromDate = toDateFunc(from).getTime();
  const toDate = toDateFunc(to).getTime();
  const diffMs = Math.abs(toDate - fromDate);

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hourString = hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}` : "";
  const minuteString =
    remainingMinutes > 0
      ? `${remainingMinutes} min${remainingMinutes !== 1 ? "s" : ""}`
      : "";

  return `${hourString} ${minuteString}`.trim();
}

export function getTimeString(
  time?: Time | null,
  options?: { cycle?: "12h" | "24h"; showSeconds?: boolean },
): string {
  if (!time) return "Not selected";

  const { cycle = "12h", showSeconds = false } = options || {};

  let hour = time.hour;
  const minute = time.minute;
  const second = time.second;

  let suffix = "";

  if (cycle === "12h") {
    suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 → 12
  }

  const hh = hour.toString().padStart(2, "0");
  const mm = minute.toString().padStart(2, "0");
  const ss = second.toString().padStart(2, "0");

  let formatted = `${hh}:${mm}`;

  if (showSeconds) formatted += `:${ss}`;
  if (cycle === "12h") formatted += ` ${suffix}`;

  return formatted;
}

export function dateToCalendarDateTime(
  date: Date,
  timeZone: string = "Asia/Kolkata",
): CalendarDateTime {
  const utcZoned = fromDate(date, "UTC");
  const zoned = toTimeZone(utcZoned, timeZone);

  return new CalendarDateTime(
    zoned.calendar,
    zoned.era,
    zoned.year,
    zoned.month,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second,
    zoned.millisecond,
  );
}

interface FormatZonedDateOptions {
  zone?: string;
  dateStyle?: "full" | "long" | "medium" | "short" | "none";
  timeStyle?: "full" | "long" | "medium" | "short" | "none";
}

export const formatZonedDate = (
  date: Date | string,
  formatOrOptions?: string | FormatZonedDateOptions,
): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const zone =
    typeof formatOrOptions === "object" && formatOrOptions.zone
      ? formatOrOptions.zone
      : getLocalTimeZone();

  const calendarDateTime = fromDate(date, zone);
  const d = calendarDateTime.toDate();

  // 🧩 Case 1: Custom string pattern like "MMM dd, yyyy"
  if (typeof formatOrOptions === "string") {
    const options: Intl.DateTimeFormatOptions = {};

    if (formatOrOptions.includes("MMM"))
      options.month = formatOrOptions.includes("MMMM") ? "long" : "short";
    if (formatOrOptions.includes("dd")) options.day = "2-digit";
    if (formatOrOptions.includes("yyyy")) options.year = "numeric";
    if (formatOrOptions.includes("hh")) options.hour = "2-digit";
    if (formatOrOptions.includes("mm")) options.minute = "2-digit";
    if (formatOrOptions.includes("a")) options.hour12 = true;

    return d.toLocaleString("en-US", { ...options, timeZone: zone });
  }

  // 🧩 Case 2: Intl-style options
  const { dateStyle = "medium", timeStyle = "short" } = formatOrOptions || {};

  return d.toLocaleString("en-US", {
    dateStyle: dateStyle === "none" ? undefined : dateStyle,
    timeStyle: timeStyle === "none" ? undefined : timeStyle,
    timeZone: zone,
  });
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function toDateFunc(input: Date | CalendarDateTime | ZonedDateTime): Date {
  if (input instanceof Date) return input;

  return input.toDate("UTC");
}

export const multiplyData = (data: any, times = 10) => {
  // Duplicate them 10 times with unique IDs
  const dummyData = [];
  let idCounter = 1;

  for (let i = 0; i < times; i++) {
    for (const p of data) {
      dummyData.push({
        ...p,
        id: p.id * 100 * times + idCounter, // make unique by offset + counter
        createdAt: new Date(p.createdAt.getTime() + i * 100 * times), // shift time a bit
        updatedAt: new Date(p.updatedAt.getTime() + i * 100 * times),
      });
      idCounter++;
    }
  }

  return dummyData;
};

type TailwindColor =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "gray"
  | "slate"
  | "zinc"
  | "neutral"
  | "stone";

export const bgColorMap: Record<TailwindColor, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  gray: "bg-gray-500",
  slate: "bg-slate-500",
  zinc: "bg-zinc-500",
  neutral: "bg-neutral-500",
  stone: "bg-stone-500",
};

export const bgColorMapLight: Record<TailwindColor, string> = {
  red: "bg-red-500/10",
  orange: "bg-orange-500/10",
  amber: "bg-amber-500/10",
  yellow: "bg-yellow-500/10",
  lime: "bg-lime-500/10",
  green: "bg-green-500/10",
  emerald: "bg-emerald-500/10",
  teal: "bg-teal-500/10",
  cyan: "bg-cyan-500/10",
  sky: "bg-sky-500/10",
  blue: "bg-blue-500/10",
  indigo: "bg-indigo-500/10",
  violet: "bg-violet-500/10",
  purple: "bg-purple-500/10",
  fuchsia: "bg-fuchsia-500/10",
  pink: "bg-pink-500/10",
  rose: "bg-rose-500/10",
  gray: "bg-gray-500/10",
  slate: "bg-slate-500/10",
  zinc: "bg-zinc-500/10",
  neutral: "bg-neutral-500/10",
  stone: "bg-stone-500/10",
};

export const textColorMap: Record<TailwindColor, string> = {
  red: "text-red-500",
  orange: "text-orange-500",
  amber: "text-amber-500",
  yellow: "text-yellow-500",
  lime: "text-lime-500",
  green: "text-green-500",
  emerald: "text-emerald-500",
  teal: "text-teal-500",
  cyan: "text-cyan-500",
  sky: "text-sky-500",
  blue: "text-blue-500",
  indigo: "text-indigo-500",
  violet: "text-violet-500",
  purple: "text-purple-500",
  fuchsia: "text-fuchsia-500",
  pink: "text-pink-500",
  rose: "text-rose-500",
  gray: "text-gray-500",
  slate: "text-slate-500",
  zinc: "text-zinc-500",
  neutral: "text-neutral-500",
  stone: "text-stone-500",
};
