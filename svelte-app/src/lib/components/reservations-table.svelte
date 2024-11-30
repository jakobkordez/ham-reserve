<script lang="ts">
	import type { Reservation } from '$lib/interfaces/reservation.interface';
	import { dayInMs, getUTCDateString, getUTCTimeString } from '$lib/util/date.util';
	import { faFileCircleCheck, faFileCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { reservations }: { reservations: Reservation[] } = $props();

	function formatDateTime(reservation: Reservation) {
		let ret =
			getUTCDateString(reservation.startDateTime) +
			' ' +
			getUTCTimeString(reservation.startDateTime) +
			' - ';
		if (
			Math.floor(reservation.endDateTime.valueOf() / dayInMs) !==
			Math.floor(reservation.startDateTime.valueOf() / dayInMs)
		) {
			ret += getUTCDateString(reservation.endDateTime) + ' ';
		}
		return ret + getUTCTimeString(reservation.endDateTime);
	}
</script>

<div class="overflow-x-auto">
	<table class="table">
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
			{#each reservations as reservation}
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
			{:else}
				<tr>
					<td colspan="5" class="opacity-80 italic text-center">Ni rezervacij</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
