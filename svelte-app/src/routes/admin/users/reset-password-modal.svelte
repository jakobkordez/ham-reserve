<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { apiFunctions } from '$lib/api';
	import type { User } from '$lib/interfaces/user.interface';
	import { getAccessToken } from '$lib/stores/auth-store';
	import PasswordField from './password-field.svelte';

	let { user = $bindable() }: { user: User | undefined } = $props();

	let password = $state('');
</script>

<dialog class="modal {user ? 'modal-open' : ''}">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Ponastavi geslo</h3>
		<p class="py-4">
			Ponastavi geslo za uporabnika &quot;<strong>{user?.username}</strong>&quot;
		</p>
		<PasswordField bind:value={password} />
		<div class="modal-action">
			<button
				type="button"
				class="btn btn-primary"
				onclick={async () => {
					const token = await getAccessToken();
					if (!token) return;
					apiFunctions
						.updateOtherPassword(token, user!._id, password)
						.then(() => {
							user = undefined;
							password = '';
							invalidateAll();
						})
						.catch((error) => {
							console.error(error);
						});
				}}
			>
				Potrdi
			</button>
			<form method="dialog">
				<button
					type="button"
					class="btn"
					onclick={() => {
						user = undefined;
					}}
				>
					Prekliči
				</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (user = undefined)}>close</button>
	</form>
</dialog>
