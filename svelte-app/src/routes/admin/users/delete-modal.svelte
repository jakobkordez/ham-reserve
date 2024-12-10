<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { apiFunctions } from '$lib/api';
	import type { User } from '$lib/interfaces/user.interface';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';

	let { deleteUser = $bindable() }: { deleteUser: User | undefined } = $props();

	const auth = getAuthContext();
</script>

<dialog class="modal {deleteUser ? 'modal-open' : ''}">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Izbriši uporabnika</h3>
		<p class="py-4">
			Ali si prepričan, da želiš izbrisati uporabnika "<strong>{deleteUser?.username}</strong>"?
		</p>
		<div class="modal-action">
			<button
				type="button"
				class="btn btn-error"
				onclick={async () => {
					deleteUser = undefined;
					const token = await auth.getAccessToken();
					if (!token) return;
					apiFunctions
						.deleteUser(token, deleteUser!._id)
						.then(() => {
							invalidateAll();
						})
						.catch((error) => {
							console.error(error);
						});
				}}
			>
				Izbriši
			</button>
			<form method="dialog">
				<button
					type="button"
					class="btn"
					onclick={() => {
						deleteUser = undefined;
					}}
				>
					Prekliči
				</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (deleteUser = undefined)}>close</button>
	</form>
</dialog>
