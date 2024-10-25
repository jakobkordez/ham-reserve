<script lang="ts">
	import { Band } from '$lib/enums/band.enum';

	let {
		bands = $bindable(),
		availableBands = $bindable()
	}: { bands: Set<Band>; availableBands: Set<Band> } = $props();
</script>

<div class="form-control">
	<div class="label">
		<span class="label-text font-bold">Frekvenčna področja</span>
	</div>
	<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
		{#each Array.from(availableBands) as band}
			{@const checked = bands.has(band)}
			<input
				tabIndex={-1}
				type="checkbox"
				id={band}
				name={band}
				value={band}
				{checked}
				onchange={() => {
					if (!checked) bands = new Set(bands).add(band);
					else {
						const ns = new Set(bands);
						ns.delete(band);
						bands = ns;
					}
				}}
				aria-label={band}
				class="btn btn-sm"
			/>
		{/each}

		<select
			class="select select-sm bg-base-200 text-center font-semibold uppercase md:px-3"
			value=""
			onchange={(e) => {
				const val = e.currentTarget.value;
				if (!val) return;
				bands = new Set(bands).add(val as Band);
				availableBands = new Set(availableBands).add(val as Band);
				e.currentTarget.value = '';
			}}
		>
			<option value="">Ostala</option>
			{#each Object.values(Band) as band}
				<option value={band}>{band}</option>
			{/each}
		</select>
	</div>
</div>
