<script lang="ts">
	let { start, end }: { start: Date; end: Date } = $props();

	const progress = Math.max(
		0,
		Math.min(((Date.now() - start.valueOf()) * 100) / (end.valueOf() - start.valueOf()), 100)
	).toFixed(1);
</script>

<progress class="progress progress-primary" value={progress} max={100}></progress>
