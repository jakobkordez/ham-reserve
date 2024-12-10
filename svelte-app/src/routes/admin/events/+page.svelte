<script lang="ts">
	import { faAdd } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { getUTCString } from '$lib/util/date.util';
	import PrivateTag from '$lib/components/private-tag.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';
	import { apiFunctions } from '$lib/api';

	const auth = getAuthContext();

	const eventsP = auth
		.getAccessToken()
		.then((token) => {
			if (!token) return [];
			return apiFunctions.getAllEvents(token);
		})
		.then((events) => {
			return events.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
		});
</script>

<div>
	<div class="mb-4 flex items-center">
		<h2 class="flex-1 text-2xl font-medium">Vsi dogodki</h2>

		<a href="/admin/events/create" class="btn btn-primary btn-sm">
			<Fa icon={faAdd} />
			<span>Add</span>
		</a>
	</div>

	{#await eventsP}
		<Loading />
	{:then events}
		<div class="overflow-x-auto">
			<table class="table">
				<colgroup>
					<col class="w-1/2" />
					<col class="w-1/2" />
					<col />
				</colgroup>
				<tbody>
					{#each events as event}
						<tr class={event.toDateTime && event.toDateTime < new Date() ? 'opacity-60' : ''}>
							<td class="flex flex-1 items-center gap-3">
								<div class="font-callsign text-2xl">
									{event.callsign}
								</div>

								{#if event.isPrivate}
									<PrivateTag />
								{/if}
							</td>

							<td class="flex-1 text-sm opacity-80">
								<div>
									Od:{' '}
									{event.fromDateTime ? getUTCString(event.fromDateTime) : '/'}
								</div>
								<div>
									Do: {event.toDateTime ? getUTCString(event.toDateTime) : '/'}
								</div>
							</td>

							<th>
								<a href="/admin/events/{event._id}" class="btn btn-ghost btn-sm">Več</a>
							</th>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/await}
</div>
