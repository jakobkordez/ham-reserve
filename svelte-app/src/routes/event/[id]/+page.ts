import { apiFunctions } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const id = params.id;

	return {
		event: apiFunctions.getEvent(id)
	};
};
