<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import Value from '$lib/components/app/Value.svelte';

	let { data }: { data: PageData } = $props();

	let perf = $derived(data.performance?.performance ?? null);
	let baseCurrency = $derived(data.user?.settings?.baseCurrency ?? 'USD');
</script>

<div class="space-y-4">
	<h1 class="text-xl font-semibold">Analysis</h1>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<Card.Root>
			<Card.Header><Card.Description>Total Investment</Card.Description></Card.Header>
			<Card.Content>
				<Value value={perf?.totalInvestment ?? 0} currency={baseCurrency} />
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header><Card.Description>Net Performance</Card.Description></Card.Header>
			<Card.Content>
				<Value value={perf?.netPerformanceWithCurrencyEffect ?? 0} currency={baseCurrency} colorized />
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header><Card.Description>Net Performance %</Card.Description></Card.Header>
			<Card.Content>
				<Value
					value={(perf?.netPerformancePercentageWithCurrencyEffect ?? 0) / 100}
					type="percent"
					colorized
				/>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header><Card.Description>Current Value</Card.Description></Card.Header>
			<Card.Content>
				<Value value={perf?.currentValueInBaseCurrency ?? 0} currency={baseCurrency} />
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header><Card.Description>Annualized %</Card.Description></Card.Header>
			<Card.Content>
				<Value value={(perf?.annualizedPerformancePercent ?? 0) / 100} type="percent" colorized />
			</Card.Content>
		</Card.Root>
	</div>
</div>
