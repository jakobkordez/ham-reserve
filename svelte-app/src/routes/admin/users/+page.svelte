<script lang="ts">
	import { faAdd, faTrash, faCrown } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Loading from '$lib/components/loading.svelte';
	import { apiFunctions } from '$lib/api';
	import { Role } from '$lib/enums/role.enum';
	import type { User } from '$lib/interfaces/user.interface';
	import { invalidateAll } from '$app/navigation';
	import { getAccessToken } from '$lib/stores/auth-store';
	import type { PageData } from './$types';
	import { userStore } from '$lib/stores/user-store';

	const { data }: { data: PageData } = $props();

	let deleteUser = $state<User>();

	let me = $derived($userStore);
</script>

<div>
	<div class="mb-4 flex items-center">
		<h2 class="flex-1 text-2xl font-medium">Users</h2>

		<a href="/admin/users/create" class="btn btn-primary btn-sm">
			<Fa icon={faAdd} />
			<span>Add</span>
		</a>
	</div>

	{#await data.users}
		<Loading />
	{:then users}
		<div class="overflow-x-auto">
			<table class="table">
				<colgroup>
					<col class="w-1/2" />
					<col class="w-1/2" />
					<col />
					<col />
				</colgroup>
				<tbody>
					{#each users as user}
						<tr>
							<td class="my-auto flex-1">
								<div class="text-xl">
									<span class="font-callsign">{user.username}</span> -{' '}
									{user.name}
								</div>
								{' '}
								<div class="text-xs opacity-80">{user._id}</div>
							</td>
							<td class="my-auto flex-1">
								<div class="text-sm opacity-80">Email: {user.email}</div>
								<div class="text-sm opacity-80">Phone: {user.phone}</div>
							</td>
							<td>
								<!-- {/* <button
                    class={`btn btn-circle btn-warning btn-outline h-14 w-14 border-0 ${
                      user.roles.includes(Role.Admin)
                        ? '!text-warning'
                        : '!text-gray-500'
                    }`}
                    disabled={user._id === me?._id}
                  > */} -->
								<Fa
									icon={faCrown}
									class={`h-5 w-5 leading-none ${
										user.roles.includes(Role.Admin) ? 'text-amber-500' : 'text-gray-400'
									}`}
								/>
								<!-- {/* </button> */} -->
							</td>
							<td>
								<button
									class={`btn btn-circle btn-error btn-sm btn-outline h-14 w-14 border-0 ${
										user._id === me?._id ? 'invisible' : ''
									}`}
									onclick={() => {
										deleteUser = user;
									}}
								>
									<Fa icon={faTrash} class="leading-none" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<dialog class={`modal ${deleteUser ? 'modal-open' : ''}`}>
			<div class="modal-box">
				<h3 class="text-lg font-bold">Izbriši uporabnika</h3>
				<p class="py-4">
					Ali si prepričan, da želiš izbrisati uporabnika &quot;<strong
						>{deleteUser?.username}</strong
					>&quot;?
				</p>
				<div class="modal-action">
					<button
						type="button"
						class="btn btn-error"
						onclick={async () => {
							const token = await getAccessToken();
							if (!token) return;
							apiFunctions
								.deleteUser(token, deleteUser!._id)
								.then(() => {
									invalidateAll();
									deleteUser = undefined;
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
	{/await}
</div>
