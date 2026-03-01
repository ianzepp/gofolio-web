<script lang="ts">
	import type { PageData } from './$types';
	import type { LayoutData } from '../../$types';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import PortfolioPerformance from '$lib/components/app/PortfolioPerformance.svelte';

	let { data }: { data: PageData & { parent: LayoutData } } = $props();

	let parentData = $derived(data as PageData & LayoutData);
	let baseCurrency = $derived(parentData.info?.baseCurrency ?? 'USD');

	let chartLabels = $derived((data.chart ?? []).map((d) => d.date));
	let chartData = $derived(
		(data.chart ?? []).map((d) => d.netPerformanceInPercentageWithCurrencyEffect ?? null)
	);
</script>

{#if data.performance}
	<div class="space-y-3">
		{#if chartLabels.length > 0}
			<div class="mx-auto w-full max-w-[50rem]">
				<LineChart labels={chartLabels} data={chartData} yLabel="%" />
			</div>
		{/if}
		<div class="px-1 pb-2">
			<PortfolioPerformance performance={data.performance} {baseCurrency} />
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-[50rem] py-8">
		<h2 class="text-center text-2xl font-semibold">Welcome to Gofolio</h2>
		<p class="text-muted-foreground mt-2 text-center">
			Ready to take control of your personal finances?
		</p>
		<ol class="mt-6 space-y-3 font-semibold">
			<li>
				<a class="block rounded-md p-2 hover:bg-accent/40" href="/accounts">
					<span>Set up your accounts</span><br />
					<span class="text-muted-foreground font-normal">
						Add your bank and brokerage accounts for a complete overview.
					</span>
				</a>
			</li>
			<li>
				<a class="block rounded-md p-2 hover:bg-accent/40" href="/home/holdings">
					<span>Capture your activities</span><br />
					<span class="text-muted-foreground font-normal">
						Record investment activity to keep portfolio data current.
					</span>
				</a>
			</li>
			<li>
				<a class="block rounded-md p-2 hover:bg-accent/40" href="/home/summary">
					<span>Monitor and analyze your portfolio</span><br />
					<span class="text-muted-foreground font-normal">
						Track performance and review your allocation.
					</span>
				</a>
			</li>
		</ol>
		<div class="mt-6 flex justify-center">
			<a
				href="/accounts"
				class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium shadow-sm"
			>
				Set up accounts
			</a>
		</div>
	</div>
{/if}
