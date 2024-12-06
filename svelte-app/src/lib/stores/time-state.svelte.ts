import { onDestroy } from 'svelte';

export function createTimeState(
	updateIntervalMs = 1000,
	startNow = true,
	onTick: ((time: Date) => void) | undefined = undefined
) {
	let time = $state(new Date());
	let interval = $state<ReturnType<typeof setInterval>>();

	function tick() {
		time = new Date();
		onTick?.(time);
	}

	function start() {
		if (interval) return;
		tick();
		interval = setInterval(tick, updateIntervalMs);
	}

	function stop() {
		if (!interval) return;
		clearInterval(interval);
		interval = undefined;
	}

	if (startNow) start();

	onDestroy(() => {
		stop();
	});

	return {
		get time() {
			return time;
		},
		get isStopped() {
			return !interval;
		},
		tick,
		start,
		stop
	};
}
