import { apiFunctions } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		event: apiFunctions.getEvent(params.id)
	};
};
