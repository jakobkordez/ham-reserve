import { Event } from '@/interfaces/event.interface';

export function getUTCString(dt: Date) {
  function pad(num: number) {
    return num < 10 ? '0' + num : num;
  }

  const year = dt.getUTCFullYear();
  const month = pad(dt.getUTCMonth() + 1);
  const date = pad(dt.getUTCDate());
  const hour = pad(dt.getUTCHours());
  const minute = pad(dt.getUTCMinutes());
  return `${year}-${month}-${date} ${hour}:${minute} UTC`;
}

export const dayInMs = 1000 * 60 * 60 * 24;

export const dayInWeeks = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'];

export function getNextNDays(n: number, event: Event, offset: number = 0) {
  const start = Math.max(Date.now(), event.fromDateTime?.valueOf() ?? 0);
  return new Array(n)
    .fill(null)
    .map((_, i) => new Date(Math.floor(start / dayInMs + i + offset) * dayInMs))
    .filter(
      (date) =>
        (!event.toDateTime || date <= event.toDateTime) &&
        (!event.fromDateTime || date >= event.fromDateTime),
    );
}
