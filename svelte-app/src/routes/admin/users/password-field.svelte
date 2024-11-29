<script lang="ts">
	import { faShuffle } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { value = $bindable('') }: { value: string } = $props();

	function generateRandom(length: number) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
	}
</script>

<div class="flex gap-2">
	<input type="text" id="password" class="input input-bordered flex-1" bind:value />
	<button class="btn btn-primary" onclick={() => (value = generateRandom(8))}>
		<Fa icon={faShuffle} />
		<span>Naključno</span>
	</button>
</div>
