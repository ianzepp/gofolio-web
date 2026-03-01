<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import Value from '$lib/components/app/Value.svelte';
	import { TrendingUp, TrendingDown, Minus } from '@lucide/svelte';
	import type { BenchmarkTrend, MarketCondition } from '$lib/types/api';

	let { data }: { data: PageData } = $props();

	function trendIcon(trend: BenchmarkTrend) {
		if (trend === 'UP') return TrendingUp;
		if (trend === 'DOWN') return TrendingDown;
		return Minus;
	}

	function trendColor(trend: BenchmarkTrend) {
		if (trend === 'UP') return 'text-green-600 dark:text-green-400';
		if (trend === 'DOWN') return 'text-red-600 dark:text-red-400';
		return 'text-muted-foreground';
	}

	function conditionVariant(
		condition: MarketCondition
	): 'default' | 'secondary' | 'destructive' | 'outline' {
		if (condition === 'ALL_TIME_HIGH') return 'default';
		if (condition === 'BEAR_MARKET') return 'destructive';
		return 'outline';
	}

	function conditionLabel(condition: MarketCondition) {
		if (condition === 'ALL_TIME_HIGH') return 'ATH';
		if (condition === 'BEAR_MARKET') return 'Bear';
		return 'Neutral';
	}
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head class="text-center">Condition</Table.Head>
			<Table.Head class="text-center">50d</Table.Head>
			<Table.Head class="text-center">200d</Table.Head>
			<Table.Head class="text-right">From ATH</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.watchlist as item (item.symbol)}
			{@const Icon50 = trendIcon(item.trend50d)}
			{@const Icon200 = trendIcon(item.trend200d)}
			<Table.Row>
				<Table.Cell class="font-medium">{item.name}</Table.Cell>
				<Table.Cell class="text-center">
					<Badge variant={conditionVariant(item.marketCondition)}>
						{conditionLabel(item.marketCondition)}
					</Badge>
				</Table.Cell>
				<Table.Cell class="text-center">
					<Icon50 class="mx-auto h-4 w-4 {trendColor(item.trend50d)}" />
				</Table.Cell>
				<Table.Cell class="text-center">
					<Icon200 class="mx-auto h-4 w-4 {trendColor(item.trend200d)}" />
				</Table.Cell>
				<Table.Cell class="text-right">
					<Value
						value={item.performances.allTimeHigh.performancePercent}
						type="percent"
						colorized
					/>
				</Table.Cell>
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={5} class="text-muted-foreground py-8 text-center">
					No watchlist items. Add symbols to your watchlist to track them here.
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
