<script lang="ts">
	import type { PageData } from './$types';
	import type { LayoutData } from '../../$types';
	import HoldingsTable from '$lib/components/app/HoldingsTable.svelte';

	let { data }: { data: PageData & { parent: LayoutData } } = $props();

	let parentData = $derived(data as PageData & LayoutData);
	let baseCurrency = $derived(parentData.info?.baseCurrency ?? 'USD');
</script>

<HoldingsTable holdings={data.holdings} {baseCurrency} />
