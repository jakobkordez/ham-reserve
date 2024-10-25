<script lang="ts">
	import { Fa } from 'svelte-fa';
	import { faWarning } from '@fortawesome/free-solid-svg-icons';
	import { userStore } from '$lib/stores/user-store';

	const { class: className }: { class?: string } = $props();
</script>

{#if $userStore?.passwordResetRequired === true}
	<div class={`alert alert-warning ${className}`}>
		<Fa icon={faWarning} class="shrink-0 h-6 w-6" />
		<span>Opozorilo: Prosim, zamenjaj geslo!</span>
		<a href="/profile/edit" class="btn btn-sm btn-outline"> Zamenjaj zdaj </a>
	</div>
{/if}
