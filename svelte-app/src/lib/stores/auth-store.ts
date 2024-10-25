import { apiFunctions } from '$lib/api';
import AsyncLock from 'async-lock';
import { isAxiosError } from 'axios';
import { get, writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';
import { browser } from '$app/environment';

const lock = new AsyncLock();

type AuthStore = {
	accessToken: string | null;
	refreshToken: string | null;
};

const state: AuthStore = (() => {
	if (!browser) return { accessToken: null, refreshToken: null };
	const value = localStorage.getItem('auth-store') || '{}';
	return JSON.parse(value) as AuthStore;
})();

export const authStore = writable<AuthStore>(state);

authStore.subscribe((value) => {
	if (!browser) return;
	localStorage.setItem('auth-store', JSON.stringify(value));
});

export async function isAuthValid(): Promise<boolean> {
	return lock.acquire<boolean>('isValid', async () => {
		const { accessToken, refreshToken } = get(authStore);

		// Check access token validity
		if (accessToken) {
			const exp = jwtDecode(accessToken).exp ?? 0;
			if (Date.now() < exp * 1000) {
				return true;
			} else authStore.update((v) => ({ ...v, accessToken: null }));
		}

		// Check refresh token validity
		if (refreshToken) {
			const exp = jwtDecode(refreshToken).exp ?? 0;
			if (Date.now() < exp * 1000) {
				// Try to refresh
				try {
					authStore.set(await apiFunctions.refresh(refreshToken));
					return true;
				} catch (e) {
					if (isAxiosError(e) && e.response?.status === 401)
						authStore.update((v) => ({ ...v, refreshToken: null }));
				}
			}
		}

		return false;
	});
}

export async function getAccessToken(): Promise<string | null> {
	const isValid = await isAuthValid();
	return isValid ? get(authStore).accessToken : null;
}

export function logout(): void {
	try {
		apiFunctions.logout(get(authStore).accessToken!);
	} catch (e) {
		console.error(e);
	}
	authStore.set({ accessToken: null, refreshToken: null });
}
