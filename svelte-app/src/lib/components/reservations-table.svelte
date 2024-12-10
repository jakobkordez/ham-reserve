<script lang="ts">
	import type { Reservation } from '$lib/interfaces/reservation.interface';
	import { getUTCDateString, getUTCTimeString } from '$lib/util/date.util';
	import {
		faCaretLeft,
		faCaretRight,
		faFileCircleCheck,
		faFileCircleExclamation
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { reservations, pageSize = 5 }: { reservations: Reservation[]; pageSize: number } = $props();

	let page = $state(0);

	function formatDateTime(r: Reservation) {
		const d = getUTCDateString;
		const t = getUTCTimeString;
		let ret = d(r.startDateTime) + ' ' + t(r.startDateTime) + ' - ';
		if (d(r.endDateTime) !== d(r.startDateTime)) ret += d(r.endDateTime) + ' ';
		return ret + t(r.endDateTime);
	}
</script>

<div class="overflow-x-auto">
	<table class="table border-b border-base-200">
		<colgroup>
			<col />
			<col />
			<col />
			<col />
			<col />
		</colgroup>
		<thead>
			<tr>
				<th class="min-w-32">Čas</th>
				<th>Obsegi</th>
				<th>Načini</th>
			</tr>
		</thead>
		<tbody>
			{#each reservations.slice(page * pageSize, (page + 1) * pageSize) as reservation}
				<tr>
					<td>
						{formatDateTime(reservation)}
						<span class="text-xs text-gray-600">UTC</span>
					</td>
					<td>
						{reservation.bands.join(', ')}
					</td>
					<td>
						{reservation.modes.join(', ')}
					</td>
					<td>
						{#if reservation.startDateTime < new Date()}
							<Fa
								icon={reservation.logSummary ? faFileCircleCheck : faFileCircleExclamation}
								class="h-5 w-5 {reservation.logSummary ? 'text-green-400' : 'text-orange-300'}"
							/>
						{/if}
					</td>
					<td>
						<a href="/reservation/{reservation._id}" class="btn btn-sm">Več</a>
					</td>
				</tr>
			{/each}
			{#each { length: Math.max(0, (page + 1) * pageSize - reservations.length) }}
				<tr>
					<td colspan="5">
						<button class="btn btn-sm invisible">Več</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="flex justify-center items-center gap-4 mt-4">
		<button class="btn btn-sm btn-primary" disabled={page == 0} onclick={() => (page -= 1)}>
			<Fa icon={faCaretLeft} />
		</button>
		<div>{page + 1}</div>
		<button
			class="btn btn-sm btn-primary"
			disabled={(page + 1) * pageSize >= reservations.length}
			onclick={() => (page += 1)}
		>
			<Fa icon={faCaretRight} />
		</button>
	</div>
</div>
