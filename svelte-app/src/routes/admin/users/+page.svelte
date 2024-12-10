<script lang="ts">
	import { faAdd, faTrash, faCrown, faKey } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Loading from '$lib/components/loading.svelte';
	import { Role } from '$lib/enums/role.enum';
	import type { User } from '$lib/interfaces/user.interface';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';
	import DeleteModal from './delete-modal.svelte';
	import ResetPasswordModal from './reset-password-modal.svelte';
	import { apiFunctions } from '$lib/api';

	const auth = getAuthContext();

	let deleteUser = $state<User>();
	let resetPassUser = $state<User>();

	let me = $derived(auth.user);

	const usersP = auth.getAccessToken().then((token) => {
		if (!token) return [];
		return apiFunctions.getAllUsers(token);
	});
</script>

<div>
	<div class="mb-4 flex items-center">
		<h2 class="flex-1 text-2xl font-medium">Users</h2>

		<a href="/admin/users/create" class="btn btn-primary btn-sm">
			<Fa icon={faAdd} />
			<span>Add</span>
		</a>
	</div>

	{#await usersP}
		<Loading />
	{:then users}
		<div class="overflow-x-auto">
			<table class="table">
				<colgroup>
					<col class="w-1/2" />
					<col class="w-1/2" />
					<col />
					<col />
					<col />
				</colgroup>
				<tbody>
					{#each users as user}
						<tr>
							<td class="my-auto flex-1">
								<div class="text-lg">
									<span class="font-callsign">{user.username}</span> -{' '}
									{user.name}
								</div>
								{' '}
								<div class="text-xs opacity-70">{user._id}</div>
							</td>
							<td class="my-auto flex-1">
								<div class="text-sm opacity-80">Email: {user.email}</div>
								<div class="text-sm opacity-80">Phone: {user.phone}</div>
							</td>
							<td>
								{#if user.roles.includes(Role.Admin)}
									<Fa icon={faCrown} class="text-amber-500" />
								{/if}
							</td>
							<td>
								<button
									class="btn btn-sm btn-circle btn-ghost {user.passwordResetRequired
										? 'border-b border-red-400'
										: ''}"
									onclick={() => (resetPassUser = user)}
								>
									<Fa icon={faKey} />
								</button>
							</td>
							<td>
								<button
									class="btn btn-circle btn-error btn-sm btn-outline border-0 {user._id === me?._id
										? 'invisible'
										: ''}"
									onclick={() => (deleteUser = user)}
								>
									<Fa icon={faTrash} class="leading-none" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<ResetPasswordModal user={resetPassUser} />
		<DeleteModal {deleteUser} />
	{/await}
</div>
