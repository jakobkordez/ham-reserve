import { apiFunctions } from '$lib/api';
import AsyncLock from 'async-lock';
import { isAxiosError } from 'axios';
import { getContext, setContext, tick } from 'svelte';
import { jwtDecode } from 'jwt-decode';
import { browser } from '$app/environment';
import { type User } from '$lib/interfaces/user.interface';

type AuthState = {
	accessToken: string | null;
	refreshToken: string | null;
};

function createAuthState() {
	const lock = new AsyncLock();
	let authState = $state<AuthState>(fetchStorage());
	let user = $state<User | null>();

	$effect(() => {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
	});

	refreshUser();

	function login(username: string, password: string) {
		return apiFunctions
			.login(username, password)
			.then((res) => {
				authState = res;
				tick().then(refreshUser);
				return true;
			})
			.catch(() => false);
	}

	function refreshUser() {
		console.log('Refreshing user');
		return getAccessToken().then((token) => {
			if (!token) user = null;
			else apiFunctions.getMe(token).then((res) => (user = res));
		});
	}

	async function getAccessToken(): Promise<string | null> {
		return await lock.acquire('isValid', async () => {
			const { accessToken } = authState;
			// Check access token validity
			if (accessToken) {
				const exp = jwtDecode(accessToken).exp ?? 0;
				if (Date.now() < exp * 1000) {
					return accessToken;
				}
			}

			const { refreshToken } = fetchStorage();
			// Check refresh token validity
			if (refreshToken) {
				const exp = jwtDecode(refreshToken).exp ?? 0;
				if (Date.now() < exp * 1000) {
					// Try to refresh
					try {
						authState = await apiFunctions.refresh(refreshToken);
						console.log('Token refreshed');
						return authState.accessToken;
					} catch (e) {
						if (isAxiosError(e) && e.response?.status === 401) authState.refreshToken = null;
					}
				}
			}

			return null;
		});
	}

	return {
		get user() {
			return user;
		},
		login,
		getAccessToken,
		refreshUser,
		async logout(): Promise<void> {
			try {
				await apiFunctions.logout((await getAccessToken())!);
			} catch (e) {
				console.error(e);
			}
			authState = { accessToken: null, refreshToken: null };
			tick().then(refreshUser);
		}
	};
}

const STORAGE_KEY = 'auth-store';

function fetchStorage(): AuthState {
	if (!browser) return { accessToken: null, refreshToken: null };
	const value = localStorage.getItem(STORAGE_KEY) || '{}';
	return JSON.parse(value) as AuthState;
}

const CONTEXT_KEY = 'AUTH_CONTEXT';

export function createAuthContext() {
	return setContext(CONTEXT_KEY, createAuthState());
}

export function getAuthContext() {
	return getContext<ReturnType<typeof createAuthContext>>(CONTEXT_KEY);
}
