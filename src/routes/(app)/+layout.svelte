<script lang="ts">
	import AppHeader from '$lib/components/app/AppHeader.svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<AppHeader info={data.info} user={data.user} />
	<main class="flex-1 p-4 md:p-6">
		{@render children()}
	</main>
</div>
