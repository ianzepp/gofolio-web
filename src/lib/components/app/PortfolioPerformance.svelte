<script lang="ts">
	import Value from './Value.svelte';
	import type { PortfolioPerformance as PerfData } from '$lib/types/api';

	interface Props {
		performance: PerfData;
		baseCurrency: string;
	}

	let { performance, baseCurrency }: Props = $props();
</script>

<div class="space-y-1 text-center">
	<p class="text-4xl font-bold leading-tight md:text-5xl">
		<Value value={performance.currentValueInBaseCurrency} currency={baseCurrency} />
	</p>
	<div class="mx-auto flex max-w-md items-center justify-center gap-5 text-sm md:text-base">
		<Value value={performance.netPerformanceWithCurrencyEffect} currency={baseCurrency} colorized />
		<Value value={performance.netPerformancePercentageWithCurrencyEffect} type="percent" colorized />
	</div>
</div>
