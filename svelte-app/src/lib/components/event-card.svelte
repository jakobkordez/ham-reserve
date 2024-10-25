<script lang="ts">
	import type { Event } from '$lib/interfaces/event.interface';
	import { getUTCDateString, getUTCTimeString } from '$lib/util/date.util';
	import ProgressBar from './progress-bar.svelte';

	let { event }: { event: Event } = $props();
</script>

<div class="rounded-lg bg-base-200 py-4 px-6 flex h-full flex-col justify-between gap-3">
	<div>
		<h1 class="font-callsign card-title mb-1 text-2xl">
			{event.callsign}
		</h1>

		{#if event.description}
			<p>{event.description}</p>
		{:else}
			<p class="font-light italic">Brez opisa</p>
		{/if}

		{#if event.fromDateTime && event.fromDateTime > new Date()}
			<div class="badge badge-primary mt-3 w-full">Začetek kmalu</div>
		{/if}

		{#if event.toDateTime && event.toDateTime < new Date()}
			<div class="badge badge-ghost mt-3 w-full">Zaključeno</div>
		{/if}
	</div>

	{#if (event.fromDateTime != undefined) !== (event.toDateTime != undefined)}
		<div class="mt-2 text-sm">
			<span class="font-bold">{event.fromDateTime ? 'Od' : 'Do'}:</span>{' '}
			{getUTCDateString(event.fromDateTime ?? event.toDateTime!)}{' '}
			{getUTCTimeString(event.fromDateTime ?? event.toDateTime!)}
		</div>
	{/if}

	{#if event.fromDateTime && event.toDateTime}
		<div class="mt-2 text-sm">
			<div class="flex justify-between">
				<div>{getUTCDateString(event.fromDateTime)}</div>
				<div>{getUTCDateString(event.toDateTime)}</div>
			</div>
			<div class="flex justify-between">
				<div>{getUTCTimeString(event.fromDateTime)}</div>
				<div>{getUTCTimeString(event.toDateTime)}</div>
			</div>

			<ProgressBar start={event.fromDateTime} end={event.toDateTime} />
		</div>
	{/if}
</div>
