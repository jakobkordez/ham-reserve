<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiFunctions } from '$lib/api';
	import { uppercaseInput } from '$lib/input-helpers';
	import { getAccessToken } from '$lib/stores/auth-store';
	import { faShuffle, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let username = $state('');
	let password = $state(generateRandom(8));
	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let error = $state<string>();

	function submit() {
		error = undefined;
		getAccessToken().then((token) => {
			if (!token) return;
			apiFunctions
				.createUser(token, {
					username: username.toUpperCase(),
					password,
					name,
					email: email || undefined,
					phone: phone || undefined
				})
				.then(() => {
					goto('/admin/users');
				})
				.catch((err) => {
					console.error(err);
					const msg = err.response.data.message;
					if (msg instanceof Array) error = msg.join(', ');
					else error = msg;
				});
		});
	}

	function generateRandom(length: number) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
	}
</script>

<div class="max-w-xl mx-auto w-full">
	<h2 class="mb-4 text-2xl font-medium">Ustvari uporabnika</h2>

	<div class="flex flex-col gap-4">
		<label class="form-control">
			<div class="label">
				<span class="label-text">Uporabniško ime (klicni znak)</span>
			</div>
			<input
				type="text"
				id="username"
				class="font-callsign input input-bordered"
				placeholder="S50HQ"
				use:uppercaseInput
				bind:value={username}
			/>
		</label>
		<label class="form-control">
			<div class="label">
				<span class="label-text">Geslo</span>
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					id="password"
					class="input input-bordered flex-1"
					bind:value={password}
				/>
				<button class="btn btn-primary" onclick={() => (password = generateRandom(8))}>
					<Fa icon={faShuffle} />
					<span>Naključno</span>
				</button>
			</div>
		</label>
		<label class="form-control">
			<div class="label">
				<span class="label-text">Ime</span>
			</div>
			<input
				type="text"
				id="name"
				class="input input-bordered"
				placeholder="Ime in priimek"
				bind:value={name}
			/>
		</label>
		<label class="form-control">
			<div class="label">
				<span class="label-text">Email</span>
			</div>
			<input
				type="email"
				id="email"
				class="input input-bordered"
				placeholder="s50hq@hamradio.si"
				bind:value={email}
			/>
		</label>
		<label class="form-control">
			<div class="label">
				<span class="label-text">Telefon</span>
			</div>
			<input
				type="tel"
				id="phone"
				class="input input-bordered"
				placeholder="+386 40 555 555"
				bind:value={phone}
			/>
		</label>

		{#if error}
			<div class="alert alert-error">
				<Fa icon={faTriangleExclamation} />
				<span>{error[0].toUpperCase() + error.slice(1)}</span>
			</div>
		{/if}

		<button class="btn btn-primary" onclick={submit}> Ustvari </button>
	</div>
</div>
