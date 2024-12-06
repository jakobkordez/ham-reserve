<script lang="ts">
	import { createTimeState } from '$lib/stores/time-state.svelte';

	let { start, end }: { start: Date; end: Date } = $props();

	const time = createTimeState(10_000);

	const progress = $derived.by(() => {
		const v = (time.time.valueOf() - start.valueOf()) / (end.valueOf() - start.valueOf());
		return Math.max(0, Math.min(v * 100, 100)).toFixed(1);
	});
</script>

<progress class="progress progress-primary" value={progress} max={100}></progress>
