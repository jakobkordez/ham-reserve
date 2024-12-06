<script lang="ts">
	import { createTimeState } from '$lib/stores/time-state.svelte';

	const state = createTimeState();
	const time = $derived(state.time);

	function p2(n: number) {
		return n.toString().padStart(2, '0');
	}
</script>

<div class="flex flex-col text-center">
	<div class="text-sm">
		{time.getUTCDate()}. {time.getUTCMonth() + 1}. {time.getUTCFullYear()}
	</div>
	<div class="font-mono">
		{p2(time.getUTCHours())}:{p2(time.getUTCMinutes())}:{p2(time.getUTCSeconds())}
	</div>
</div>
