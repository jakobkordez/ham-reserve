import axios from 'axios';
import { User } from './interfaces/user.interface';

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
  login: async (username: string, password: string) => {
    return await api.post<LoginResponse>('/auth/login', { username, password });
  },
  refresh: async (refreshToken: string) => {
    return await api.get<LoginResponse>('/auth/refresh', {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  },
  getMe: async (accessToken: string) => {
    return await api.get<User>('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  logout: async (accessToken: string) => {
    return await api.get('/auth/logout', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
