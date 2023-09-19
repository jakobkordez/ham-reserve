import axios from 'axios';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './interfaces/create-user-dto.interface';
import { Event } from './interfaces/event.interface';
import { CreateEventDto } from './interfaces/create-event-dto.interface';
import { Reservation } from './interfaces/reservation.interface';
import { CreateReservationDto } from './interfaces/create-reservation-dto';
import { useAuthState } from './state/auth-state';

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

async function getAuthHeader() {
  const accessToken = await useAuthState.getState().getAccessToken();
  if (!accessToken) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${accessToken}` };
}

export const apiFunctions = {
  // Auth
  login: async (username: string, password: string) => {
    return (
      await api.post<LoginResponse>('/auth/login', { username, password })
    ).data;
  },
  refresh: async (refreshToken: string) => {
    return (
      await api.get<LoginResponse>('/auth/refresh', {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
    ).data;
  },
  logout: async () => {
    return (
      await api.get('/auth/logout', {
        headers: await getAuthHeader(),
      })
    ).data;
  },

  // Users
  createUser: async (user: CreateUserDto) => {
    return (
      await api.post<User>('/users', user, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  getAllUsers: async () => {
    return (
      await api.get<User[]>('/users', {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  getMe: async () => {
    return (
      await api.get<User>('/users/me', {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  findByUsername: async (username: string) => {
    return (
      await api.get<User>(`/users/search/${username}`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  getUser: async (id: string) => {
    return (
      await api.get<User>(`/users/${id}`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  getManyUsers: async (ids: string[]) => {
    return (
      await api.post<User[]>(`/users/many`, ids, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  updateUser: async (id: string, user: User) => {
    return (
      await api.patch<User>(`/users/${id}`, user, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  deleteUser: async (id: string) => {
    return (
      await api.delete<User>(`/users/${id}`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },

  // Events
  createEvent: async (event: CreateEventDto) => {
    return (
      await api.post<Event>('/events', event, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  getAllEvents: async () => {
    return (
      await api.get<Event[]>('/events/all', {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  getPrivateEvents: async () => {
    return (
      await api.get<Event[]>('/events/private', {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  getCurrentEvents: async () => {
    return (await api.get<Event[]>('/events')).data;
  },
  getEvent: async (id: string) => {
    return (await api.get<Event>(`/events/${id}`)).data;
  },
  updateEvent: async (id: string, event: Event) => {
    return (
      await api.patch<Event>(`/events/${id}`, event, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  grantEventAccess: async (id: string, userId: string) => {
    return (
      await api.get<Event>(`/events/${id}/grant/${userId}`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  revokeEventAccess: async (id: string, userId: string) => {
    return (
      await api.get<Event>(`/events/${id}/revoke/${userId}`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  deleteEvent: async (id: string) => {
    return (
      await api.delete<Event>(`/events/${id}`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },

  // Reservations
  getReservation: async (id: string) => {
    return (
      await api.get<Reservation>(`/reservations/${id}`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  updateReservation: async (id: string, reservation: Reservation) => {
    return (
      await api.patch<Reservation>(`/reservations/${id}`, reservation, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  deleteReservation: async (id: string) => {
    return (
      await api.delete<Reservation>(`/reservations/${id}`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  createReservation: async (
    eventId: string,
    reservation: CreateReservationDto,
  ) => {
    return (
      await api.post<Reservation>(
        `/events/${eventId}/reservations`,
        reservation,
        { headers: await getAuthHeader() },
      )
    ).data;
  },
  getReservationsForEvent: async (eventId: string) => {
    return (await api.get<Reservation[]>(`/events/${eventId}/reservations`))
      .data;
  },
  getReservationsForSelf: async (filter?: {
    event?: string;
    start?: string;
    end?: string;
  }) => {
    return (
      await api.get<Reservation[]>('/users/me/reservations', {
        headers: await getAuthHeader(),
        params: {
          event: filter?.event,
          start: filter?.start,
          end: filter?.end,
        },
      })
    ).data;
  },
  getReservationsForUser: async (userId: string) => {
    return (
      await api.get<Reservation[]>(`/users/${userId}/reservations`, {
        headers: await getAuthHeader(),
      })
    ).data;
  },
  uploadLog: async (reservationId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return (
      await api.post<Reservation>(
        `/reservations/${reservationId}/log`,
        formData,
        {
          headers: {
            ...(await getAuthHeader()),
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    ).data;
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
