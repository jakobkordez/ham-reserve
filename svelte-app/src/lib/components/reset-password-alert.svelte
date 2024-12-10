<script lang="ts">
	import { Fa } from 'svelte-fa';
	import { faWarning } from '@fortawesome/free-solid-svg-icons';
	import { getAuthContext } from '$lib/stores/auth-state.svelte';

	const { class: className = '' }: { class?: string } = $props();

	const auth = getAuthContext();
</script>

{#if auth.user?.passwordResetRequired === true}
	<div class="alert alert-warning {className}">
		<Fa icon={faWarning} class="shrink-0 h-6 w-6" />
		<span>Opozorilo: Prosim, zamenjaj geslo!</span>
		<a href="/profile/edit" class="btn btn-sm btn-outline">Zamenjaj zdaj</a>
	</div>
{/if}
