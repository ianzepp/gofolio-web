<script lang="ts">
	import Value from './Value.svelte';
	import type { PortfolioPerformance as PerfData } from '$lib/types/api';

	interface Props {
		performance: PerfData;
		baseCurrency: string;
		errors?: Array<{ dataSource: string; symbol: string }>;
	}

	let { performance, baseCurrency, errors = [] }: Props = $props();
</script>

<div class="space-y-1 text-center">
	<p class="text-4xl font-bold leading-tight md:text-5xl">
		<Value value={performance.currentValueInBaseCurrency} currency={baseCurrency} />
	</p>
	<div class="mx-auto flex max-w-md items-center justify-center gap-5 text-sm md:text-base">
		<Value value={performance.netPerformanceWithCurrencyEffect} currency={baseCurrency} colorized />
		<Value value={performance.netPerformancePercentageWithCurrencyEffect} type="percent" colorized />
	</div>
	{#if errors.length > 0}
		<div class="bg-muted/40 mx-auto mt-3 max-w-xl rounded-md border px-3 py-2 text-left text-xs">
			<p class="font-semibold">Some market data could not be refreshed:</p>
			<p class="text-muted-foreground mt-1">
				{errors.map((error) => `${error.dataSource}:${error.symbol}`).join(', ')}
			</p>
		</div>
	{/if}
</div>
