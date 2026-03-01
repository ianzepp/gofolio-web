<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const tabs = [
		{ href: '/account', label: 'Settings' },
		{ href: '/account/access', label: 'Access' }
	];

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<div class="space-y-3">
	<nav class="border-border overflow-x-auto rounded-md border p-1">
		<div class="flex min-w-max items-center gap-1">
			{#each tabs as tab (tab.href)}
				<a
					href={tab.href}
					class="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(tab.href)
						? 'bg-accent text-foreground'
						: 'text-muted-foreground hover:text-foreground'}"
				>
					{tab.label}
				</a>
			{/each}
		</div>
	</nav>

	{@render children()}
</div>
