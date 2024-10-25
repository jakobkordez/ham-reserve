import { apiFunctions } from '$lib/api';
import { getAccessToken } from '$lib/stores/auth-store';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const tokenP = getAccessToken().then((token) => {
		if (!token) throw Error('Unauthenticated');
		return token;
	});

	return {
		user: tokenP.then(apiFunctions.getMe),
		reservations: tokenP.then(apiFunctions.getReservationsForSelf).then((res) => {
			return res.sort((a, b) => b.startDateTime.valueOf() - a.startDateTime.valueOf());
		})
	};
};
