<script lang="ts">
	import type { PageData } from './$types';
	import type { LayoutData } from '../$types';
	import AccountsTable from '$lib/components/app/AccountsTable.svelte';

	let { data }: { data: PageData & { parent: LayoutData } } = $props();

	let parentData = $derived(data as PageData & LayoutData);
	let baseCurrency = $derived(parentData.info?.baseCurrency ?? 'USD');
</script>

<div class="space-y-4">
	<h1 class="text-2xl font-bold">Accounts</h1>
	<AccountsTable
		accounts={data.accounts}
		{baseCurrency}
		totalValue={data.totalValue}
		totalBalance={data.totalBalance}
	/>
</div>
