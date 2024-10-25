<script lang="ts">
	import type { LogSummary } from '$lib/interfaces/log-summary.interface';
	import { getUTCString } from '$lib/util/date.util';

	const { logSummary }: { logSummary: LogSummary } = $props();
</script>

<div class="rounded-lg bg-base-200 p-5 pr-2">
	<div class="max-h-72 overflow-y-auto pr-2">
		<div class="mb-3 text-xl font-medium">Poročilo oddanega dnevnika</div>

		<table class="table table-sm">
			<tbody>
				<tr>
					<td>Število zvez</td>
					<td>{logSummary.qso_count}</td>
				</tr>
				<tr>
					<td>Frekvenčni pasovi</td>
					<td>{logSummary.bands.join(', ').toLocaleLowerCase()}</td>
				</tr>
				<tr>
					<td>Načini dela</td>
					<td>{logSummary.modes.join(', ')}</td>
				</tr>
				<tr>
					<td>Čas dela</td>
					<td>
						{getUTCString(logSummary.first_qso_time)} &rarr;{' '}
						{getUTCString(logSummary.last_qso_time)}
					</td>
				</tr>
			</tbody>
		</table>

		<div class="text-orange-500 dark:text-warning">
			{#if (logSummary.warnings?.length ?? 0) > 0}
				<div class="mt-3">Opozorila:</div>
			{/if}
			{#each logSummary.warnings ?? [] as warning}
				<div>{warning}</div>
			{/each}
		</div>
	</div>
</div>
