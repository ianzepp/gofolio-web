<script lang="ts">
	import type { LayoutData } from '../$types';

	let { data }: { data: LayoutData } = $props();
</script>

<div class="space-y-4">
	<h1 class="text-2xl font-bold">Overview</h1>
	<p class="text-muted-foreground">
		Welcome to Gofolio. Base currency: {data.info?.baseCurrency ?? 'USD'}.
	</p>
	<p class="text-sm text-muted-foreground">Phase 2 will implement the portfolio overview here.</p>
</div>
