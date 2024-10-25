import axios from 'axios';
import type { User } from './interfaces/user.interface';
import type { CreateUserDto } from './interfaces/create-user-dto.interface';
import type { Event } from './interfaces/event.interface';
import type { CreateEventDto } from './interfaces/create-event-dto.interface';
import type { Reservation } from './interfaces/reservation.interface';
import type { CreateReservationDto } from './interfaces/create-reservation-dto';

const baseURL = 'http://localhost:3001';

const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json'
	}
});

api.interceptors.response.use((originalResponse) => {
	handleDates(originalResponse.data);
	return originalResponse;
});

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

export const apiFunctions = {
	// Auth
	login: async (username: string, password: string) => {
		return (await api.post<LoginResponse>('/auth/login', { username, password })).data;
	},
	refresh: async (refreshToken: string) => {
		return (
			await api.get<LoginResponse>('/auth/refresh', {
				headers: { Authorization: `Bearer ${refreshToken}` }
			})
		).data;
	},
	logout: async (accessToken: string) => {
		return (
			await api.get('/auth/logout', {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	updateSelfPassword: async (accessToken: string, oldPassword: string, newPassword: string) => {
		return (
			await api.patch<User>(
				'/auth/password',
				{ oldPassword, newPassword },
				{
					headers: { Authorization: `Bearer ${accessToken}` }
				}
			)
		).data;
	},

	// Users
	createUser: async (accessToken: string, user: CreateUserDto) => {
		return (
			await api.post<User>('/users', user, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	getAllUsers: async (accessToken: string) => {
		return (
			await api.get<User[]>('/users', {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	getMe: async (accessToken: string) => {
		return (
			await api.get<User>('/users/me', {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	findByUsername: async (accessToken: string, username: string) => {
		return (
			await api.get<User>(`/users/search/${username}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	getUser: async (accessToken: string, id: string) => {
		return (
			await api.get<User>(`/users/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	getManyUsers: async (accessToken: string, ids: string[]) => {
		return (
			await api.post<User[]>(`/users/many`, ids, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	updateUser: async (accessToken: string, id: string, user: User) => {
		return (
			await api.patch<User>(`/users/${id}`, user, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	updateSelf: async (
		accessToken: string,
		user: { name?: string; email?: string; phone?: string }
	) => {
		return (
			await api.patch<User>('/users/me', user, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	deleteUser: async (accessToken: string, id: string) => {
		return (
			await api.delete<User>(`/users/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},

	// Events
	createEvent: async (accessToken: string, event: CreateEventDto) => {
		return (
			await api.post<Event>('/events', event, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	getAllEvents: async (accessToken: string) => {
		return (
			await api.get<Event[]>('/events/all', {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	getPrivateEvents: async (accessToken: string) => {
		return (
			await api.get<Event[]>('/events/private', {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	getCurrentEvents: async () => {
		return (await api.get<Event[]>('/events')).data;
	},
	getEvent: async (id: string) => {
		return (await api.get<Event>(`/events/${id}`)).data;
	},
	updateEvent: async (accessToken: string, id: string, event: Event) => {
		return (
			await api.patch<Event>(`/events/${id}`, event, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	grantEventAccess: async (accessToken: string, id: string, userId: string) => {
		return (
			await api.get<Event>(`/events/${id}/grant/${userId}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	revokeEventAccess: async (accessToken: string, id: string, userId: string) => {
		return (
			await api.get<Event>(`/events/${id}/revoke/${userId}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	deleteEvent: async (accessToken: string, id: string) => {
		return (
			await api.delete<Event>(`/events/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},

	// Reservations
	getReservation: async (accessToken: string, id: string) => {
		return (
			await api.get<Reservation>(`/reservations/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	updateReservation: async (accessToken: string, id: string, reservation: Reservation) => {
		return (
			await api.patch<Reservation>(`/reservations/${id}`, reservation, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	deleteReservation: async (accessToken: string, id: string) => {
		return (
			await api.delete<Reservation>(`/reservations/${id}`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	createReservation: async (
		accessToken: string,
		eventId: string,
		reservation: CreateReservationDto
	) => {
		return (
			await api.post<Reservation>(`/events/${eventId}/reservations`, reservation, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	getReservationsForEvent: async (
		eventId: string,
		filter?: {
			start?: string;
			end?: string;
		}
	) => {
		return (
			await api.get<Reservation[]>(`/events/${eventId}/reservations`, {
				params: {
					start: filter?.start,
					end: filter?.end
				}
			})
		).data;
	},
	getReservationsForSelf: async (
		accessToken: string,
		filter?: { event?: string; start?: string; end?: string }
	) => {
		return (
			await api.get<Reservation[]>('/users/me/reservations', {
				headers: { Authorization: `Bearer ${accessToken}` },
				params: {
					event: filter?.event,
					start: filter?.start,
					end: filter?.end
				}
			})
		).data;
	},
	getReservationsForUser: async (accessToken: string, userId: string) => {
		return (
			await api.get<Reservation[]>(`/users/${userId}/reservations`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	},
	uploadLog: async (accessToken: string, reservationId: string, file: File) => {
		const formData = new FormData();
		formData.append('file', file);
		return (
			await api.post<Reservation>(`/reservations/${reservationId}/log`, formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'multipart/form-data'
				}
			})
		).data;
	},
	getLog: async (accessToken: string, reservationId: string) => {
		return (
			await api.get<string>(`/reservations/${reservationId}/log`, {
				headers: { Authorization: `Bearer ${accessToken}` }
			})
		).data;
	}
};

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z?$/;

function isIsoDateString(value: unknown): boolean {
	return !!value && typeof value === 'string' && isoDateFormat.test(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleDates(body: any) {
	if (body === null || body === undefined || typeof body !== 'object') return body;

	for (const key of Object.keys(body)) {
		const value = body[key];
		if (isIsoDateString(value)) body[key] = new Date(Date.parse(value));
		else if (typeof value === 'object') handleDates(value);
	}
}
