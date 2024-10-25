<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { apiFunctions } from '$lib/api';
	import { uppercaseInput } from '$lib/input-helpers';
	import { authStore, isAuthValid } from '$lib/stores/auth-store';

	const redirect = $page.url.searchParams.get('redirect');

	$effect(() => {
		isAuthValid().then((r) => {
			if (r) goto(redirect || '/');
		});
	});

	let username = $state('');
	let password = $state('');

	let error = $state<string>();

	function login() {
		error = undefined;

		apiFunctions
			.login(username, password)
			.then((res) => {
				authStore.set(res);
				goto(redirect || '/');
			})
			.catch((e) => {
				console.error(e);
				error = 'Napačno uporabniško ime ali geslo';
			});
	}
</script>

<div class="container py-10 max-w-xl">
	<form
		class="flex flex-col gap-4 rounded-xl bg-base-200 p-10"
		onsubmit={(e) => {
			e.preventDefault();
			login();
		}}
	>
		<h1 class="text-3xl font-semibold">Prijava</h1>

		<div>
			<label class="form-control">
				<div class="label">
					<span class="label-text">Uporabniško ime</span>
				</div>
				<input
					id="username"
					type="username"
					class="input input-bordered"
					use:uppercaseInput
					bind:value={username}
				/>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">Geslo</span>
				</div>
				<input id="password" type="password" class="input input-bordered" bind:value={password} />
			</label>
		</div>

		{#if error}
			<div class="alert alert-error">
				<span>{error}</span>
			</div>
		{/if}

		<button class="btn btn-primary">Prijava</button>
	</form>
</div>
