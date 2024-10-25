import { apiFunctions } from '$lib/api';
import { getAccessToken } from '$lib/stores/auth-store';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		users: getAccessToken().then((token) => {
			if (!token) return [];
			return apiFunctions.getAllUsers(token);
		})
	};
};
