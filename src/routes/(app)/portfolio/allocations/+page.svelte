<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import Value from '$lib/components/app/Value.svelte';

	let { data }: { data: PageData } = $props();
	let baseCurrency = $derived(data.user?.settings?.baseCurrency ?? 'USD');

	let accountRows = $derived.by(() => {
		const entries = Object.entries(data.details?.accounts ?? {});
		return entries
			.map(([id, account]) => ({ id, ...account }))
			.sort((a, b) => (b.valueInPercentage ?? 0) - (a.valueInPercentage ?? 0));
	});
</script>

<div class="space-y-4">
	<h1 class="text-xl font-semibold">Allocations</h1>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Account</Table.Head>
				<Table.Head class="text-right">Balance</Table.Head>
				<Table.Head class="text-right">Value</Table.Head>
				<Table.Head class="text-right">Allocation</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each accountRows as row (row.id)}
				<Table.Row class="odd:bg-background even:bg-muted/30">
					<Table.Cell>{row.name}</Table.Cell>
					<Table.Cell class="text-right">
						<Value value={row.balance} currency={row.currency} />
					</Table.Cell>
					<Table.Cell class="text-right">
						<Value value={row.valueInBaseCurrency} currency={baseCurrency} />
					</Table.Cell>
					<Table.Cell class="text-right">
						<Value value={row.valueInPercentage} type="percent" />
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={4} class="text-muted-foreground py-8 text-center">
						No allocation data available.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
