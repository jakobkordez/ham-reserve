import type { Reservation } from '$lib/interfaces/reservation.interface';
import { hourInMs } from '$lib/util/date.util';

export function mapReservations(
	reservations: Reservation[] | undefined,
	bands: string[],
	modes: string[],
	date: Date
): (Set<string> | null)[][] {
	const freeTable = bands.map(() =>
		new Array<Set<string> | null>(24)
			.fill(null)
			.map(() => (reservations == undefined ? null : new Set<string>()))
	);

	if (!reservations) return freeTable;

	const dateV = date.valueOf() / hourInMs;

	for (const reservation of reservations) {
		// if (mode && !reservation.modes.includes(mode)) continue;
		if (!modes.some((m) => reservation.modes.includes(m))) continue;

		const start = Math.max(Math.floor(reservation.startDateTime.valueOf() / hourInMs), dateV);
		const end = Math.min(Math.ceil(reservation.endDateTime.valueOf() / hourInMs), dateV + 24);

		for (let i = start; i < end; ++i) {
			const timeI = i - dateV;
			if (timeI < 0 || timeI > 23) {
				console.error('Invalid hour', i);
				continue;
			}
			for (const band of reservation.bands) {
				if (!bands.includes(band)) continue;
				for (const mode of reservation.modes) {
					freeTable[bands.indexOf(band)][timeI]?.add(mode);
				}
			}
		}
	}

	return freeTable;
}
