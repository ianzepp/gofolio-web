<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<div class="bg-background flex min-h-screen items-center justify-center">
	<div class="w-full max-w-sm space-y-6 p-8">
		<div class="space-y-2 text-center">
			<h1 class="text-2xl font-bold tracking-tight">Gofolio</h1>
			<p class="text-muted-foreground text-sm">Enter your security token to sign in</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
			class="space-y-4"
		>
			<div class="space-y-2">
				<Label for="accessToken">Security Token</Label>
				<Input
					id="accessToken"
					name="accessToken"
					type="password"
					placeholder="Enter your security token"
					value={form?.accessToken ?? ''}
					required
					autocomplete="current-password"
				/>
			</div>

			{#if form?.error}
				<p class="text-destructive text-sm">{form.error}</p>
			{/if}

			<Button type="submit" class="w-full" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign In'}
			</Button>
		</form>
	</div>
</div>
