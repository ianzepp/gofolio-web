<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-4">
	<h1 class="text-xl font-semibold">Account Access</h1>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Alias</Table.Head>
				<Table.Head>ID</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.user.access as access (access.id)}
				<Table.Row class="odd:bg-background even:bg-muted/30">
					<Table.Cell>{access.alias || 'User'}</Table.Cell>
					<Table.Cell class="font-mono text-xs">{access.id}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={2} class="text-muted-foreground py-8 text-center">
						No shared access entries configured.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
