import axios from 'axios';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './interfaces/create-user-dto.interface';
import { Event } from './interfaces/event.interface';
import { CreateEventDto } from './interfaces/create-event-dto.interface';
import { Reservation } from './interfaces/reservation.interface';
import { CreateReservationDto } from './interfaces/create-reservation-dto';

const baseURL = '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    return await api.post<LoginResponse>('/auth/login', { username, password });
  },
  refresh: async (refreshToken: string) => {
    return await api.get<LoginResponse>('/auth/refresh', {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  },
  logout: async (accessToken: string) => {
    return await api.get('/auth/logout', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  // Users
  createUser: async (accessToken: string, user: CreateUserDto) => {
    return await api.post<User>('/users', user, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getAllUsers: async (accessToken: string) => {
    return await api.get<User[]>('/users', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getMe: async (accessToken: string) => {
    return await api.get<User>('/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  findByUsername: async (accessToken: string, username: string) => {
    return await api.get<User>(`/users/search/${username}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getUser: async (accessToken: string, id: string) => {
    return await api.get<User>(`/users/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getManyUsers: async (accessToken: string, ids: string[]) => {
    return await api.post<User[]>(`/users/many`, ids, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  updateUser: async (accessToken: string, id: string, user: User) => {
    return await api.patch<User>(`/users/${id}`, user, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  deleteUser: async (accessToken: string, id: string) => {
    return await api.delete<User>(`/users/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  // Events
  createEvent: async (accessToken: string, event: CreateEventDto) => {
    return await api.post<Event>('/events', event, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getAllEvents: async (accessToken: string) => {
    return await api.get<Event[]>('/events/all', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getPrivateEvents: async (accessToken: string) => {
    return await api.get<Event[]>('/events/private', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getCurrentEvents: async () => {
    return await api.get<Event[]>('/events');
  },
  getEvent: async (id: string) => {
    return await api.get<Event>(`/events/${id}`);
  },
  updateEvent: async (accessToken: string, id: string, event: Event) => {
    return await api.patch<Event>(`/events/${id}`, event, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  grantEventAccess: async (accessToken: string, id: string, userId: string) => {
    return await api.get<Event>(`/events/${id}/grant/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  revokeEventAccess: async (
    accessToken: string,
    id: string,
    userId: string,
  ) => {
    return await api.get<Event>(`/events/${id}/revoke/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  deleteEvent: async (accessToken: string, id: string) => {
    return await api.delete<Event>(`/events/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  // Reservations
  getReservation: async (accessToken: string, id: string) => {
    return await api.get<Reservation>(`/reservations/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  updateReservation: async (
    accessToken: string,
    id: string,
    reservation: Reservation,
  ) => {
    return await api.patch<Reservation>(`/reservations/${id}`, reservation, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  deleteReservation: async (accessToken: string, id: string) => {
    return await api.delete<Reservation>(`/reservations/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  createReservation: async (
    accessToken: string,
    eventId: string,
    reservation: CreateReservationDto,
  ) => {
    return await api.post<Reservation>(
      `/events/${eventId}/reservations`,
      reservation,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  },
  getReservationsForEvent: async (eventId: string) => {
    return await api.get<Reservation[]>(`/events/${eventId}/reservations`);
  },
  getReservationsForSelf: async (
    accessToken: string,
    filter?: {
      event?: string;
      start?: string;
      end?: string;
    },
  ) => {
    return await api.get<Reservation[]>('/users/me/reservations', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        event: filter?.event,
        start: filter?.start,
        end: filter?.end,
      },
    });
  },
  getReservationsForUser: async (accessToken: string, userId: string) => {
    return await api.get<Reservation[]>(`/users/${userId}/reservations`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  uploadLog: async (accessToken: string, reservationId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post<Reservation>(
      `/reservations/${reservationId}/log`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
};

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z?$/;

function isIsoDateString(value: unknown): boolean {
  return !!value && typeof value === 'string' && isoDateFormat.test(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== 'object')
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = new Date(Date.parse(value));
    else if (typeof value === 'object') handleDates(value);
  }
}
