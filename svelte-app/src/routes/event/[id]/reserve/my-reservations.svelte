<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import Loading from '$lib/components/loading.svelte';
	import ReservationsTable from '$lib/components/reservations-table.svelte';
	import { getAccessToken } from '$lib/stores/auth-store';

	const { eventId }: { eventId: string } = $props();

	const reservations = getAccessToken().then((token) => {
		if (!token) return [];
		return apiFunctions
			.getReservationsForSelf(token, { event: eventId })
			.then((res) => res.sort((a, b) => b.startDateTime.valueOf() - a.startDateTime.valueOf()));
	});
</script>

{#await reservations}
	<Loading />
{:then reservations}
	<ReservationsTable {reservations} />
{/await}
