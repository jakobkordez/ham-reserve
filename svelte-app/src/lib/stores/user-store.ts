import { apiFunctions } from '$lib/api';
import type { User } from '$lib/interfaces/user.interface';
import { get, writable } from 'svelte/store';
import { authStore, getAccessToken } from './auth-store';

export const userStore = writable<User | null>();

export const refreshUser = () =>
	getAccessToken()
		.then((token) => {
			if (!token) return null;
			return apiFunctions.getMe(token);
		})
		.then(userStore.set);

authStore.subscribe((auth) => {
	if (!auth.refreshToken) return userStore.set(null);
	if (!get(userStore)) refreshUser();
});
