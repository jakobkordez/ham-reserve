<script lang="ts">
	import type { Reservation } from '$lib/interfaces/reservation.interface';
	import { getUTCString } from '$lib/util/date.util';
	import { faFileCircleCheck, faFileCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { reservations }: { reservations: Reservation[] } = $props();
</script>

<table class="table">
	<colgroup>
		<!-- <col style={{ width: '30%' }} />  -->
		<col />
		<col width="30%" />
		<col width="30%" />
		<col />
		<col />
	</colgroup>
	<thead>
		<tr>
			<th>Čas</th>
			<th>Frekvenčna področja</th>
			<th>Načini</th>
		</tr>
	</thead>
	<tbody>
		{#each reservations as reservation}
			<tr>
				<td>
					{getUTCString(reservation.startDateTime)} -<br />
					{getUTCString(reservation.endDateTime)}
				</td>
				<td>
					<div class="flex flex-wrap gap-1">
						{reservation.bands.join(', ')}
					</div>
				</td>
				<td>
					<div class="flex flex-wrap gap-1">
						{reservation.modes.join(', ')}
					</div>
				</td>
				<td>
					{#if reservation.startDateTime < new Date()}
						<Fa
							icon={reservation.logSummary ? faFileCircleCheck : faFileCircleExclamation}
							class={`h-5 w-5 ${reservation.logSummary ? 'text-green-400' : 'text-orange-300'}`}
						/>
					{/if}
				</td>
				<td>
					<a href={`/reservation/${reservation._id}`} class="btn btn-sm">Več</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
