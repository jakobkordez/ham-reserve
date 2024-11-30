<script lang="ts">
	import Loading from '$lib/components/loading.svelte';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import {
		faArrowLeft,
		faFileCircleCheck,
		faFileCircleExclamation
	} from '@fortawesome/free-solid-svg-icons';
	import { getUTCString } from '$lib/util/date.util';
	import DownloadButton from './download-button.svelte';
	import LogSummary from './log-summary.svelte';
	import UploadLog from './upload-log.svelte';

	const { data }: { data: PageData } = $props();

	const now = new Date();
</script>

<div class="container py-10">
	{#await Promise.all([data.reservation, data.event])}
		<Loading />
	{:then [reservation, event]}
		<div class="flex flex-col gap-10">
			<div class="flex flex-col gap-4">
				<a href="/event/{event._id}" class="link flex items-center gap-2">
					<Fa icon={faArrowLeft} />
					<span>Nazaj na dogodek</span>
				</a>

				<h1 class="font-callsign text-3xl">{event.callsign}</h1>

				<div class="flex flex-col gap-1">
					<div>
						Čas: {getUTCString(reservation.startDateTime)} -{' '}
						{getUTCString(reservation.endDateTime)}
					</div>
					<div>Frekvenčni pasovi: {reservation.bands.join(', ')}</div>
					<div>Način dela: {reservation.modes.join(', ')}</div>
				</div>
			</div>

			{#if reservation.startDateTime < now || reservation.logSummary}
				<div class="flex flex-col gap-6">
					<div class="text-2xl">Radioamaterski dnevnik rezervacije</div>

					<div class="alert {reservation.logSummary ? 'alert-success' : 'alert-warning'}">
						<Fa
							icon={reservation.logSummary ? faFileCircleCheck : faFileCircleExclamation}
							class="h-8 w-8 shrink-0"
						/>
						<span>Dnevnik {reservation.logSummary ? 'uspešno' : 'še ni'} oddan</span>

						{#if reservation.logSummary}
							<DownloadButton {reservation} {event} />
						{/if}
					</div>

					{#if reservation.logSummary}
						<LogSummary logSummary={reservation.logSummary} />
					{/if}

					<UploadLog {reservation} />
				</div>
			{/if}
		</div>
	{/await}
</div>
