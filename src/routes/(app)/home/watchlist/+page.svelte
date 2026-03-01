<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
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

	function conditionEmoji(condition: MarketCondition) {
		if (condition === 'ALL_TIME_HIGH') return '🚀';
		if (condition === 'BEAR_MARKET') return '🐻';
		return '😐';
	}
</script>

<div class="space-y-4">
	<h1 class="hidden text-center text-2xl font-semibold sm:block">Watchlist</h1>
	<div class="mx-auto w-full max-w-5xl">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-center">50d</Table.Head>
					<Table.Head class="text-center">200d</Table.Head>
					<Table.Head class="text-right">From ATH</Table.Head>
					<Table.Head class="text-center">Market</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<!--
					Intentionally key by symbol for parity with the legacy API behavior.
					Known caveat: same symbol across data sources can collide upstream.
				-->
				{#each data.watchlist as item (item.symbol)}
					{@const Icon50 = trendIcon(item.trend50d)}
					{@const Icon200 = trendIcon(item.trend200d)}
					<Table.Row class="odd:bg-background even:bg-muted/30 hover:bg-muted/60">
						<Table.Cell class="font-medium">
							<div class="leading-tight">
								<div class="text-foreground truncate">{item.name}</div>
								<div class="text-muted-foreground text-xs">{item.symbol}</div>
							</div>
						</Table.Cell>
						<Table.Cell class="text-center">
							{#if item.trend50d !== 'UNKNOWN'}
								<Icon50 class="mx-auto h-4 w-4 {trendColor(item.trend50d)}" />
							{/if}
						</Table.Cell>
						<Table.Cell class="text-center">
							{#if item.trend200d !== 'UNKNOWN'}
								<Icon200 class="mx-auto h-4 w-4 {trendColor(item.trend200d)}" />
							{/if}
						</Table.Cell>
						<Table.Cell class="text-right">
							<Value
								value={item.performances.allTimeHigh.performancePercent}
								type="percent"
								colorized
							/>
						</Table.Cell>
						<Table.Cell class="text-center">{conditionEmoji(item.marketCondition)}</Table.Cell>
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
	</div>
</div>
