<script lang="ts">
	import { createTimeState } from '$lib/stores/time-state.svelte';

	const { time }: { time: Date } = $props();

	const now = createTimeState();

	const [h, m, s] = $derived.by(() => {
		let diff = (time.valueOf() - now.time.valueOf()) / 1000;
		const s = Math.floor(diff) % 60;
		diff /= 60;
		const m = Math.floor(diff) % 60;
		diff /= 60;
		const h = Math.floor(diff);
		return [h, m, s];
	});
</script>

{h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
