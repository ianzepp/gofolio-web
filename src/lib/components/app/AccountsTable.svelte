<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Value from './Value.svelte';
	import type { AccountWithValue } from '$lib/types/api';
	import { ArrowRightLeft, Ellipsis, Pencil, Trash2, Wallet } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		accounts: AccountWithValue[];
		baseCurrency: string;
		totalValue: number;
		totalBalance: number;
		showActions?: boolean;
		canOpenDetails?: boolean;
		onTransferBalance?: () => void;
		onViewDetails?: (accountId: string) => void;
		onUpdateAccount?: (accountId: string) => void;
		onDeleteAccount?: (accountId: string) => void;
	}

	let {
		accounts,
		baseCurrency,
		totalValue,
		totalBalance,
		showActions = false,
		canOpenDetails = false,
		onTransferBalance,
		onViewDetails,
		onUpdateAccount,
		onDeleteAccount
	}: Props = $props();
	let totalActivities = $derived.by(() =>
		accounts.reduce((sum, account) => sum + (account.activitiesCount ?? 0), 0)
	);
</script>

{#if showActions}
	<div class="mb-3 flex justify-end">
		<Button
			variant="outline"
			disabled={accounts.length < 2}
			onclick={() => onTransferBalance?.()}
			class="gap-2"
		>
			<ArrowRightLeft class="size-4" />
			Transfer Cash Balance...
		</Button>
	</div>
{/if}

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head class="hidden lg:table-cell">Status</Table.Head>
			<Table.Head class="hidden lg:table-cell">Platform</Table.Head>
			<Table.Head class="text-right">Activities</Table.Head>
			<Table.Head class="text-right">Balance</Table.Head>
			<Table.Head class="text-right">Value</Table.Head>
			<Table.Head class="hidden text-right lg:table-cell">Currency</Table.Head>
			<Table.Head class="text-right">Allocation</Table.Head>
			{#if showActions}
				<Table.Head class="w-12 text-center"></Table.Head>
			{/if}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each accounts as account (account.id)}
			<Table.Row
				class="odd:bg-background even:bg-muted/30 hover:bg-muted/60 {canOpenDetails
					? 'cursor-pointer'
					: ''}"
				onclick={() => canOpenDetails && onViewDetails?.(account.id)}
			>
				<Table.Cell class="font-medium">{account.name}</Table.Cell>
				<Table.Cell class="hidden lg:table-cell">
					{#if account.isExcluded}
						<span class="text-muted-foreground text-xs">Excluded</span>
					{/if}
				</Table.Cell>
				<Table.Cell class="hidden lg:table-cell">
					{account.platform?.name ?? '-'}
				</Table.Cell>
				<Table.Cell class="text-right">{account.activitiesCount}</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={account.balance} currency={account.currency} />
				</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={account.valueInBaseCurrency} currency={baseCurrency} />
				</Table.Cell>
				<Table.Cell class="hidden text-right lg:table-cell">{account.currency}</Table.Cell>
				<Table.Cell class="text-right">
					<Value value={account.allocationInPercentage} type="percent" />
				</Table.Cell>
				{#if showActions}
					<Table.Cell class="text-center" onclick={(event) => event.stopPropagation()}>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								class="hover:bg-accent hover:text-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md"
							>
								<Ellipsis class="size-4" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="w-44">
								<DropdownMenu.Item onclick={() => onViewDetails?.(account.id)}>
									<Wallet class="size-4" />
									View Details...
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={() => onUpdateAccount?.(account.id)}>
									<Pencil class="size-4" />
									Edit...
								</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item
									variant="destructive"
									disabled={account.activitiesCount > 0}
									onclick={() => onDeleteAccount?.(account.id)}
								>
									<Trash2 class="size-4" />
									Delete
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Table.Cell>
				{/if}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={showActions ? 9 : 8} class="text-muted-foreground py-8 text-center">
					No accounts found.
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
	{#if accounts.length > 0}
		<Table.Footer>
			<Table.Row>
				<Table.Cell class="font-bold">Total</Table.Cell>
				<Table.Cell class="hidden lg:table-cell"></Table.Cell>
				<Table.Cell class="hidden lg:table-cell"></Table.Cell>
				<Table.Cell class="text-right font-bold">{totalActivities}</Table.Cell>
				<Table.Cell class="text-right font-bold">
					<Value value={totalBalance} currency={baseCurrency} />
				</Table.Cell>
				<Table.Cell class="text-right font-bold">
					<Value value={totalValue} currency={baseCurrency} />
				</Table.Cell>
				<Table.Cell class="hidden lg:table-cell"></Table.Cell>
				<Table.Cell class="text-right font-bold">
					<Value value={1} type="percent" />
				</Table.Cell>
				{#if showActions}
					<Table.Cell></Table.Cell>
				{/if}
			</Table.Row>
		</Table.Footer>
	{/if}
</Table.Root>
