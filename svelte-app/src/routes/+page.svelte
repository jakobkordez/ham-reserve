<script lang="ts">
	import CurrentEvents from '$lib/components/current-events.svelte';
	import ResetPasswordAlert from '$lib/components/reset-password-alert.svelte';
</script>

<div class="flex flex-col gap-10 container py-10">
	<ResetPasswordAlert class="max-w-xl mx-auto" />

	<CurrentEvents />
</div>
