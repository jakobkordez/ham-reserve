<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import { getAccessToken } from '$lib/stores/auth-store';
	import { refreshUser, userStore } from '$lib/stores/user-store';
	import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	const user = $derived($userStore);

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let saved = $state(false);
	let error = $state<string>();

	let oldPassword = $state('');
	let newPassword = $state('');
	let newPasswordRepeat = $state('');
	let passChanged = $state(false);
	let passChangeError = $state<string>();

	async function save() {
		error = undefined;
		saved = false;

		if (name === user?.name && email === user?.email && phone === user?.phone) {
			saved = true;
			return;
		}

		const token = await getAccessToken();
		if (!token) return;
		apiFunctions
			.updateSelf(token, {
				name: name !== (user?.name ?? '') ? name : undefined,
				email: email !== (user?.email ?? '') ? email : undefined,
				phone: phone !== (user?.phone ?? '') ? phone : undefined
			})
			.then(() => {
				saved = true;
				refreshUser();
			})
			.catch((e) => {
				console.error(e);
				error = e.response?.data?.message;
			});
	}

	async function changePassword() {
		passChangeError = undefined;
		passChanged = false;

		if (newPassword !== newPasswordRepeat) {
			passChangeError = 'Ponovitev novega gesla se ne ujema';
			return;
		}

		const token = await getAccessToken();
		if (!token) return;
		apiFunctions
			.updateSelfPassword(token, oldPassword, newPassword)
			.then(() => (passChanged = true))
			.catch((e) => {
				console.error(e);
				passChangeError = e.response?.data?.message;
			});
	}

	$effect(() => {
		if (!user) return;
		name = user.name;
		email = user.email;
		phone = user.phone;
	});
</script>

<div
	class="container flex flex-col items-center justify-center gap-10 py-10 lg:flex-row lg:items-start"
>
	<div class="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-base-200 p-10">
		<h1 class="text-4xl font-bold">Uredi profil</h1>

		<div>
			<label class="form-control">
				<div class="label">
					<span class="label-text">Uporabniško ime</span>
				</div>
				<input
					type="text"
					value={user?.username ?? ''}
					disabled
					class="input input-bordered disabled:bg-base-300"
				/>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">Ime in priimek</span>
				</div>
				<input
					type="text"
					class="input input-bordered {name !== (user?.name ?? '') && 'input-info'}"
					bind:value={name}
				/>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">E-pošta</span>
					<span class="label-text-alt">Neobvezno</span>
				</div>
				<input
					type="email"
					class="input input-bordered {email !== (user?.email ?? '') && 'input-info'}"
					bind:value={email}
				/>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">Telefonska številka</span>
					<span class="label-text-alt">Neobvezno</span>
				</div>
				<input
					type="tel"
					class="input input-bordered {phone !== (user?.phone ?? '') && 'input-info'}"
					bind:value={phone}
				/>
			</label>
		</div>

		{#if error}
			<div class="alert alert-error">
				<Fa icon={faTriangleExclamation} class="shrink-0" />
				<span>{error}</span>
			</div>
		{/if}

		{#if saved}
			<div class="alert alert-success">
				<Fa icon={faCircleCheck} class="shrink-0" />
				<span>Spremembe so bile shranjene</span>
			</div>
		{/if}

		<button class="btn btn-primary" onclick={save}>Shrani</button>
	</div>

	<div class="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-base-200 p-10">
		<h2 class="text-4xl font-bold">Spremeni geslo</h2>

		<div>
			<label class="form-control">
				<div class="label">
					<span class="label-text">Trenutno geslo</span>
				</div>
				<input type="password" class="input input-bordered" bind:value={oldPassword} />
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">Novo geslo</span>
				</div>
				<input type="password" class="input input-bordered" bind:value={newPassword} />
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text">Ponovi geslo</span>
				</div>
				<input type="password" class="input input-bordered" bind:value={newPasswordRepeat} />
			</label>
		</div>

		{#if passChangeError}
			<div class="alert alert-error">
				<Fa icon={faTriangleExclamation} class="shrink-0" />
				<span>{passChangeError}</span>
			</div>
		{/if}

		{#if passChanged}
			<div class="alert alert-success">
				<Fa icon={faCircleCheck} class="shrink-0" />
				<span>Geslo uspešno spremenjeno</span>
			</div>
		{/if}

		<button class="btn btn-primary" onclick={changePassword}>Spremeni geslo</button>
	</div>
</div>
