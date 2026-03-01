<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { ChartCandlestick, PieChart, Flame, Microscope, BrainCircuit } from '@lucide/svelte';

	let { children }: { children: Snippet } = $props();

	const tabs = [
		{ href: '/portfolio/activities', label: 'Activities', icon: ChartCandlestick },
		{ href: '/portfolio/allocations', label: 'Allocations', icon: PieChart },
		{ href: '/portfolio/fire', label: 'Fire', icon: Flame },
		{ href: '/portfolio/x-ray', label: 'X-Ray', icon: Microscope },
		{ href: '/portfolio/analysis', label: 'Analysis', icon: BrainCircuit }
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
					class="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(tab.href)
						? 'bg-accent text-foreground'
						: 'text-muted-foreground hover:text-foreground'}"
				>
					<tab.icon class="h-4 w-4" />
					<span>{tab.label}</span>
				</a>
			{/each}
		</div>
	</nav>

	{@render children()}
</div>
