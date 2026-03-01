<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, X } from '@lucide/svelte';
	import type { PageData } from './$types';
	import type { LayoutData } from '../$types';
	import AccountsTable from '$lib/components/app/AccountsTable.svelte';
	import type { AccountWithValue } from '$lib/types/api';
	import type { ActionData } from './$types';

	let { data, form }: { data: PageData & LayoutData; form: ActionData } = $props();

	let parentData = $derived(data as PageData & LayoutData);
	let baseCurrency = $derived(parentData.info?.baseCurrency ?? 'USD');
	let currencies = $derived(parentData.info?.currencies ?? [baseCurrency]);
	let canCreateAccount = $derived(
		parentData.user.permissions.includes('createAccount') &&
			!parentData.user.settings?.isRestrictedView
	);
	let canUpdateAccount = $derived(
		parentData.user.permissions.includes('updateAccount') &&
			!parentData.user.settings?.isRestrictedView
	);

	let accountIdFromQuery = $derived($page.url.searchParams.get('accountId'));
	let selectedAccount = $derived.by(() =>
		accountIdFromQuery ? data.accounts.find((account) => account.id === accountIdFromQuery) : undefined
	);
	let showCreateDialog = $derived($page.url.searchParams.get('createDialog') === 'true');
	let showEditDialog = $derived($page.url.searchParams.get('editDialog') === 'true' && !!selectedAccount);
	let showTransferDialog = $derived($page.url.searchParams.get('transferBalanceDialog') === 'true');
	let showDeleteDialog = $derived($page.url.searchParams.get('deleteDialog') === 'true' && !!selectedAccount);
	let showAccountDetailDialog = $derived(
		$page.url.searchParams.get('accountDetailDialog') === 'true' && !!selectedAccount
	);

	let hasDialogParam = $derived(
		showCreateDialog ||
			showEditDialog ||
			showTransferDialog ||
			showDeleteDialog ||
			showAccountDetailDialog
	);

	$effect(() => {
		if (data.accounts.length === 0 && canCreateAccount && !hasDialogParam) {
			void goto('/accounts?createDialog=true', {
				replaceState: true,
				keepFocus: true,
				noScroll: true
			});
		}
	});

	function closeDialogs() {
		void goto('/accounts', { replaceState: true, keepFocus: true, noScroll: true });
	}

	function openQuery(params: Record<string, string>) {
		const query = Object.entries(params)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
			.join('&');
		void goto(`/accounts?${query}`, { keepFocus: true, noScroll: true });
	}

	function openCreateDialog() {
		openQuery({ createDialog: 'true' });
	}

	function openEditDialog(accountId: string) {
		openQuery({ editDialog: 'true', accountId });
	}

	function openDeleteDialog(accountId: string) {
		openQuery({ deleteDialog: 'true', accountId });
	}

	function openTransferDialog() {
		openQuery({ transferBalanceDialog: 'true' });
	}

	function openAccountDetailDialog(accountId: string) {
		openQuery({ accountDetailDialog: 'true', accountId });
	}

	function accountLabel(account?: AccountWithValue): string {
		if (!account) {
			return '';
		}
		return `${account.name} (${account.currency})`;
	}
</script>

<div class="space-y-4">
	<h1 class="hidden text-center text-2xl font-semibold sm:block">Accounts</h1>
	<div class="mx-auto w-full max-w-6xl space-y-3">
		{#if data.accounts.length === 0}
			<div class="bg-muted/30 border-border rounded-lg border p-6 text-center">
				<p class="text-lg font-medium">No accounts have been set up</p>
				<p class="text-muted-foreground mt-1 text-sm">
					Your net worth is managed by 0 accounts
				</p>
				{#if canCreateAccount}
					<Button class="mt-4" onclick={openCreateDialog}>Create Account</Button>
				{/if}
			</div>
		{/if}

		<AccountsTable
			accounts={data.accounts}
			{baseCurrency}
			totalValue={data.totalValue}
			totalBalance={data.totalBalance}
			showActions={canUpdateAccount}
			canOpenDetails={true}
			onTransferBalance={openTransferDialog}
			onViewDetails={openAccountDetailDialog}
			onUpdateAccount={openEditDialog}
			onDeleteAccount={openDeleteDialog}
		/>
	</div>
</div>

{#if canCreateAccount}
	<div class="fixed right-6 bottom-6 z-40">
		<Button size="icon-lg" class="rounded-full shadow-lg" onclick={openCreateDialog}>
			<Plus class="size-5" />
			<span class="sr-only">Create Account</span>
		</Button>
	</div>
{/if}

{#if showTransferDialog}
	<div class="bg-background/70 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
		<div class="bg-background border-border w-full max-w-xl rounded-lg border p-5 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Transfer Cash Balance</h2>
				<Button variant="ghost" size="icon-sm" onclick={closeDialogs}><X class="size-4" /></Button>
			</div>
			<form method="POST" action="?/transfer" class="space-y-4">
				<div class="space-y-2">
					<Label for="accountIdFrom">From</Label>
					<select
						id="accountIdFrom"
						name="accountIdFrom"
						required
						class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
					>
						<option value="" selected disabled>Select account</option>
						{#each data.accounts as account (account.id)}
							<option value={account.id}>{accountLabel(account)}</option>
						{/each}
					</select>
				</div>
				<div class="space-y-2">
					<Label for="accountIdTo">To</Label>
					<select
						id="accountIdTo"
						name="accountIdTo"
						required
						class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
					>
						<option value="" selected disabled>Select account</option>
						{#each data.accounts as account (account.id)}
							<option value={account.id}>{accountLabel(account)}</option>
						{/each}
					</select>
				</div>
				<div class="space-y-2">
					<Label for="transferBalance">Value</Label>
					<div class="flex items-center gap-2">
						<Input id="transferBalance" name="balance" type="number" min="0" step="0.01" required />
						<span class="text-muted-foreground text-sm">{baseCurrency}</span>
					</div>
				</div>
				{#if form?.action === 'transfer' && form?.error}
					<p class="text-destructive text-sm">{form.error}</p>
				{/if}
				<div class="flex justify-end gap-2">
					<Button type="button" variant="ghost" onclick={closeDialogs}>Cancel</Button>
					<Button type="submit">Transfer</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showCreateDialog}
	<div class="bg-background/70 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
		<div class="bg-background border-border w-full max-w-xl rounded-lg border p-5 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Add account</h2>
				<Button variant="ghost" size="icon-sm" onclick={closeDialogs}><X class="size-4" /></Button>
			</div>
			<form method="POST" action="?/create" class="space-y-4">
				<div class="space-y-2">
					<Label for="createName">Name</Label>
					<Input id="createName" name="name" required />
				</div>
				<div class="space-y-2">
					<Label for="createCurrency">Currency</Label>
					<select
						id="createCurrency"
						name="currency"
						required
						class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
					>
						{#each currencies as currency (currency)}
							<option value={currency} selected={currency === baseCurrency}>{currency}</option>
						{/each}
					</select>
				</div>
				<div class="space-y-2">
					<Label for="createBalance">Cash Balance</Label>
					<Input id="createBalance" name="balance" type="number" step="0.01" value="0" required />
				</div>
				<div class="space-y-2">
					<Label for="createComment">Note</Label>
					<textarea
						id="createComment"
						name="comment"
						rows="3"
						class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
					></textarea>
				</div>
				<label class="inline-flex items-center gap-2 text-sm">
					<input type="checkbox" name="isExcluded" class="h-4 w-4" />
					Exclude from Analysis
				</label>
				{#if form?.action === 'create' && form?.error}
					<p class="text-destructive text-sm">{form.error}</p>
				{/if}
				<div class="flex justify-end gap-2">
					<Button type="button" variant="ghost" onclick={closeDialogs}>Cancel</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showEditDialog && selectedAccount}
	<div class="bg-background/70 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
		<div class="bg-background border-border w-full max-w-xl rounded-lg border p-5 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Update account</h2>
				<Button variant="ghost" size="icon-sm" onclick={closeDialogs}><X class="size-4" /></Button>
			</div>
			<form method="POST" action="?/update" class="space-y-4">
				<input type="hidden" name="accountId" value={selectedAccount.id} />
				<div class="space-y-2">
					<Label for="editName">Name</Label>
					<Input id="editName" name="name" required value={selectedAccount.name} />
				</div>
				<div class="space-y-2">
					<Label for="editCurrency">Currency</Label>
					<select
						id="editCurrency"
						name="currency"
						required
						class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
					>
						{#each currencies as currency (currency)}
							<option value={currency} selected={currency === selectedAccount.currency}>{currency}</option>
						{/each}
						{#if !currencies.includes(selectedAccount.currency)}
							<option value={selectedAccount.currency} selected>{selectedAccount.currency}</option>
						{/if}
					</select>
				</div>
				<div class="space-y-2">
					<Label for="editBalance">Cash Balance</Label>
					<Input
						id="editBalance"
						name="balance"
						type="number"
						step="0.01"
						value={String(selectedAccount.balance)}
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="editComment">Note</Label>
					<textarea
						id="editComment"
						name="comment"
						rows="3"
						class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
					>{selectedAccount.comment ?? ''}</textarea>
				</div>
				<label class="inline-flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						name="isExcluded"
						class="h-4 w-4"
						checked={selectedAccount.isExcluded}
					/>
					Exclude from Analysis
				</label>
				{#if form?.action === 'update' && form?.error}
					<p class="text-destructive text-sm">{form.error}</p>
				{/if}
				<div class="flex justify-end gap-2">
					<Button type="button" variant="ghost" onclick={closeDialogs}>Cancel</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showDeleteDialog && selectedAccount}
	<div class="bg-background/70 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
		<div class="bg-background border-border w-full max-w-md rounded-lg border p-5 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Delete account</h2>
				<Button variant="ghost" size="icon-sm" onclick={closeDialogs}><X class="size-4" /></Button>
			</div>
			<p class="text-muted-foreground mb-4 text-sm">
				Delete <span class="text-foreground font-medium">{selectedAccount.name}</span>?
			</p>
			{#if selectedAccount.activitiesCount > 0}
				<p class="text-muted-foreground mb-4 text-sm">
					This account cannot be deleted because it has activities.
				</p>
				<div class="flex justify-end">
					<Button type="button" onclick={closeDialogs}>Close</Button>
				</div>
			{:else}
				<form method="POST" action="?/delete" class="space-y-4">
					<input type="hidden" name="accountId" value={selectedAccount.id} />
					{#if form?.action === 'delete' && form?.error}
						<p class="text-destructive text-sm">{form.error}</p>
					{/if}
					<div class="flex justify-end gap-2">
						<Button type="button" variant="ghost" onclick={closeDialogs}>Cancel</Button>
						<Button type="submit" variant="destructive">Delete</Button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}

{#if showAccountDetailDialog && selectedAccount}
	<div class="bg-background/70 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
		<div class="bg-background border-border w-full max-w-md rounded-lg border p-5 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Account details</h2>
				<Button variant="ghost" size="icon-sm" onclick={closeDialogs}><X class="size-4" /></Button>
			</div>
			<p class="text-sm">
				<span class="text-muted-foreground">Name:</span> {selectedAccount.name}
			</p>
			<p class="text-sm">
				<span class="text-muted-foreground">Currency:</span> {selectedAccount.currency}
			</p>
			<p class="text-sm">
				<span class="text-muted-foreground">Activities:</span> {selectedAccount.activitiesCount}
			</p>
			<p class="text-sm">
				<span class="text-muted-foreground">Platform:</span> {selectedAccount.platform?.name ?? '-'}
			</p>
			<div class="mt-4 flex justify-end">
				<Button type="button" onclick={closeDialogs}>Close</Button>
			</div>
		</div>
	</div>
{/if}
