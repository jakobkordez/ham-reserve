<script>
	import { Role } from '$lib/enums/role.enum';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';
	import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Clock from './clock.svelte';

	let userDropOpen = $state(false);

	const auth = getAuthContext();
</script>

<div
	class="flex h-16 select-none px-4 justify-between bg-neutral text-neutral-content items-center"
>
	<a href="/" class="my-auto flex-1 text-xl font-semibold">Ham Reserve</a>

	<Clock />

	<div class="flex flex-1 justify-end items-center">
		<!-- <ThemeToggle /> -->

		<!-- User -->
		{#if auth.user}
			<div class="relative">
				<button class="btn btn-ghost" onclick={() => (userDropOpen = !userDropOpen)}>
					<Fa icon={faUserCircle} class="h-5 w-5" />
					<span>{auth.user.username}</span>
				</button>

				<div class="absolute right-2 top-full z-[1] pt-1 {userDropOpen ? '' : 'hidden'}">
					<button
						class="fixed inset-0 cursor-default"
						tabindex="-1"
						aria-label="Dismiss"
						onclick={() => (userDropOpen = false)}
					></button>
					<ul
						class="menu flex w-60 flex-col gap-1 rounded-xl bg-base-100 p-2 text-base-content shadow-md"
					>
						<li>
							<a href="/profile" onclick={() => (userDropOpen = false)}>Profil</a>
						</li>
						{#if auth.user.roles.includes(Role.Admin)}
							<li>
								<a href="/admin" class="btn-warning" onclick={() => (userDropOpen = false)}>
									Admin panel
								</a>
							</li>
						{/if}
						<li>
							<button
								onclick={() => {
									auth.logout();
									userDropOpen = false;
								}}
							>
								Odjava
							</button>
						</li>
					</ul>
				</div>
			</div>
		{:else}
			<a href="/login" class="btn btn-sm btn-ghost">Prijava</a>
		{/if}
	</div>
</div>
