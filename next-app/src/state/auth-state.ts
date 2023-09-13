import { apiFunctions } from '@/api';
import { User } from '@/interfaces/user.interface';
import jwtDecode from 'jwt-decode';
import secureLocalStorage from 'react-secure-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  getUser: () => Promise<User | null>;
  isValid: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  logout: () => void;
}

export const useAuthState = create(
  persist<AuthState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      getUser: async (): Promise<User | null> => {
        const { user, isValid } = get();
        if (user) return user;

        if (!(await isValid())) return null;

        try {
          const user = (await apiFunctions.getMe(get().accessToken!)).data;
          set({ user });
          return user;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
      getAccessToken: async () => {
        const isValid = await get().isValid();
        return isValid ? get().accessToken : null;
      },
      isValid: async () => {
        const { accessToken, refreshToken } = get();

        if (accessToken) {
          const { exp } = jwtDecode(accessToken) as { exp: number };
          if (Date.now() < exp * 1000) return true;
          else set({ accessToken: null });
        }

        if (refreshToken) {
          const { exp } = jwtDecode(refreshToken) as { exp: number };
          if (Date.now() < exp * 1000) {
            // Try to refresh
            try {
              set((await apiFunctions.refresh(refreshToken)).data);
              return true;
            } catch (e) {
              set({ refreshToken: null });
            }
          }
        }

        set({ refreshToken: null, accessToken: null, user: null });
        return false;
      },
      logout: async () => {
        set({ accessToken: null, refreshToken: null, user: null });
        if (await get().isValid()) apiFunctions.logout(get().accessToken!);
      },
    }),
    {
      name: 'auth-storage',
    },
    // {
    //   name: 'auth-storage',
    //   storage: {
    //     getItem: (key) => {
    //       const value = secureLocalStorage.getItem(key) as string;
    //       return value ? JSON.parse(value) : null;
    //     },
    //     setItem: (key, value) => {
    //       secureLocalStorage.setItem(key, JSON.stringify(value));
    //     },
    //     removeItem: secureLocalStorage.removeItem,
    //   },
    // },
  ),
);
