<script lang="ts">
	import type { Event } from '$lib/interfaces/event.interface';
	import { Band, COMMON_BANDS } from '$lib/enums/band.enum';
	import { COMMON_MODES, Mode } from '$lib/enums/mode.enum';
	import Fa from 'svelte-fa';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import type { Reservation } from '$lib/interfaces/reservation.interface';
	import { apiFunctions } from '$lib/api';
	import { dayInMs } from '$lib/util/date.util';
	import { clampDate, mapReservations } from '.';

	const { event }: { event: Event } = $props();

	const minDate = $derived(event.fromDateTime ?? event.createdAt);

	let reservations = $state<Reservation[]>();

	let date = $state(clampDate(new Date(), event).toISOString().slice(0, 10));
	let band = $state<Band>();
	let mode = $state<Mode>();

	const bands = $derived(band ? [band.toString()] : COMMON_BANDS.map((band) => band.toString()));
	const modes = $derived(
		mode ? [mode.toString()] : Object.values(Mode).map((mode) => mode.toString())
	);

	const freeTable = $derived(mapReservations(reservations, bands, modes, new Date(date)));

	$effect(() => {
		reservations = undefined;
		apiFunctions
			.getReservationsForEvent(event._id, {
				start: date,
				end: new Date(new Date(date).valueOf() + dayInMs).toISOString()
			})
			.then((r) => (reservations = r))
			.catch(console.error);
	});

	const formatTime = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;
</script>

<div class="flex flex-col gap-5 md:flex-row">
	<div class="flex flex-1 flex-col justify-start gap-3 px-6 py-4 border rounded-xl">
		<div class="flex justify-between items-center">
			<h3 class="text-xl font-semibold">Filtri</h3>
			<button
				class="btn btn-sm btn-primary btn-outline"
				onclick={() => {
					band = undefined;
					mode = undefined;
				}}>Počisti</button
			>
		</div>

		<label class="form-control">
			<div class="label">
				<span class="label-text">Datum</span>
			</div>
			<input
				type="date"
				class="input input-bordered"
				bind:value={date}
				min={minDate.toISOString().slice(0, 10)}
				max={event.toDateTime?.toISOString().slice(0, 10)}
			/>
			<div class="mt-2 flex gap-2">
				<button
					class="btn btn-primary btn-sm flex-1"
					onclick={() => {
						let d = new Date(date);
						d.setDate(d.getDate() - 1);
						clampDate(d, event);
						date = d.toISOString().slice(0, 10);
					}}
				>
					<Fa icon={faChevronLeft} />
				</button>
				<button
					class="btn btn-primary btn-sm flex-1"
					onclick={() => {
						let d = new Date(date);
						d.setDate(d.getDate() + 1);
						clampDate(d, event);
						date = d.toISOString().slice(0, 10);
					}}
				>
					<Fa icon={faChevronRight} />
				</button>
			</div>
		</label>
		<div class="form-control">
			<div class="label">
				<span class="label-text">Frekvenčni pas</span>
			</div>
			<div class="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-1">
				{#each COMMON_BANDS as b}
					<button
						class="btn btn-sm {band === b ? 'btn-primary' : ''}"
						onclick={() => {
							if (band === b) band = undefined;
							else band = b;
						}}
					>
						{b}
					</button>
				{/each}
			</div>
			<select
				class="select select-bordered select-xs mt-2 w-full"
				value={band?.toString() ?? ''}
				onchange={(e) => {
					const val = e.currentTarget.value;
					if (val == '') band = undefined;
					else band = val as Band;
				}}
			>
				<option value="">---</option>
				{#each Object.values(Band) as band}
					<option value={band}>{band}</option>
				{/each}
			</select>
			<!-- <label class="label">
          <span class="label-text-alt">
            Tukaj se nahajajo vsi frekvenčni pasovi
          </span>
        </label> -->
		</div>
		<div class="form-control">
			<div class="label">
				<span class="label-text">Način</span>
			</div>
			<div class="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-1">
				{#each COMMON_MODES as m}
					<button
						class="btn btn-sm {mode === m ? 'btn-primary' : ''}"
						onclick={() => {
							mode = mode === m ? undefined : m;
						}}
					>
						{m}
					</button>
				{/each}
			</div>
			<select
				class="select select-bordered w-full mt-2"
				value={mode?.toString() ?? ''}
				onchange={(e) => {
					const val = e.currentTarget.value;
					if (val == '') mode = undefined;
					else mode = val as Mode;
				}}
			>
				<option value="">Vsi</option>
				{#each Object.values(Mode) as mode}
					<option value={mode}>{mode}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="flex-[2] overflow-x-auto">
		<table class="table mx-auto w-auto">
			<tbody>
				<tr>
					<td></td>
					<td>
						<div class="flex">
							<div class="w-12 border-l border-base-300 pl-1">0</div>
							<div class="w-12 border-l border-base-300 pl-1">4</div>
							<div class="w-12 border-l border-base-300 pl-1">8</div>
							<div class="w-12 border-l border-base-300 pl-1">12</div>
							<div class="w-12 border-l border-base-300 pl-1">16</div>
							<div class="w-12 border-l border-base-300 pl-1">20</div>
						</div>
					</td>
				</tr>

				{#each bands as band, bi}
					<tr>
						<th class="px-3 py-2">
							{band}
						</th>
						<td>
							<div class="flex">
								{#each freeTable[bi] as taken, i}
									<div
										class="tooltip m-auto h-3 w-3 border-l border-base-200 first:rounded-l-full first:border-0 last:rounded-r-full {taken ==
										null
											? 'bg-base-200'
											: taken.size == 0
												? 'bg-success/80'
												: mode || taken.size == Object.values(Mode).length
													? 'bg-error/70'
													: 'bg-warning/90'}"
										data-tip="{formatTime(i)} - {formatTime(i + 1)} UTC"
									></div>
								{/each}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
