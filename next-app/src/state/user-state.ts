import { apiFunctions } from '@/api';
import { User } from '@/interfaces/user.interface';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  getUser: () => Promise<User | null>;
}

export const useUserState = create<UserState>((set, get) => ({
  user: null,
  getUser: async () => {
    const user = get().user;
    if (user) return user;

    try {
      const userFromApi = await apiFunctions.getMe();
      set({ user: userFromApi });
      return userFromApi;
    } catch (error) {
      return null;
    }
  },
}));
