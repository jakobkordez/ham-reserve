import axios from 'axios';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './interfaces/create-user-dto.interface';

const baseURL = 'http://localhost:3001/';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  createEvent: async (accessToken: string, event: Event) => {
    return await api.post<Event>('/events', event, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getAllEvents: async (accessToken: string) => {
    return await api.get<Event[]>('/events/all', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getCurrentEvents: async (accessToken: string) => {
    return await api.get<Event[]>('/events', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getEvent: async (accessToken: string, id: string) => {
    return await api.get<Event>(`/events/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  updateEvent: async (accessToken: string, id: string, event: Event) => {
    return await api.patch<Event>(`/events/${id}`, event, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  deleteEvent: async (accessToken: string, id: string) => {
    return await api.delete<Event>(`/events/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
