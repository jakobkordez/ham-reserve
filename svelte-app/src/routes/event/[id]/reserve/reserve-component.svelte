<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import { COMMON_BANDS, Band } from '$lib/enums/band.enum';
	import { COMMON_MODES, Mode } from '$lib/enums/mode.enum';
	import type { Event } from '$lib/interfaces/event.interface';
	import { dayInMs, getUTCString, hourInMs } from '$lib/util/date.util';
	import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import DateTimeInput from './date-time-input.svelte';
	import BandSelector from './band-selector.svelte';
	import ModeSelector from './mode-selector.svelte';
	import { invalidateAll } from '$app/navigation';
	import { getAccessToken } from '$lib/stores/auth-store';

	function floorHour(date: number) {
		return new Date(Math.floor(date / hourInMs) * hourInMs);
	}

	function formatHours(start: Date, end: Date) {
		const hours = (end.valueOf() - start.valueOf()) / hourInMs;
		switch (hours) {
			case 1:
				return '1 ura';
			case 2:
				return '2 uri';
			case 3:
			case 4:
				return hours + ' ure';
			default:
				return hours + ' ur';
		}
	}

	const { event }: { event: Event } = $props();

	let availableBands = $state<Set<Band>>(new Set(COMMON_BANDS));
	let availableModes = $state<Set<Mode>>(new Set(COMMON_MODES));

	let startDT = $state<Date>(floorHour(Date.now()));
	let endDT = $state<Date>(floorHour(Date.now() + hourInMs));
	let bands = $state<Set<Band>>(new Set());
	let modes = $state<Set<Mode>>(new Set());
	let error = $state<string[]>();

	const allValid = $derived(
		!(event.fromDateTime && startDT.valueOf() < event.fromDateTime.valueOf()) &&
			!(event.toDateTime && event.toDateTime.valueOf() < endDT.valueOf()) &&
			startDT.valueOf() < endDT.valueOf() &&
			bands.size > 0 &&
			modes.size > 0
	);

	let modalOpen = $state(false);

	function checkOverlap() {
		error = undefined;
		apiFunctions
			.getReservationsForEvent(event._id, {
				start: startDT.toISOString(),
				end: endDT.toISOString()
			})
			.then((reservations) => {
				const bandS = new Set(Array.from(bands).map((band) => band.toString()));
				const modeS = new Set(Array.from(modes).map((mode) => mode.toString()));
				const overlaps = [];
				for (const reservation of reservations) {
					const bandOverlap = reservation.bands.filter((band) => bandS.has(band));
					const modeOverlap = reservation.modes.filter((mode) => modeS.has(mode));
					if (bandOverlap.length && modeOverlap.length)
						overlaps.push({
							start: reservation.startDateTime,
							end: reservation.endDateTime,
							bands: bandOverlap,
							modes: modeOverlap
						});
				}
				if (overlaps.length === 0) return (modalOpen = true);
				error = overlaps.map(
					(overlap) =>
						`${getUTCString(overlap.start)} - ${getUTCString(overlap.end)} ${overlap.bands.join(', ')} ${overlap.modes.join(', ')}`
				);
			})
			.catch((err) => {
				console.error(err);
				const msg = err.response.data.message;
				if (msg instanceof Array) error = msg;
				else error = [msg];
				modalOpen = false;
			});
	}

	async function submit() {
		error = undefined;
		const token = await getAccessToken();
		if (!token) {
			error = ['Napaka'];
			return;
		}
		apiFunctions
			.createReservation(token, event._id, {
				bands: Array.from(bands),
				modes: Array.from(modes),
				startDateTime: startDT.toISOString(),
				endDateTime: endDT.toISOString()
			})
			.then(() => {
				// window.location.reload();
				invalidateAll();
			})
			.catch((err) => {
				console.error(err);
				const msg = err.response.data.message;
				if (msg instanceof Array) error = [msg.join(', ')];
				else error = msg;
				modalOpen = false;
			});
	}
</script>

<div class="flex flex-col gap-6 rounded-lg border p-6">
	<!-- <div class="tabs-boxed tabs">
      <a class="tab flex-1">Rezerviraj po urah</a>
      <a class="tab tab-active flex-1">Rezerviraj po dnevih</a>
    </div> -->

	<div class="flex flex-col gap-2">
		<div class="grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
			<DateTimeInput label="Začetek" bind:value={startDT} />

			<DateTimeInput label="Konec" bind:value={endDT} />
		</div>

		{#if startDT.valueOf() == endDT.valueOf()}
			<div class="alert alert-error">
				<Fa icon={faTriangleExclamation} class="h-6 w-6" />
				Rezervacija mora biti dolga vsaj eno uro
			</div>
		{/if}

		{#if startDT.valueOf() > endDT.valueOf()}
			<div class="alert alert-error">
				<Fa icon={faTriangleExclamation} class="h-6 w-6" />
				Začetek mora biti pred koncem
			</div>
		{/if}

		{#if endDT.valueOf() - startDT.valueOf() > dayInMs}
			<div class="alert alert-warning">
				<Fa icon={faTriangleExclamation} class="h-6 w-6" />
				Ustvarjaš rezervacijo daljšo od enega dneva, upoštevaj tudi ostale
			</div>
		{/if}

		{#if (event.fromDateTime && startDT.valueOf() < event.fromDateTime.valueOf()) || (event.toDateTime && event.toDateTime.valueOf() < endDT.valueOf())}
			<div class="alert alert-error">
				<Fa icon={faTriangleExclamation} class="h-6 w-6" />
				Čas rezervacije mora biti v času dogodka
			</div>
		{/if}
	</div>

	<BandSelector bind:bands bind:availableBands />

	<ModeSelector bind:modes bind:availableModes />

	{#if error}
		<div class="alert alert-error">
			<Fa icon={faTriangleExclamation} class="h-6 w-6" />
			<ul>
				{#each error as e}
					<li>{e}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<button class="btn btn-primary" onclick={() => checkOverlap()} disabled={!allValid}>
		Rezerviraj
	</button>

	<div class="modal {modalOpen ? 'modal-open' : ''}">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Potrdi rezervacijo</h3>
			<p class="py-4">Previdno preglej podatke in potrdi rezervacijo.</p>

			<table class="table">
				<tbody>
					<tr>
						<th>Klicni znak:</th>
						<td>{event.callsign}</td>
					</tr>
					<tr>
						<th>Začetek:</th>
						<td>{getUTCString(startDT)}</td>
					</tr>
					<tr>
						<th>Konec:</th>
						<td>{getUTCString(endDT)}</td>
					</tr>
					<tr>
						<th>Čas:</th>
						<td>{formatHours(startDT, endDT)}</td>
					</tr>
					<tr>
						<th>Frekvenčna področja:</th>
						<td>{Array.from(bands).join(', ')}</td>
					</tr>
					<tr>
						<th>Načini:</th>
						<td>{Array.from(modes).join(', ')}</td>
					</tr>
				</tbody>
			</table>

			<div class="modal-action">
				<form method="dialog">
					<button class="btn" onclick={() => (modalOpen = false)}> Prekliči </button>
				</form>
				<form method="dialog">
					<button class="btn btn-primary" onclick={submit}> Potrdi </button>
				</form>
			</div>
		</div>
	</div>
</div>
