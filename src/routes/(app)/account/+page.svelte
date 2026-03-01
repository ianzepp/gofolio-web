<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const ranges = ['1d', '1w', '1m', '3m', '6m', '1y', 'ytd', 'max'];
</script>

<div class="space-y-4">
	<h1 class="text-xl font-semibold">Account Settings</h1>
	<form method="POST" action="?/updateSettings" class="border-border space-y-4 rounded-md border p-4">
		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-2">
				<Label for="baseCurrency">Base Currency</Label>
				<select
					id="baseCurrency"
					name="baseCurrency"
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
				>
					{#each data.info.currencies as currency (currency)}
						<option value={currency} selected={currency === data.user.settings.baseCurrency}>
							{currency}
						</option>
					{/each}
				</select>
			</div>

			<div class="space-y-2">
				<Label for="locale">Locale</Label>
				<Input id="locale" name="locale" value={data.user.settings.locale ?? 'en-US'} required />
			</div>

			<div class="space-y-2">
				<Label for="dateRange">Default Date Range</Label>
				<select
					id="dateRange"
					name="dateRange"
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
				>
					{#each ranges as range (range)}
						<option value={range} selected={range === (data.user.settings.dateRange ?? 'max')}>
							{range.toUpperCase()}
						</option>
					{/each}
				</select>
			</div>

			<div class="space-y-2">
				<Label for="colorScheme">Color Scheme</Label>
				<select
					id="colorScheme"
					name="colorScheme"
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
				>
					<option value="LIGHT" selected={data.user.settings.colorScheme !== 'DARK'}>LIGHT</option>
					<option value="DARK" selected={data.user.settings.colorScheme === 'DARK'}>DARK</option>
				</select>
			</div>
		</div>

		<label class="inline-flex items-center gap-2 text-sm">
			<input
				type="checkbox"
				name="isRestrictedView"
				class="h-4 w-4"
				checked={data.user.settings.isRestrictedView ?? false}
			/>
			Restricted View
		</label>

		{#if form?.action === 'updateSettings' && form?.error}
			<p class="text-destructive text-sm">{form.error}</p>
		{/if}

		<div class="flex justify-end">
			<Button type="submit">Save Settings</Button>
		</div>
	</form>
</div>
