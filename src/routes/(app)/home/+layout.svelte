<script lang="ts">
	import { page } from '$app/stores';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ChartLine, LayoutList, ClipboardList, Star, TrendingUp } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const tabs = [
		{ value: 'overview', label: 'Overview', href: '/home/overview', icon: ChartLine },
		{ value: 'holdings', label: 'Holdings', href: '/home/holdings', icon: LayoutList },
		{ value: 'summary', label: 'Summary', href: '/home/summary', icon: ClipboardList },
		{ value: 'watchlist', label: 'Watchlist', href: '/home/watchlist', icon: Star },
		{ value: 'markets', label: 'Markets', href: '/home/markets', icon: TrendingUp }
	];

	let activeTab = $derived(
		tabs.find((t) => $page.url.pathname.startsWith(t.href))?.value ?? 'overview'
	);
</script>

<div class="space-y-4">
	<Tabs.Root value={activeTab}>
		<Tabs.List>
			{#each tabs as tab (tab.value)}
				<a
					href={tab.href}
					class="focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
				>
					<Tabs.Trigger value={tab.value} class="gap-1.5">
						<tab.icon class="h-4 w-4" />
						<span class="hidden sm:inline">{tab.label}</span>
					</Tabs.Trigger>
				</a>
			{/each}
		</Tabs.List>
	</Tabs.Root>

	{@render children()}
</div>
