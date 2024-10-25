<script lang="ts">
	import { getUTCString } from '$lib/util/date.util';

	let time = $state(new Date());

	$effect(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

{getUTCString(time)}
