<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Sun, Moon, Menu, X, LogOut, User, Wallet, LayoutGrid, Plus, Settings } from '@lucide/svelte';
	import type { InfoResponse, UserResponse } from '$lib/types/api';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let { info, user }: { info: InfoResponse; user: UserResponse } = $props();

	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ href: '/home', label: 'Overview' },
		{ href: '/portfolio', label: 'Portfolio' },
		{ href: '/accounts', label: 'Accounts' }
	];

	let isAdmin = $derived(user.permissions.includes('accessAdminControl'));
	let canCreateActivity = $derived(
		user.permissions.includes('createOrder') && !user.settings?.isRestrictedView
	);

	function isActive(href: string): boolean {
		return $page.url.pathname.startsWith(href);
	}

	function open(path: string) {
		mobileMenuOpen = false;
		void goto(path);
	}

	$effect(() => {
		const pathname = $page.url.pathname;
		if (pathname) {
			mobileMenuOpen = false;
		}
	});
</script>

<header
	class="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur"
>
	<div class="mx-auto flex h-14 w-full max-w-6xl items-center px-4 md:px-6">
		<!-- Logo -->
		<a href="/home" class="mr-6 flex items-center space-x-2 text-lg font-bold"> Gofolio </a>

		<!-- Desktop nav -->
		<nav class="hidden items-center space-x-1 md:flex">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(link.href)
						? 'bg-accent text-accent-foreground'
						: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}"
				>
					{link.label}
				</a>
			{/each}
			{#if isAdmin}
				<a
					href="/admin"
					class="rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive('/admin')
						? 'bg-accent text-accent-foreground'
						: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}"
				>
					Admin
				</a>
			{/if}
		</nav>

		<!-- Spacer -->
		<div class="flex-1"></div>

		<!-- Theme toggle -->
		<Button variant="ghost" size="icon" onclick={() => theme.toggle()} class="mr-2">
			{#if $theme === 'dark'}
				<Sun class="h-4 w-4" />
			{:else}
				<Moon class="h-4 w-4" />
			{/if}
		</Button>

		<!-- User dropdown (desktop) -->
		<div class="hidden md:block">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-medium transition-all"
				>
					<User class="h-4 w-4" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-48">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item onclick={() => open('/home')}>
						<LayoutGrid class="h-4 w-4" />
						Overview
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => open('/accounts')}>
						<Wallet class="h-4 w-4" />
						Accounts
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => open('/account')}>
						<Settings class="h-4 w-4" />
						Account Settings
					</DropdownMenu.Item>
					{#if canCreateActivity}
						<DropdownMenu.Item onclick={() => open('/portfolio/activities?createDialog=true')}>
							<Plus class="h-4 w-4" />
							Add Activity
						</DropdownMenu.Item>
					{/if}
					<DropdownMenu.Separator />
					<form method="POST" action="/auth?/signout">
						<button
							type="submit"
							class="hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none"
						>
							<LogOut class="h-4 w-4" />
							Sign Out
						</button>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

		<!-- Mobile menu button -->
		<Button
			variant="ghost"
			size="icon"
			class="md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			{#if mobileMenuOpen}
				<X class="h-5 w-5" />
			{:else}
				<Menu class="h-5 w-5" />
			{/if}
		</Button>
	</div>

	<!-- Mobile nav -->
	{#if mobileMenuOpen}
		<nav class="border-border space-y-1 border-t px-4 py-3 md:hidden">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="block rounded-md px-3 py-2 text-sm font-medium {isActive(link.href)
						? 'bg-accent text-accent-foreground'
						: 'text-muted-foreground hover:text-foreground'}"
					onclick={() => (mobileMenuOpen = false)}
				>
					{link.label}
				</a>
			{/each}
			{#if isAdmin}
				<a
					href="/admin"
					class="block rounded-md px-3 py-2 text-sm font-medium {isActive('/admin')
						? 'bg-accent text-accent-foreground'
						: 'text-muted-foreground hover:text-foreground'}"
					onclick={() => (mobileMenuOpen = false)}
				>
					Admin
				</a>
			{/if}
			<form method="POST" action="/auth?/signout">
				<button
					type="submit"
					class="text-muted-foreground hover:text-foreground flex w-full items-center rounded-md px-3 py-2 text-sm font-medium"
				>
					<LogOut class="mr-2 h-4 w-4" />
					Sign Out
				</button>
			</form>
			{#if canCreateActivity}
				<a
					href="/portfolio/activities?createDialog=true"
					class="text-muted-foreground hover:text-foreground block rounded-md px-3 py-2 text-sm font-medium"
					onclick={() => (mobileMenuOpen = false)}
				>
					Add Activity
				</a>
			{/if}
		</nav>
	{/if}
</header>
