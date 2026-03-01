# gofolio-web

SvelteKit frontend for Ghostfolio, replacing the original Angular client. Built as part of Gauntlet G4 Week 2 (AgentForge).

**Status: In active development — not yet feature-complete.**

## Stack

- **Framework**: SvelteKit with TypeScript
- **UI**: shadcn-svelte components
- **Styling**: Tailwind CSS
- **Build**: Vite

## Structure

```
src/
├── routes/
│   ├── (app)/          # Authenticated app pages
│   │   ├── home/       # Dashboard
│   │   ├── portfolio/  # Portfolio views
│   │   ├── account/    # Account details
│   │   ├── accounts/   # Account list
│   │   └── admin/      # Admin panel
│   ├── (auth)/         # Auth flows
│   └── api/            # API routes
├── lib/
│   ├── api/            # API client
│   ├── components/     # Shared UI components
│   ├── hooks/          # Custom hooks
│   ├── stores/         # Svelte stores
│   └── types/          # TypeScript types
└── hooks.server.ts     # Server hooks
```

## Development

```bash
pnpm install
pnpm dev
```

Requires a running gofolio-api instance. Copy `.env.example` to `.env` and configure the API URL.

## Related

- [gofolio-api](https://github.com/ianzepp/gofolio-api) — Go backend
- [gofolio-cli](https://github.com/ianzepp/gofolio-cli) — Rust CLI agent and eval harness
