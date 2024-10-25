<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import type { Event } from '$lib/interfaces/event.interface';
	import { onMount } from 'svelte';
	import EventCard from './event-card.svelte';
	import Loading from './loading.svelte';

	let events = $state<Event[]>();

	onMount(async () => {
		apiFunctions.getCurrentEvents().then((res) => {
			events = res;
		});
	});
</script>

<div class="flex flex-col gap-2">
	<h2 class="text-2xl">Trenutni dogodki</h2>

	{#if events === undefined}
		<Loading />
	{:else if events.length === 0}
		<p class="opacity-90">No events</p>
	{:else}
		<div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
			{#each events as event, i}
				<a href={`/event/${event._id}`}>
					<EventCard {event} />
				</a>
			{/each}
		</div>
	{/if}
</div>
