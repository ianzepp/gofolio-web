<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import Value from '$lib/components/app/Value.svelte';

	let { data }: { data: PageData } = $props();

	let assetClassRows = $derived.by(() => {
		const buckets: Record<string, { value: number; allocation: number }> = {};
		for (const holding of Object.values(data.details?.holdings ?? {})) {
			const key = holding.assetClass ?? 'Unknown';
			const prev = buckets[key] ?? { value: 0, allocation: 0 };
			buckets[key] = {
				value: prev.value + (holding.valueInBaseCurrency ?? 0),
				allocation: prev.allocation + (holding.valueInPercentage ?? 0)
			};
		}
		return Object.entries(buckets)
			.map(([assetClass, values]) => ({ assetClass, ...values }))
			.sort((a, b) => b.allocation - a.allocation);
	});
</script>

<div class="space-y-4">
	<h1 class="text-xl font-semibold">X-Ray</h1>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Asset Class</Table.Head>
				<Table.Head class="text-right">Value</Table.Head>
				<Table.Head class="text-right">Allocation</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each assetClassRows as row (row.assetClass)}
				<Table.Row class="odd:bg-background even:bg-muted/30">
					<Table.Cell>{row.assetClass}</Table.Cell>
					<Table.Cell class="text-right">
						<Value value={row.value} currency={data.user?.settings?.baseCurrency ?? 'USD'} />
					</Table.Cell>
					<Table.Cell class="text-right"><Value value={row.allocation} type="percent" /></Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={3} class="text-muted-foreground py-8 text-center">
						No holdings available for x-ray analysis.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
