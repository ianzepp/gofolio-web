<script lang="ts">
	import type { PageData } from './$types';
	import type { LayoutData } from '../../$types';
	import HoldingsTable from '$lib/components/app/HoldingsTable.svelte';

	let { data }: { data: PageData & { parent: LayoutData } } = $props();

	let parentData = $derived(data as PageData & LayoutData);
	let baseCurrency = $derived(parentData.info?.baseCurrency ?? 'USD');
</script>

<div class="space-y-4">
	<h1 class="hidden text-center text-2xl font-semibold sm:block">Holdings</h1>
	<div class="mx-auto w-full max-w-6xl">
		<HoldingsTable holdings={data.holdings} {baseCurrency} />
	</div>
</div>
