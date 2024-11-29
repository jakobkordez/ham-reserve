import type { LogSummary } from './log-summary.interface';

export interface Reservation {
	_id: string;
	user: string;
	event: string;
	startDateTime: Date;
	endDateTime: Date;
	modes: string[];
	bands: string[];
	logSummary?: LogSummary;
	createdAt: Date;
	isDeleted: boolean;
}
