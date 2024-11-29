<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import Loading from '$lib/components/loading.svelte';
	import ReservationsTable from '$lib/components/reservations-table.svelte';
	import { getAccessToken } from '$lib/stores/auth-store';

	const { eventId }: { eventId: string } = $props();

	const reservations = getAccessToken().then((token) => {
		if (!token) return [];
		return apiFunctions.getReservationsForSelf(token, { event: eventId });
	});
</script>

{#await reservations}
	<Loading />
{:then reservations}
	{#if reservations.length > 0}
		<ReservationsTable {reservations} />
	{:else}
		<div>Ni rezervacij</div>
	{/if}
{/await}
