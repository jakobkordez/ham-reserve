<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import type { Reservation } from '$lib/interfaces/reservation.interface';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';

	const { reservation: res }: { reservation: Reservation } = $props();

	const auth = getAuthContext();

	let error = $state<string>();
	let file = $state<File>();

	async function submit() {
		if (!file) {
			error = 'Datoteka ni izbrana';
			console.error('No file selected');
			return;
		}

		const token = await auth.getAccessToken();
		if (!token) return;
		apiFunctions
			.uploadLog(token, res._id, file)
			.then(() => {
				window.location.reload();
			})
			.catch((e) => {
				error = e.response.data.message;
				console.error(e);
			});
	}
</script>

{#if auth.user?._id === res.user}
	<div class="form-control">
		<div class="label">
			{res.logSummary ? 'Ponovno oddaj' : 'Oddaj'} dnevnik
		</div>
		<div class="flex items-center gap-3">
			<input
				type="file"
				class="file-input file-input-bordered"
				onchange={(e) => (file = e.currentTarget.files ? e.currentTarget.files[0] : undefined)}
			/>
			<button class="btn btn-primary" onclick={() => submit()}>
				{res.logSummary ? 'Povozi' : 'Pošlji'}
			</button>
		</div>
		{#if error}
			<div class="text-error">{error}</div>
		{/if}
	</div>
{/if}
