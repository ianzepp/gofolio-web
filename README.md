# gofolio-web

A modern SvelteKit frontend for portfolio and wealth management, replacing the original Angular-based Ghostfolio client.

**Status: In active development — not yet feature-complete.**

## Features

- **Dashboard** — Portfolio performance chart, holdings overview, and summary metrics
- **Holdings** — Sortable table with asset allocation, quantity, value, and performance columns
- **Activities** — Full CRUD for transactions (buy, sell, dividend, etc.) with filtering and JSON import
- **Accounts** — Account list with balances, create/edit/delete, and balance transfers
- **Watchlist** — Track benchmarks and indexes with current prices
- **Markets** — Fear & Greed index and benchmark comparisons
- **Portfolio Analysis** — X-Ray health checks, FIRE calculator, and allocation breakdowns
- **Admin Panel** — User management, market data administration, job queues, and system settings
- **Dark Mode** — Toggle between light and dark themes with persistent preference
- **Auth** — Token-based authentication with httpOnly cookie sessions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Language | TypeScript 5.9 (strict mode) |
| Styling | Tailwind CSS v4 |
| Components | shadcn-svelte + bits-ui v2 |
| Icons | Lucide Svelte |
| Charts | Chart.js 4 + chartjs-adapter-date-fns |
| Build | Vite |
| Deploy | @sveltejs/adapter-node |
| Package Manager | pnpm |

## Project Structure

```
src/
├── routes/
│   ├── (app)/                    # Authenticated pages
│   │   ├── +layout.server.ts     # Loads user + system info
│   │   ├── +layout.svelte        # App shell with header
│   │   ├── home/
│   │   │   ├── overview/         # Dashboard with chart + metrics
│   │   │   ├── holdings/         # Holdings table
│   │   │   ├── summary/          # Portfolio summary cards
│   │   │   ├── watchlist/        # Benchmark watchlist
│   │   │   └── markets/          # Market indicators
│   │   ├── portfolio/
│   │   │   ├── activities/       # Transaction CRUD
│   │   │   ├── allocations/      # Asset allocation view
│   │   │   ├── analysis/         # Portfolio analysis
│   │   │   ├── fire/             # FIRE calculator
│   │   │   └── x-ray/           # Portfolio health check
│   │   ├── accounts/             # Account list + management
│   │   ├── account/              # User settings
│   │   │   ├── membership/       # Subscription management
│   │   │   └── access/           # Access grants + sharing
│   │   └── admin/
│   │       ├── overview/         # Admin dashboard
│   │       ├── users/            # User management
│   │       ├── market-data/      # Asset data sources
│   │       ├── jobs/             # Background job queues
│   │       └── settings/         # System configuration
│   ├── (auth)/
│   │   └── auth/                 # Login + sign-up page
│   └── api/[...path]/            # API proxy to gofolio-api
├── lib/
│   ├── api/client.ts             # Typed fetch wrapper (v1/v2)
│   ├── components/
│   │   ├── app/                  # App components (header, tables, charts)
│   │   ├── ui/                   # shadcn-svelte primitives
│   │   └── charts/               # Chart.js wrappers
│   ├── stores/theme.ts           # Dark/light mode store
│   └── types/api.ts              # API response interfaces
└── hooks.server.ts               # Auth middleware
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A running [gofolio-api](https://github.com/ianzepp/gofolio-api) instance

### Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env and set GOFOLIO_API_URL

# Start development server
pnpm dev
```

The app runs at `http://localhost:5173` by default.

## Architecture

### Authentication

Users authenticate with a security token (not a traditional password). The flow:

1. User submits their token on the `/auth` page
2. SvelteKit server action calls `gofolio-api /api/v1/auth/anonymous`
3. The returned JWT is stored in an httpOnly cookie (`gofolio_token`)
4. All subsequent requests carry the cookie automatically — no client-side token handling

New users receive a one-time access token on sign-up that must be saved immediately.

### API Proxy

Client-side code never calls gofolio-api directly. A catch-all route at `/api/[...path]` proxies requests server-side, attaching the Bearer token from the cookie. This keeps the API URL and credentials out of the browser.

### Server-Side Data Loading

Each page uses `+page.server.ts` to fetch data directly from gofolio-api with the user's token. The app layout pre-loads user info and system configuration for all authenticated pages.

### Theming

Dark mode is managed via a Svelte store that persists to localStorage and toggles the `dark` class on `<html>`. Tailwind's class-based dark mode strategy handles the rest.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server (`node build`) |
| `pnpm preview` | Preview production build |
| `pnpm check` | Run svelte-check type validation |
| `pnpm lint` | Lint with ESLint |
| `pnpm format` | Format with Prettier |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOFOLIO_API_URL` | Backend API base URL | `http://localhost:3333` |

## Deployment

The project uses `@sveltejs/adapter-node` to build a standalone Node.js server. Deploy to any platform that supports Node:

```bash
pnpm build
node build
```

### Railway

This project is configured for deployment on [Railway](https://railway.app):

```bash
railway link    # Link to your Railway project
railway up      # Deploy
railway logs    # View logs
```

When deploying alongside gofolio-api on Railway, use the private network domain for inter-service communication (e.g., `http://gofolio-api.railway.internal:8080`).

## Related Projects

- [gofolio-api](https://github.com/ianzepp/gofolio-api) — Go backend API
- [gofolio-cli](https://github.com/ianzepp/gofolio-cli) — Rust CLI agent and eval harness
