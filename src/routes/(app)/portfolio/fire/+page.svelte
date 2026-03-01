<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import Value from '$lib/components/app/Value.svelte';

	let { data }: { data: PageData } = $props();
	let baseCurrency = $derived(data.user?.settings?.baseCurrency ?? 'USD');
	let summary = $derived(data.details?.summary ?? null);
	let annualized = $derived((data.performance?.performance?.annualizedPerformancePercent ?? 0) / 100);
	let estimatedFiCapital = $derived.by(() => {
		if (!summary) return 0;
		const annualSpending = Math.abs(summary.totalSell ?? 0);
		return annualSpending > 0 ? annualSpending * 25 : 0;
	});
	let progress = $derived.by(() => {
		if (!summary || estimatedFiCapital <= 0) return 0;
		return Math.min(summary.currentValueInBaseCurrency / estimatedFiCapital, 1);
	});
</script>

<div class="space-y-4">
	<h1 class="text-xl font-semibold">Fire</h1>
	<div class="grid gap-4 md:grid-cols-3">
		<Card.Root>
			<Card.Header><Card.Description>Current Net Worth</Card.Description></Card.Header>
			<Card.Content>
				<Value value={summary?.currentValueInBaseCurrency ?? 0} currency={baseCurrency} />
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header><Card.Description>Estimated FI Capital</Card.Description></Card.Header>
			<Card.Content>
				<Value value={estimatedFiCapital} currency={baseCurrency} />
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header><Card.Description>Annualized Return</Card.Description></Card.Header>
			<Card.Content>
				<Value value={annualized} type="percent" colorized />
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Content class="p-5">
			<p class="text-sm font-medium">FI Progress</p>
			<div class="mt-2 h-2 w-full overflow-hidden rounded bg-muted">
				<div class="bg-primary h-full transition-all" style={`width:${Math.round(progress * 100)}%`}></div>
			</div>
			<p class="text-muted-foreground mt-2 text-xs">{Math.round(progress * 100)}% of target</p>
		</Card.Content>
	</Card.Root>
</div>
