<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageData } = $props();
	let activityCount = $derived(data.details?.summary?.activityCount ?? 0);
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between gap-3">
		<h1 class="text-xl font-semibold">Activities</h1>
		<div class="flex items-center gap-2">
			<Button variant="outline" disabled>Import...</Button>
			<Button disabled>Create Activity...</Button>
		</div>
	</div>

	<Card.Root>
		<Card.Content class="p-5">
			<p class="text-muted-foreground text-sm">
				Activity management UI is scaffolded for portfolio route parity.
			</p>
			<p class="mt-3 text-sm">
				Current activity count:
				<span class="font-semibold">{activityCount}</span>
			</p>
		</Card.Content>
	</Card.Root>
</div>
