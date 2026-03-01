<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Copy } from '@lucide/svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
	let tab = $state<'signin' | 'signup'>('signin');
	let copied = $state(false);

	$effect(() => {
		if (form?.tab === 'signup') tab = 'signup';
	});

	function copyToken() {
		if (form?.accessToken) {
			navigator.clipboard.writeText(form.accessToken);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}
</script>

<div class="bg-background flex min-h-screen items-center justify-center">
	<div class="w-full max-w-sm space-y-6 p-8">
		<div class="space-y-2 text-center">
			<h1 class="text-2xl font-bold tracking-tight">Gofolio</h1>
			<p class="text-muted-foreground text-sm">Manage your wealth like a boss</p>
		</div>

		<!-- Tabs -->
		<div class="border-border flex border-b">
			<button
				class="flex-1 py-2 text-center text-sm font-medium transition-colors {tab === 'signin'
					? 'border-primary text-foreground border-b-2'
					: 'text-muted-foreground hover:text-foreground'}"
				onclick={() => (tab = 'signin')}
			>
				Sign In
			</button>
			<button
				class="flex-1 py-2 text-center text-sm font-medium transition-colors {tab === 'signup'
					? 'border-primary text-foreground border-b-2'
					: 'text-muted-foreground hover:text-foreground'}"
				onclick={() => (tab = 'signup')}
			>
				Sign Up
			</button>
		</div>

		<!-- Sign In -->
		{#if tab === 'signin'}
			<form
				method="POST"
				action="?/signin"
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
						value={form?.tab !== 'signup' ? (form?.accessToken ?? '') : ''}
						required
						autocomplete="current-password"
					/>
				</div>

				{#if form?.error && form?.tab !== 'signup'}
					<p class="text-destructive text-sm">{form.error}</p>
				{/if}

				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>
		{/if}

		<!-- Sign Up -->
		{#if tab === 'signup'}
			{#if form?.accessToken && form?.tab === 'signup'}
				<!-- Success: show the generated token -->
				<div class="space-y-4">
					<div class="bg-muted/40 rounded-md border p-4">
						<p class="mb-2 text-sm font-medium">Your security token has been created:</p>
						<div class="flex items-center gap-2">
							<code class="bg-background flex-1 overflow-auto rounded border p-2 text-xs break-all">
								{form.accessToken}
							</code>
							<Button variant="outline" size="icon-sm" onclick={copyToken}>
								<Copy class="size-4" />
							</Button>
						</div>
						{#if copied}
							<p class="text-muted-foreground mt-1 text-xs">Copied!</p>
						{/if}
					</div>
					<p class="text-destructive text-sm font-medium">
						Save this token! It is your only way to sign in. It cannot be recovered.
					</p>
					<Button class="w-full" onclick={() => goto('/home')}>
						Continue to Gofolio
					</Button>
				</div>
			{:else}
				<!-- Registration form -->
				<form
					method="POST"
					action="?/signup"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
					class="space-y-4"
				>
					<p class="text-muted-foreground text-sm">
						Create a new account. A security token will be generated for you to use as your login credential.
					</p>

					{#if form?.error && form?.tab === 'signup'}
						<p class="text-destructive text-sm">{form.error}</p>
					{/if}

					<Button type="submit" class="w-full" disabled={loading}>
						{loading ? 'Creating account...' : 'Create Account'}
					</Button>
				</form>
			{/if}
		{/if}
	</div>
</div>
