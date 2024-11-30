<script>
	import { Role } from '$lib/enums/role.enum';
	import { logout } from '$lib/stores/auth-store';
	import { userStore } from '$lib/stores/user-store';
	import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let userDropOpen = $state(false);
</script>

<div class="flex h-16 select-none px-4 justify-between bg-neutral text-neutral-content">
	<a href="/" class="my-auto flex-1 text-xl font-semibold">Ham Reserve</a>

	<div class="flex flex-1 justify-end items-center">
		<!-- <ThemeToggle /> -->

		<!-- User -->
		{#if $userStore}
			<div class="relative">
				<button class="btn btn-ghost" onclick={() => (userDropOpen = !userDropOpen)}>
					<Fa icon={faUserCircle} class="h-5 w-5" />
					<span>{$userStore.username}</span>
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
						{#if $userStore.roles.includes(Role.Admin)}
							<li>
								<a href="/admin" class="btn-warning" onclick={() => (userDropOpen = false)}>
									Admin panel
								</a>
							</li>
						{/if}
						<li>
							<button
								onclick={() => {
									logout();
									window.location.reload();
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
