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
