<script lang="ts">
	import type { PageData } from './$types';
	import type { LayoutData } from '../../$types';
	import PortfolioSummaryView from '$lib/components/app/PortfolioSummaryView.svelte';
	import * as Card from '$lib/components/ui/card';

	let { data }: { data: PageData & { parent: LayoutData } } = $props();

	let parentData = $derived(data as PageData & LayoutData);
	let baseCurrency = $derived(parentData.info?.baseCurrency ?? 'USD');
</script>

<div class="space-y-4">
	<h1 class="hidden text-center text-2xl font-semibold sm:block">Summary</h1>
	<div class="mx-auto w-full max-w-4xl">
		<Card.Root>
			<Card.Content class="p-4 md:p-6">
				{#if data.summary}
					<PortfolioSummaryView summary={data.summary} {baseCurrency} />
				{:else}
					<p class="text-muted-foreground py-8 text-center">No portfolio data available.</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
