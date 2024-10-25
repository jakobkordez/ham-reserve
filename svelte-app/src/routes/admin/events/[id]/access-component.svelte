<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { apiFunctions } from '$lib/api';
	import Loading from '$lib/components/loading.svelte';
	import { uppercaseInput } from '$lib/input-helpers';
	import type { Event } from '$lib/interfaces/event.interface';
	import type { User } from '$lib/interfaces/user.interface';
	import { getAccessToken } from '$lib/stores/auth-store';
	import { faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	const { event }: { event: Event } = $props();

	let users = $state<User[]>();
	let error = $state<string>();

	let usernameInput = $state('');

	$effect(() => {
		getAccessToken().then((token) => {
			if (!token) return;
			apiFunctions
				.getManyUsers(token, event.access)
				.then((r) => (users = r))
				.catch(console.error);
		});
	});

	async function grantAccess() {
		error = undefined;
		try {
			const token = await getAccessToken();
			if (!token) throw Error('Unauthenticated');
			const user = await apiFunctions.findByUsername(token, usernameInput.toUpperCase());
			await apiFunctions.grantEventAccess(token, event._id, user._id);
			invalidateAll();
			usernameInput = '';

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error(err);
			error = err.response.data.message;
		}
	}

	async function revokeAccess(userId: string) {
		try {
			const token = await getAccessToken();
			if (!token) throw Error('Unauthenticated');
			await apiFunctions.revokeEventAccess(token, event._id, userId);
			invalidateAll();
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div class="flex flex-col gap-4">
	<h2 class="text-2xl">Aktivatorji</h2>

	<form
		class="flex items-center gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			grantAccess();
		}}
	>
		<input
			class="font-callsign input input-bordered flex-1 placeholder:font-normal placeholder:normal-case"
			placeholder="Dodaj uporabnika"
			use:uppercaseInput
			bind:value={usernameInput}
		/>
		<button class="btn btn-circle btn-primary">
			<Fa icon={faPlus} />
		</button>
	</form>
	{#if error}
		<div class="alert alert-error px-4 py-2">{error}</div>
	{/if}

	{#if !users}
		<Loading />
	{:else}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
			{#each users as user}
				<div class="flex items-center justify-between gap-2 rounded-full bg-base-200 p-2 pl-5">
					<div class="font-callsign">{user.username}</div>
					<button class="btn btn-circle btn-ghost btn-xs" onclick={() => revokeAccess(user._id)}>
						<Fa icon={faRemove} />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
