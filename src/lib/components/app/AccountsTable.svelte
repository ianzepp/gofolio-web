<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import Value from './Value.svelte';
	import type { AccountWithValue } from '$lib/types/api';

	interface Props {
		accounts: AccountWithValue[];
		baseCurrency: string;
		totalValue: number;
		totalBalance: number;
	}

	let { accounts, baseCurrency, totalValue, totalBalance }: Props = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head class="hidden sm:table-cell">Platform</Table.Head>
			<Table.Head class="text-right">Balance</Table.Head>
			<Table.Head class="text-right">Value</Table.Head>
			<Table.Head class="hidden text-right sm:table-cell">Currency</Table.Head>
			<Table.Head class="text-right">Allocation</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each accounts as account (account.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{account.name}</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">
					{account.platform?.name ?? '-'}
				</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={account.balance} currency={account.currency} />
				</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={account.valueInBaseCurrency} currency={baseCurrency} />
				</Table.Cell>
				<Table.Cell class="hidden text-right sm:table-cell">{account.currency}</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={account.allocationInPercentage} type="percent" />
				</Table.Cell>
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={6} class="text-muted-foreground py-8 text-center">
					No accounts found.
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
	{#if accounts.length > 0}
		<Table.Footer>
			<Table.Row>
				<Table.Cell class="font-bold">Total</Table.Cell>
				<Table.Cell class="hidden sm:table-cell"></Table.Cell>
				<Table.Cell class="text-right font-bold">
					<Value value={totalBalance} currency={baseCurrency} />
				</Table.Cell>
				<Table.Cell class="text-right font-bold">
					<Value value={totalValue} currency={baseCurrency} />
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell"></Table.Cell>
				<Table.Cell class="text-right font-bold">
					<Value value={1} type="percent" />
				</Table.Cell>
			</Table.Row>
		</Table.Footer>
	{/if}
</Table.Root>
