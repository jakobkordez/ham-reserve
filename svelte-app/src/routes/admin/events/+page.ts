import { apiFunctions } from '$lib/api';
import { getAccessToken } from '$lib/stores/auth-store';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		events: getAccessToken()
			.then((token) => {
				if (!token) return [];
				return apiFunctions.getAllEvents(token);
			})
			.then((events) => {
				return events.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
			})
	};
};
