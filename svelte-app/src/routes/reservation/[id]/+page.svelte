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
	import { Role } from '$lib/enums/role.enum';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';
	import { apiFunctions } from '$lib/api';
	import ProgressBar from '$lib/components/progress-bar.svelte';
	import { createTimeState } from '$lib/stores/time-state.svelte';
	import Countdown from '$lib/components/countdown.svelte';

	const { data }: { data: PageData } = $props();

	const auth = getAuthContext();

	const promise = auth.getAccessToken().then((token) => {
		if (!token) throw new Error('Unauthenticated');
		const res = apiFunctions.getReservation(token, data.id);
		return Promise.all([res, res.then((r) => apiFunctions.getEvent(r.event))]);
	});

	const now = createTimeState(10_000);
</script>

<div class="container py-10">
	{#await promise}
		<Loading />
	{:then [reservation, event]}
		<div class="flex flex-col gap-10">
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between flex-wrap">
					<a href="/event/{event._id}" class="link flex items-center gap-2">
						<Fa icon={faArrowLeft} />
						<span>Nazaj na dogodek</span>
					</a>

					{#if auth.user?.roles.includes(Role.Admin)}
						<a href="/admin/events/{event._id}" class="btn btn-warning btn-sm btn-outline">
							Nazaj na dogodek
						</a>

						<button
							onclick={() => {
								if (!confirm('Ali ste prepričani, da želite izbrisati rezervacijo?')) return;
								auth.getAccessToken().then((token) => {
									if (!token) return;
									apiFunctions.deleteReservation(token, reservation._id).then(() => {
										window.location.href = `/event/${event._id}`;
									});
								});
							}}
							class="btn btn-error btn-sm"
						>
							Izbriši
						</button>
					{/if}
				</div>

				<h1 class="font-callsign text-3xl">{event.callsign}</h1>

				<div class="flex flex-col gap-1">
					<div>
						Čas: {getUTCString(reservation.startDateTime)} -{' '}
						{getUTCString(reservation.endDateTime)}
					</div>
					<div>Frekvenčni pasovi: {reservation.bands.join(', ')}</div>
					<div>Način dela: {reservation.modes.join(', ')}</div>
				</div>

				<ProgressBar start={reservation.startDateTime} end={reservation.endDateTime} />
				{#if reservation.startDateTime < now.time && reservation.endDateTime > now.time}
					<div class="text-right">
						Do konca:
						<span class="font-semibold font-mono">
							<Countdown time={reservation.endDateTime} />
						</span>
					</div>
				{/if}
			</div>

			{#if reservation.startDateTime < now.time || reservation.logSummary}
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
	{:catch}
		<div class="text-center">
			<div class="text-6xl font-mono font-light">404</div>
			<div class="text-xl mt-2">Za to stran je potrebna prijava</div>
		</div>
	{/await}
</div>
