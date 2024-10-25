<script lang="ts">
	import { Mode } from '$lib/enums/mode.enum';

	let {
		modes = $bindable(),
		availableModes = $bindable()
	}: { modes: Set<Mode>; availableModes: Set<Mode> } = $props();
</script>

<div class="form-control">
	<div class="label">
		<span class="label-text font-bold">Načini</span>
	</div>
	<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
		{#each Array.from(availableModes) as mode}
			{@const checked = modes.has(mode)}
			<input
				tabIndex={-1}
				type="checkbox"
				id={mode}
				name={mode}
				value={mode}
				{checked}
				onchange={() => {
					if (!checked) modes = new Set(modes).add(mode);
					else {
						const ns = new Set(modes);
						ns.delete(mode);
						modes = ns;
					}
				}}
				aria-label={mode}
				class="btn btn-sm"
			/>
		{/each}

		<select
			class="select select-sm bg-base-200 text-center font-semibold uppercase md:px-3"
			value=""
			onchange={(e) => {
				const val = e.currentTarget.value;
				if (!val) return;
				modes = new Set(modes).add(val as Mode);
				availableModes = new Set(availableModes).add(val as Mode);
				e.currentTarget.value = '';
			}}
		>
			<option value="">Ostali</option>
			{#each Object.values(Mode) as mode}
				<option value={mode}>{mode}</option>
			{/each}
		</select>
	</div>
</div>
