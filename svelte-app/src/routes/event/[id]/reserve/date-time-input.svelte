<script lang="ts">
	import { getUTCString } from '$lib/util/date.util';

	let { label, value = $bindable() }: { label: string; value: Date } = $props();

	function padZero(num: number) {
		return num.toString().padStart(2, '0');
	}

	function toISO(date: Date) {
		const v = date.toISOString().split('T')[0];
		if (v.startsWith('+')) return v.slice(1);
		return v;
	}
</script>

<div class="form-control rounded-lg border border-gray-200 px-5 py-3">
	<div class="label">
		<span class="label-text font-bold">{label} (UTC)</span>
	</div>
	<div class="flex gap-2">
		<label class="form-control flex-1">
			<div class="label">
				<span class="label-text">Datum</span>
			</div>
			<input
				type="date"
				class="input input-bordered"
				value={toISO(value)}
				onchange={(e) => {
					const val = e.currentTarget.valueAsDate;
					if (!val) return;
					value = val;
				}}
			/>
		</label>
		<label class="form-control w-1/3">
			<div class="label">
				<span class="label-text">Ura</span>
			</div>
			<input
				type="number"
				class="input input-bordered"
				min={0}
				max={23}
				value={padZero(value.getUTCHours())}
				onchange={(e) => {
					if (!e.currentTarget.value) return;
					const date = new Date(value);
					let nv = parseInt(e.currentTarget.value);
					if (nv > 23) nv %= 100;
					if (nv > 23) nv %= 10;
					date.setUTCHours(nv);
					value = date;
				}}
			/>
		</label>
	</div>
	<div class="mt-2 text-center">{getUTCString(value)}</div>
</div>
