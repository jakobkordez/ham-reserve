<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Ham Reserve</title>
</svelte:head>

<Header />

{@render children()}
