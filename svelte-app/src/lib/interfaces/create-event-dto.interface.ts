export interface CreateEventDto {
	callsign: string;
	description: string;
	fromDateTime?: string;
	toDateTime?: string;
	isPrivate?: boolean;
}
