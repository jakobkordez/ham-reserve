export interface CreateReservationDto {
	startDateTime: string;
	endDateTime: string;
	modes: string[];
	bands: string[];
}
