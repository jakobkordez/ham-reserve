<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import { createAuthContext } from '$lib/stores/auth-state.svelte';
	import '../app.css';

	createAuthContext();

	let { children } = $props();
</script>

<svelte:head>
	<title>Ham Reserve</title>
</svelte:head>

<Header />

{@render children()}
