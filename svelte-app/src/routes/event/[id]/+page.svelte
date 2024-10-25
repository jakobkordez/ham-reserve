<script lang="ts">
	import Loading from '$lib/components/loading.svelte';
	import type { PageData } from './$types';
	import EventComponent from './event-component.svelte';

	export let data: PageData;
</script>

<div class="container py-10">
	{#await data.event}
		<Loading />
	{:then event}
		{#if !event}
			<div class="flex flex-col items-center gap-6">
				<h1 class="text-2xl font-medium">404 - Dogodek ne obstaja</h1>
				<a href="/" class="btn btn-primary"> Nazaj na domačo stran </a>
			</div>
		{:else}
			<EventComponent {event} />
		{/if}
	{/await}
</div>
