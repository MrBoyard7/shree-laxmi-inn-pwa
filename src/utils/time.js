/**
 * Time helpers used across the app, most notably by the "Next Aarti"
 * widget on the Home page (see components/temple/NextAartiRibbon.jsx).
 */

/** Parse "HH:MM" (24h) into minutes since midnight. Returns null if invalid. */
export function parseTimeToMinutes(time) {
  if (typeof time !== 'string') return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Format "HH:MM" (24h) as e.g. "7:00 PM". Returns the original string if unparsable. */
export function formatTime12h(time) {
  const totalMinutes = parseTimeToMinutes(time);
  if (totalMinutes === null) return time;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

/** Format a count of minutes as e.g. "2h 15m" or "45m". */
export function formatCountdown(totalMinutes) {
  if (totalMinutes < 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

/**
 * Find the next aarti across every temple, relative to `now`.
 *
 * Looks first for the closest upcoming aarti later today. If every
 * aarti for today has already passed, wraps around to the earliest
 * aarti tomorrow and flags `isTomorrow: true` so the UI can label it
 * clearly instead of implying it is still today.
 */
export function getNextAarti(temples, now = new Date()) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const allAartis = temples.flatMap((temple) =>
    (temple.aarti || []).map((aarti) => ({
      templeId: temple.id,
      templeName: temple.name,
      aartiName: aarti.name,
      time: aarti.time,
      minutes: parseTimeToMinutes(aarti.time),
    })),
  );

  const valid = allAartis.filter((a) => a.minutes !== null);
  if (valid.length === 0) return null;

  const upcomingToday = valid
    .filter((a) => a.minutes >= nowMinutes)
    .sort((a, b) => a.minutes - b.minutes);

  if (upcomingToday.length > 0) {
    const next = upcomingToday[0];
    return { ...next, minutesUntil: next.minutes - nowMinutes, isTomorrow: false };
  }

  const earliestOverall = [...valid].sort((a, b) => a.minutes - b.minutes)[0];
  const minutesUntil = 24 * 60 - nowMinutes + earliestOverall.minutes;
  return { ...earliestOverall, minutesUntil, isTomorrow: true };
}
