import { apiFunctions } from '@/api';
import jwtDecode from 'jwt-decode';
import secureLocalStorage from 'react-secure-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useValidLock = create<Promise<boolean> | undefined>(() => undefined);

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;

  isValid: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  logout: () => void;
}

export const useAuthState = create(
  persist<AuthState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isValidLock: null,

      getAccessToken: async () => {
        const isValid = await get().isValid();
        return isValid ? get().accessToken : null;
      },
      isValid: async () => {
        const currentLock = useValidLock.getState();
        if (currentLock) return currentLock;

        const newLock = new Promise<boolean>(async (resolve) => {
          const { accessToken, refreshToken } = get();

          if (accessToken) {
            const { exp } = jwtDecode(accessToken) as { exp: number };
            if (Date.now() < exp * 1000) {
              resolve(true);
              return;
            } else set({ accessToken: null });
          }

          if (refreshToken) {
            const { exp } = jwtDecode(refreshToken) as { exp: number };
            if (Date.now() < exp * 1000) {
              // Try to refresh
              try {
                set(await apiFunctions.refresh(refreshToken));
                resolve(true);
                return;
              } catch (e) {
                set({ refreshToken: null });
              }
            }
          }

          set({ refreshToken: null, accessToken: null });
          resolve(false);
        });

        useValidLock.setState(newLock);

        const res = await newLock;

        useValidLock.setState(undefined);

        return res;
      },
      logout: async () => {
        try {
          apiFunctions.logout();
        } catch (e) {
          console.error(e);
        }
        set({ accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (key) => {
          const value = secureLocalStorage.getItem(key) as string;
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          secureLocalStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: secureLocalStorage.removeItem,
      },
    },
  ),
);
