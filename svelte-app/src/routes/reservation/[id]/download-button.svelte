<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import type { Event } from '$lib/interfaces/event.interface';
	import type { Reservation } from '$lib/interfaces/reservation.interface';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';
	import { faDownload } from '@fortawesome/free-solid-svg-icons';
	import { tick } from 'svelte';
	import Fa from 'svelte-fa';

	const { event, reservation }: { event: Event; reservation: Reservation } = $props();

	const auth = getAuthContext();

	let aRef: HTMLAnchorElement;
	let url = $state<string>();

	$effect(() => {
		return () => {
			if (url) window.URL.revokeObjectURL(url);
		};
	});

	async function download() {
		if (url) {
			aRef.click();
			return;
		}

		const token = await auth.getAccessToken();
		if (!token) return;
		apiFunctions
			.getLog(token, reservation._id)
			.then((res) => {
				url = window.URL.createObjectURL(new Blob([res]));
				tick().then(() => aRef.click());
			})
			.catch((e) => {
				console.error(e);
			});
	}
</script>

{#snippet buttonContent()}
	<Fa icon={faDownload} />
	<span>Prenesi</span>
{/snippet}

<button class="btn btn-sm {url ? 'hidden' : ''}" onclick={download}>
	{@render buttonContent()}
</button>
<a
	bind:this={aRef}
	href={url}
	class="btn btn-sm {url ? '' : 'hidden'}"
	download="{event.callsign}_{reservation.user.substring(18)}_{reservation._id.substring(18)}.adi"
>
	{@render buttonContent()}
</a>
