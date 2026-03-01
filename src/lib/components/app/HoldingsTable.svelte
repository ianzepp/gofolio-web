<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import Value from './Value.svelte';
	import type { PortfolioPosition } from '$lib/types/api';
	import { ArrowUp, ArrowDown } from '@lucide/svelte';

	interface Props {
		holdings: PortfolioPosition[];
		baseCurrency: string;
	}

	let { holdings, baseCurrency }: Props = $props();

	type SortKey =
		| 'name'
		| 'assetClass'
		| 'currency'
		| 'marketPrice'
		| 'performance'
		| 'allocation'
		| 'value';
	let sortKey = $state<SortKey>('name');
	let sortAsc = $state(true);

	function toggleSort(key: SortKey) {
		if (sortKey === key) {
			sortAsc = !sortAsc;
		} else {
			sortKey = key;
			sortAsc = true;
		}
	}

	function getSortValue(h: PortfolioPosition, key: SortKey): number | string {
		switch (key) {
			case 'name':
				return h.name.toLowerCase();
			case 'assetClass':
				return (h.assetClass ?? '').toLowerCase();
			case 'currency':
				return h.currency;
			case 'marketPrice':
				return h.marketPrice;
			case 'performance':
				return h.netPerformancePercentWithCurrencyEffect;
			case 'allocation':
				return h.allocationInPercentage;
			case 'value':
				return h.valueInBaseCurrency ?? 0;
		}
	}

	let sorted = $derived.by(() => {
		const arr = [...holdings];
		arr.sort((a, b) => {
			const va = getSortValue(a, sortKey);
			const vb = getSortValue(b, sortKey);
			const cmp = va < vb ? -1 : va > vb ? 1 : 0;
			return sortAsc ? cmp : -cmp;
		});
		return arr;
	});
</script>

{#snippet sortHeader(label: string, key: SortKey)}
	<button class="inline-flex items-center gap-1 hover:underline" onclick={() => toggleSort(key)}>
		{label}
		{#if sortKey === key}
			{#if sortAsc}
				<ArrowUp class="h-3 w-3" />
			{:else}
				<ArrowDown class="h-3 w-3" />
			{/if}
		{/if}
	</button>
{/snippet}

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>{@render sortHeader('Name', 'name')}</Table.Head>
			<Table.Head class="hidden md:table-cell"
				>{@render sortHeader('Asset Class', 'assetClass')}</Table.Head
			>
			<Table.Head class="hidden sm:table-cell"
				>{@render sortHeader('Currency', 'currency')}</Table.Head
			>
			<Table.Head class="text-right">{@render sortHeader('Price', 'marketPrice')}</Table.Head>
			<Table.Head class="text-right">{@render sortHeader('Perf. %', 'performance')}</Table.Head>
			<Table.Head class="hidden text-right sm:table-cell"
				>{@render sortHeader('Alloc. %', 'allocation')}</Table.Head
			>
			<Table.Head class="text-right">{@render sortHeader('Value', 'value')}</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each sorted as holding (holding.symbol)}
			<Table.Row class="hover:bg-muted/50 cursor-pointer">
				<Table.Cell class="font-medium">{holding.name}</Table.Cell>
				<Table.Cell class="hidden md:table-cell">
					{#if holding.assetClass}
						<Badge variant="outline">{holding.assetClass}</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">{holding.currency}</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={holding.marketPrice} currency={holding.currency} />
				</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={holding.netPerformancePercentWithCurrencyEffect} type="percent" colorized />
				</Table.Cell>
				<Table.Cell class="hidden text-right sm:table-cell">
					<Value value={holding.allocationInPercentage} type="percent" />
				</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={holding.valueInBaseCurrency} currency={baseCurrency} />
				</Table.Cell>
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={7} class="text-muted-foreground py-8 text-center">
					No holdings found.
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
