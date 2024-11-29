<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import Loading from '$lib/components/loading.svelte';
	import type { Event } from '$lib/interfaces/event.interface';
	import type { Reservation } from '$lib/interfaces/reservation.interface';
	import type { User } from '$lib/interfaces/user.interface';
	import { getAccessToken } from '$lib/stores/auth-store';
	import { dayInMs, getUTCDateString, getUTCTimeString } from '$lib/util/date.util';
	import { faFileCircleCheck, faFileCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	const { event }: { event: Event } = $props();

	let reservations = $state<Reservation[]>();
	let users = $state<Map<string, User>>();

	$effect(() => {
		apiFunctions
			.getReservationsForEvent(event._id)
			.then((res) => {
				reservations = res.sort((a, b) => b.startDateTime.valueOf() - a.startDateTime.valueOf());
				const u = new Set<string>(res.map((r) => r.user));
				getAccessToken().then((token) => {
					if (!token) return;
					apiFunctions
						.getManyUsers(token, Array.from(u))
						.then((res) => {
							users = new Map(res.map((u) => [u._id, u]));
						})
						.catch(console.error);
				});
			})
			.catch(console.error);
	});

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

<div>
	<h2 class="text-2xl">Rezervacije</h2>

	{#if reservations}
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>Uporabnik</th>
						<th class="min-w-32">Čas</th>
						<th>Območja</th>
						<th>Načini</th>
					</tr>
				</thead>
				<tbody>
					{#each reservations as reservation}
						{@const username = users?.get(reservation.user)?.username}
						<tr>
							<td class="font-callsign text-lg">
								{#if username}
									{username}
								{:else}
									<Loading />
								{/if}
							</td>
							<td>{formatDateTime(reservation)}</td>
							<td>{reservation.bands.join(', ')}</td>
							<td>{reservation.modes.join(', ')}</td>
							<td>
								{#if reservation.startDateTime < new Date()}
									<Fa
										icon={reservation.logSummary ? faFileCircleCheck : faFileCircleExclamation}
										class="h-5 w-5 {reservation.logSummary ? 'text-green-400' : 'text-orange-300'}"
									/>
								{/if}
							</td>
							<td>
								<a href="/reservation/{reservation._id}" class="btn btn-sm"> Več </a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
