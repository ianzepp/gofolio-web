<script lang="ts">
	import type { PageData } from './$types';
	import type { LayoutData } from '../../$types';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import PortfolioPerformance from '$lib/components/app/PortfolioPerformance.svelte';

	let { data }: { data: PageData & LayoutData } = $props();

	let baseCurrency = $derived(data.info?.baseCurrency ?? 'USD');
	let userAccountsCount = $derived(data.user.accounts?.length ?? 0);
	let canCreateActivity = $derived(data.user.permissions.includes('createOrder'));
	let showOnboarding = $derived(canCreateActivity && (data.user.activitiesCount ?? 0) === 0);

	let chartLabels = $derived((data.chart ?? []).map((point) => point.date));
	let chartData = $derived(
		(data.chart ?? []).map((point) => point.netPerformanceInPercentageWithCurrencyEffect ?? null)
	);
	let isAnimated = $derived(data.range !== '1d');
</script>

{#if showOnboarding}
	<div class="mx-auto max-w-[50rem] py-8">
		<h2 class="text-center text-2xl font-semibold">Welcome to Gofolio</h2>
		<p class="text-muted-foreground mt-2 text-center">Ready to take control of your personal finances?</p>
		<ol class="mt-6 space-y-3 font-semibold">
			<li class={userAccountsCount > 1 ? 'text-muted-foreground' : ''}>
				<a class="block rounded-md p-2 hover:bg-accent/40" href="/accounts">
					<span>Setup your accounts</span><br />
					<span class="font-normal">
						Get a comprehensive financial overview by adding your bank and brokerage accounts.
					</span>
				</a>
			</li>
			<li>
				<a class="block rounded-md p-2 hover:bg-accent/40" href="/portfolio/activities">
					<span>Capture your activities</span><br />
					<span class="text-muted-foreground font-normal">
						Record your investment activities to keep your portfolio up to date.
					</span>
				</a>
			</li>
			<li>
				<a class="block rounded-md p-2 hover:bg-accent/40" href="/portfolio">
					<span>Monitor and analyze your portfolio</span><br />
					<span class="text-muted-foreground font-normal">
						Track your progress in real-time with comprehensive analysis and insights.
					</span>
				</a>
			</li>
		</ol>
		<div class="mt-6 flex justify-center">
			{#if userAccountsCount <= 1}
				<a
					href="/accounts"
					class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium shadow-sm"
				>
					Setup accounts
				</a>
			{:else}
				<a
					href="/portfolio/activities"
					class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium shadow-sm"
				>
					Add activity
				</a>
			{/if}
		</div>
	</div>
{:else}
	<div class="space-y-3">
		<div class="mx-auto w-full max-w-[50rem]">
			{#if chartLabels.length > 0}
				<LineChart
					labels={chartLabels}
					data={chartData}
					yLabel="%"
					showXAxis={false}
					showYAxis={false}
					animated={isAnimated}
				/>
			{:else}
				<div class="text-muted-foreground rounded-md border py-8 text-center text-sm">
					No performance history available for this range.
				</div>
			{/if}
		</div>
		<div class="px-1 pb-2">
			{#if data.performance}
				<PortfolioPerformance performance={data.performance} {baseCurrency} errors={data.errors ?? []} />
			{:else}
				<div class="space-y-3 py-4">
					<div class="bg-muted/40 h-10 w-56 animate-pulse rounded-md mx-auto"></div>
					<div class="bg-muted/40 h-5 w-72 animate-pulse rounded-md mx-auto"></div>
				</div>
			{/if}
		</div>
	</div>
{/if}
