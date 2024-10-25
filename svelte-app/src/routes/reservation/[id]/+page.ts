import { apiFunctions } from '$lib/api';
import { getAccessToken } from '$lib/stores/auth-store';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const tokenP = getAccessToken();

	const res = tokenP.then((token) => {
		if (!token) throw Error('Unauthenticated');
		return apiFunctions.getReservation(token, params.id);
	});

	return {
		reservation: res,
		event: res.then((res) => apiFunctions.getEvent(res.event))
	};
};
