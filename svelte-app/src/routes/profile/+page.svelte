<script lang="ts">
	import { apiFunctions } from '$lib/api';
	import Loading from '$lib/components/loading.svelte';
	import ReservationsTable from '$lib/components/reservations-table.svelte';
	import ResetPasswordAlert from '$lib/components/reset-password-alert.svelte';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';

	const auth = getAuthContext();

	const promise = auth.getAccessToken().then((token) => {
		if (!token) throw Error('Unauthenticated');
		return Promise.all([
			apiFunctions.getMe(token),
			apiFunctions.getReservationsForSelf(token).then((res) => {
				return res.sort((a, b) => b.startDateTime.valueOf() - a.startDateTime.valueOf());
			})
		]);
	});
</script>

<div class="container flex flex-col gap-8 py-10">
	{#await promise}
		<Loading />
	{:then [user, reservations]}
		<ResetPasswordAlert />

		<div class="flex gap-2">
			<div class="flex flex-1 flex-col gap-2">
				<div class="text-3xl">{user.name}</div>
				<div class="font-callsign text-2xl">{user.username}</div>

				<div>
					<div>E-mail: {user.email ?? '/'}</div>
					<div>Phone: {user.phone ?? '/'}</div>
				</div>
			</div>
			<a href="/profile/edit" class="btn btn-primary btn-sm self-start">Uredi profil</a>
		</div>

		<div>
			<div class="mb-3 text-2xl">Moje rezervacije</div>

			<ReservationsTable {reservations} />
		</div>
	{/await}
</div>
