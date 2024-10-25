import type { Event } from '$lib/interfaces/event.interface';

function pad(num: number) {
	return num < 10 ? '0' + num : num;
}

export function getUTCDMString(dt: Date) {
	const month = pad(dt.getUTCMonth() + 1);
	const date = pad(dt.getUTCDate());
	return `${date}. ${month}.`;
}

export function getUTCDateString(dt: Date) {
	const year = dt.getUTCFullYear();
	const month = pad(dt.getUTCMonth() + 1);
	const date = pad(dt.getUTCDate());
	return `${date}. ${month}. ${year}`;
}

export function getUTCTimeString(dt: Date) {
	const hour = pad(dt.getUTCHours());
	const minute = pad(dt.getUTCMinutes());
	return `${hour}:${minute}`;
}

export function getUTCString(dt: Date) {
	const date = getUTCDateString(dt);
	const time = getUTCTimeString(dt);
	return `${date} ${time} UTC`;
}

export const hourInMs = 1000 * 60 * 60;

export const dayInMs = hourInMs * 24;

export const dayInWeeks = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'];

export function getNextNDays(n: number, event: Event, offset: number = 0) {
	const start = Math.max(Date.now(), event.fromDateTime?.valueOf() ?? 0);
	return new Array(n)
		.fill(null)
		.map((_, i) => new Date(Math.floor(start / dayInMs + i + offset) * dayInMs))
		.filter(
			(date) =>
				(!event.toDateTime || date <= event.toDateTime) &&
				(!event.fromDateTime || date >= event.fromDateTime)
		);
}
