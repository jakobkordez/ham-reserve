<script lang="ts">
	import Loading from '$lib/components/loading.svelte';
	import PrivateTag from '$lib/components/private-tag.svelte';
	import ProgressBar from '$lib/components/progress-bar.svelte';
	import { getUTCString } from '$lib/util/date.util';
	import type { PageData } from './$types';
	import AccessComponent from './access-component.svelte';
	import ReservationsComponent from './reservations-component.svelte';

	export let data: PageData;
</script>

{#await data.event}
	<Loading />
{:then event}
	<div class="flex flex-col gap-8">
		<div>
			<div class="flex flex-col items-start gap-2">
				<div>
					<h1 class="font-callsign text-4xl font-medium">
						{event.callsign}
					</h1>
					<div class="text-sm opacity-70">{event._id}</div>
				</div>

				<p class="opacity-90">{event.description}</p>
				{#if event.isPrivate}
					<PrivateTag />
				{/if}
			</div>

			{#if event.fromDateTime && event.toDateTime}
				<div class="mt-4">
					<div class="mb-2 flex justify-between">
						<div>{getUTCString(event.fromDateTime)}</div>
						<div>{getUTCString(event.toDateTime)}</div>
					</div>
					<ProgressBar start={event.fromDateTime} end={event.toDateTime} />
				</div>
			{/if}
		</div>

		<div class="flex gap-4">
			<a href="/event/{event._id}" class="btn btn-primary">Na stran dogodka</a>
		</div>

		<AccessComponent {event} />

		<ReservationsComponent {event} />
	</div>
{/await}
