<script lang="ts">
	import ProgressBar from '$lib/components/progress-bar.svelte';
	import type { Event } from '$lib/interfaces/event.interface';
	import { getUTCString } from '$lib/util/date.util';
	import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import FreeDatesComponent from './free-dates-component.svelte';
	import Time from './time.svelte';
	import { userStore } from '$lib/stores/user-store';
	import ReserveComponent from './reserve/reserve-component.svelte';
	import MyReservations from './reserve/my-reservations.svelte';
	import { Role } from '$lib/enums/role.enum';
	import PrivateTag from '$lib/components/private-tag.svelte';

	const { event }: { event: Event } = $props();
</script>

<div class="flex flex-col gap-8">
	<div>
		<div class="flex justify-between">
			<div class="flex flex-col items-start gap-2">
				<h1 class="font-callsign text-4xl font-medium">
					{event.callsign}
				</h1>
				<p class="opacity-90">{event.description}</p>
				{#if event.isPrivate}
					<PrivateTag />
				{/if}
			</div>

			{#if $userStore?.roles.includes(Role.Admin)}
				<a href="/admin/events/{event._id}" class="btn btn-warning btn-sm"> Uredi </a>
			{/if}
		</div>

		{#if event.fromDateTime && event.toDateTime}
			<div class="mt-4">
				<div class="mb-2 flex justify-between gap-6">
					<div>{getUTCString(event.fromDateTime)}</div>
					<div class="text-right">{getUTCString(event.toDateTime)}</div>
				</div>
				<ProgressBar start={event.fromDateTime} end={event.toDateTime} />
			</div>
		{/if}
	</div>

	<div>
		<h2 class="mb-4 text-2xl">Prosti termini</h2>
		<FreeDatesComponent {event} />
	</div>

	{#if $userStore && event.access.includes($userStore._id)}
		<div>
			<h2 class="mb-4 text-2xl">Moje rezervacije</h2>
			<MyReservations eventId={event._id} />
		</div>

		<div class="flex flex-col gap-4">
			<h2 class="text-2xl">Nova rezervacija</h2>
			<div class="alert">
				<Fa icon={faInfoCircle} class="shrink-0 text-primary" />
				Trenutni čas: <Time />
			</div>
			<ReserveComponent {event} />
		</div>
	{:else if !$userStore}
		<div>
			<a href="/login?redirect=/event/{event._id}" class="btn"> Prijavi se za rezervacijo </a>
		</div>
	{:else}
		<div class="alert">Žal nimate dovoljenja za rezervacijo tega dogodka</div>
	{/if}
</div>
