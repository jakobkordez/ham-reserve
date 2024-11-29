<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Role } from '$lib/enums/role.enum';
	import { userStore } from '$lib/stores/user-store';

	const pathname = $derived($page.url.pathname);

	const subPages = [
		{
			name: 'Dogodki',
			href: '/admin/events'
		},
		{
			name: 'Uporabniki',
			href: '/admin/users'
		}
	];

	$effect(() => {
		if ($userStore === undefined) return;
		if (!$userStore?.roles.includes(Role.Admin)) goto('/');
	});

	let { children } = $props();
</script>

<div class="container flex flex-col gap-8 py-10">
	<h1 class="text-4xl font-medium">Admin Page</h1>

	<div class="tabs tabs-bordered">
		{#each subPages as { name, href }}
			<a {href} class="tab tab-lg {pathname.startsWith(href) ? 'tab-active' : ''}">
				{name}
			</a>
		{/each}
	</div>

	{@render children()}
</div>
