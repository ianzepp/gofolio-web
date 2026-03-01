# gofolio-web: Bootstrap Plan

Migration of the Ghostfolio Angular frontend to SvelteKit.

## Rewrite Principle

This is a **frontend UI rewrite** with behavioral parity goals.

- Preserve the user experience: theme, layout, navigation flow, and user-visible behavior.
- Do **not** require implementation parity with Angular (component boundaries, RxJS patterns, route tree shape, or file structure can differ).
- API integration can be redesigned for SvelteKit as long as the end-to-end behavior is preserved and consistent with:
  - `browser -> gofolio-web -> gofolio-api -> db`
- Treat the Angular app as the visual and functional reference, not a line-by-line implementation template.

## Source Audit Summary

The existing Angular frontend (`ghostfolio/apps/client/`) is:

- **110 components** (71 page components, 39 shared components)
- **41 UI library components** in `libs/ui/`
- **12 locales** (Angular i18n with `.xlf` files)
- **Angular Material** for dialogs, tables, tabs, forms, buttons, chips, etc.
- **Bootstrap 4** for grid, utilities, responsive layout
- **Chart.js 4.5.1** with 4 plugins (treemap, annotations, datalabels, date adapter)
- **Ionicons** for icons
- **RxJS + ObservableStore** for state (no NgRx)
- **JWT auth** with interceptors + optional WebAuthn
- **SCSS** with CSS custom properties for dark/light theming

## Architecture

```
gofolio-web/                    SvelteKit project
  src/
    lib/
      api/                      API client (replaces DataService + AdminService)
      components/
        app/                    App-level components (AppHeader, etc.)
        ui/                     shadcn-svelte primitives (button, input, etc.)
        charts/                 Chart.js wrappers
        tables/                 Data tables
        dialogs/                Modal dialogs
        forms/                  Form controls
      stores/                   Svelte stores (replaces ObservableStore + RxJS)
      types/                    TypeScript interfaces (ported from Angular)
      utils/                    Formatting, date helpers, filters
    routes/
      (app)/                    Auth-required layout group
        +layout.svelte          Auth guard, nav chrome
        +layout.server.ts       Session validation
        home/
          +page.svelte          Dashboard
          holdings/
          summary/
          markets/
          watchlist/
        portfolio/
          +page.svelte
          activities/
          allocations/
          fire/
          x-ray/
        accounts/
        admin/
          +page.svelte          Admin dashboard
          jobs/
          market-data/
          settings/
          users/
        account/                User settings
          access/
          membership/
        zen/
      (auth)/
        auth/
          +page.svelte          Login (JWT token only)
          [jwt]/+page.svelte    Token-based login
      api/
        [...path]/+server.ts    Same-origin proxy (gofolio-web -> gofolio-api)
      p/
        [accessId]/+page.svelte Public portfolio (SSR)
    hooks.server.ts             Auth middleware, API proxy config
    app.html
    app.css                     Global styles, CSS variables, theme
  static/
    icons/
  tests/
```

## Tech Stack

| Concern          | Angular (current)                 | SvelteKit (target)                                                           |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| Framework        | Angular 21                        | SvelteKit 2                                                                  |
| Language         | TypeScript                        | TypeScript                                                                   |
| Routing          | Angular Router + lazy loading     | SvelteKit file-based routing                                                 |
| State            | RxJS + ObservableStore            | Svelte 5 runes (`$state`, `$derived`) + server-side load functions           |
| HTTP client      | Angular HttpClient + interceptors | Same-origin `fetch` to `/api/v1/*`; SvelteKit server forwards to gofolio-api |
| UI components    | Angular Material                  | shadcn-svelte (Radix primitives, Tailwind)                                   |
| Icons            | Ionicons                          | Lucide (`@lucide/svelte`)                                                    |
| Charts           | Chart.js + Angular wrappers       | Chart.js direct (or svelte-chartjs)                                          |
| CSS              | SCSS + Bootstrap 4 + CSS vars     | Tailwind CSS + CSS vars                                                      |
| Tables           | MatTable + MatSort + MatPaginator | TanStack Table (headless) + shadcn table                                     |
| Dialogs          | MatDialog                         | shadcn-svelte Dialog (Radix)                                                 |
| Forms            | Angular Reactive Forms + Material | Native forms + superforms + shadcn form                                      |
| i18n             | Angular i18n (xlf)                | Deferred (English-only for now)                                              |
| Theming          | CSS vars + `.theme-dark` class    | Tailwind dark mode + CSS vars                                                |
| Device detection | ngx-device-detector               | CSS media queries + `$app/environment`                                       |
| Markdown         | ngx-markdown + marked             | mdsvex (if needed)                                                           |
| Auth             | JWT in localStorage + interceptor | JWT in httpOnly cookie, `hooks.server.ts` (no OAuth, no WebAuthn)            |
| Linting          | TSLint / ESLint (Angular)         | ESLint + typescript-eslint + eslint-plugin-svelte                            |
| Formatting       | Prettier (Angular)                | Prettier + prettier-plugin-svelte + prettier-plugin-tailwindcss              |
| Build            | Nx + Angular CLI + esbuild        | Vite (built into SvelteKit)                                                  |

### Why shadcn-svelte

- Port of shadcn/ui to Svelte — same API, same look
- Built on Radix primitives (accessible by default)
- Components are copied into your project (own the code, no dependency)
- Tailwind-based styling — easy to customize
- Covers: Button, Dialog, Table, Tabs, Select, Input, Checkbox, Card, Dropdown, Tooltip, etc.
- Replaces Angular Material entirely

### Why Tailwind over Bootstrap

- First-class SvelteKit integration
- shadcn-svelte requires it
- Utility-first maps well to Svelte's component model
- Dark mode built in (`class` strategy)
- No JS runtime (unlike Bootstrap's jQuery-era patterns)

## Migration Phases

### Phase 0 — Scaffold (day 1) ✅ DONE

1. ✅ Init SvelteKit project with TypeScript (SvelteKit 2, Svelte 5)
2. ✅ Add Tailwind CSS (v4, via `@tailwindcss/vite`)
3. ✅ Add shadcn-svelte (neutral base color, dark mode CSS vars)
4. ✅ Set up same-origin API proxy in `src/routes/api/[...path]/+server.ts` (server forwards to gofolio-api)
5. ✅ Set up auth (JWT cookie handling in `hooks.server.ts`)
6. ✅ Create `$lib/api/client.ts` — typed fetch wrapper for same-origin `/api/v1/*`
7. ✅ Set up dark/light theme toggle with CSS vars (`$lib/stores/theme.ts`)
8. ✅ Scaffold route groups: `(app)`, `(auth)`, root redirect `/` → `/home`

### Phase 1 — Auth + shell (day 1-2) ✅ DONE

Get the app to boot, authenticate, and show a layout.

1. ✅ **Login page** — `/auth` with security token form, SvelteKit form action, httpOnly cookie
2. ✅ **Auth guard** — `hooks.server.ts` redirects to `/auth` if no token, redirects away if authenticated
3. ✅ **Sign out** — named form action at `/auth?/signout`, clears cookie
4. ✅ **App layout** — `(app)/+layout.server.ts` fetches `/api/v1/info` + `/api/v1/user` server-side
5. ✅ **Header** — `$lib/components/app/AppHeader.svelte` with nav links, theme toggle, user dropdown, mobile hamburger menu
6. ✅ **Home stub** — `(app)/home/+page.svelte` placeholder confirming data pipeline works
7. ✅ **ESLint + Prettier** — standard SvelteKit linting with Svelte and Tailwind plugins

### Phase 2 — Dashboard + read-only views (day 2-4)

Port the main views that display data.

1. **Home/dashboard** — holdings list, summary cards, portfolio value
2. **Holdings table** — shadcn Table + TanStack Table for sorting/filtering
3. **Performance chart** — Chart.js line chart (port config from `investment-chart.component.ts`)
4. **Portfolio proportion chart** — Chart.js doughnut
5. **Accounts list** — table with balances
6. **Watchlist** — table with current prices
7. **Markets view** — market overview
8. **Benchmarks** — benchmark comparison chart

### Phase 3 — CRUD operations (day 4-6)

Wire up create/update/delete flows.

1. **Activities** — list + create/edit dialog + bulk delete
2. **Accounts** — create/edit/delete + balance management
3. **Tags** — CRUD
4. **Platforms** — CRUD
5. **Watchlist** — add/remove items
6. **Access grants** — create/edit/delete sharing links
7. **User settings** — settings form + PUT

### Phase 4 — Portfolio analysis (day 6-8)

The complex views.

1. **Portfolio details** — full breakdown with filters (accounts, tags, asset classes)
2. **Allocations** — treemap chart, proportion charts by asset class/region/sector
3. **Activities timeline** — dividend/investment history charts
4. **X-Ray** — portfolio health rules engine
5. **FIRE calculator** — savings rate, retirement projection
6. **Holding detail dialog** — single holding with chart, transactions, metadata
7. **Public portfolio** — SSR-rendered shared view at `/p/[accessId]`

### Phase 5 — Admin (day 8-9)

1. **Admin dashboard** — user count, activity stats, system info
2. **Admin users** — user table with impersonation
3. **Admin market data** — asset profiles, scraper testing
4. **Admin jobs** — queue job list, execute, delete
5. **Admin settings** — system settings form
6. **Cache flush** — button

### Phase 6 — Polish (day 9-10)

1. **Responsive design** — mobile layouts, touch targets
2. **Skeleton loaders** — loading states for all data views
3. **Error handling** — error boundaries, toast notifications
4. **PWA manifest** — `site.webmanifest` for installability
5. **SEO** — meta tags for public portfolio SSR
6. **Zen mode** — distraction-free holdings view

## Component Mapping

### High-priority (Phase 1-3)

| Angular Component                | SvelteKit Equivalent                           |
| -------------------------------- | ---------------------------------------------- |
| `app.component.ts`               | `+layout.svelte` (root)                        |
| `header.component.ts`            | `$lib/components/app/AppHeader.svelte`         |
| `footer.component.ts`            | `$lib/components/app/AppFooter.svelte`         |
| `auth/page.component.ts`         | `routes/(auth)/auth/+page.svelte`              |
| `login-with-access-token-dialog` | Inline in auth page                            |
| `home-overview.component.ts`     | `routes/(app)/home/+page.svelte`               |
| `home-holdings.component.ts`     | `$lib/components/HoldingsTable.svelte`         |
| `home-summary.component.ts`      | `$lib/components/HomeSummary.svelte`           |
| `home-watchlist.component.ts`    | `$lib/components/Watchlist.svelte`             |
| `account-detail-dialog`          | `$lib/components/dialogs/AccountDialog.svelte` |
| `holding-detail-dialog`          | `$lib/components/dialogs/HoldingDialog.svelte` |

### UI library mapping

| Angular Material            | shadcn-svelte               |
| --------------------------- | --------------------------- |
| `MatDialog`                 | `Dialog`                    |
| `MatTable`                  | `Table` (+ TanStack Table)  |
| `MatTabs`                   | `Tabs`                      |
| `MatButton`                 | `Button`                    |
| `MatInput` / `MatFormField` | `Input` + `Label`           |
| `MatSelect`                 | `Select`                    |
| `MatCheckbox`               | `Checkbox`                  |
| `MatChip`                   | `Badge`                     |
| `MatCard`                   | `Card`                      |
| `MatMenu`                   | `DropdownMenu`              |
| `MatTooltip`                | `Tooltip`                   |
| `MatProgressBar`            | `Progress`                  |
| `MatSlideToggle`            | `Switch`                    |
| `MatExpansionPanel`         | `Collapsible` / `Accordion` |
| `MatPaginator`              | TanStack Table pagination   |
| `MatSort`                   | TanStack Table sorting      |
| `MatDatepicker`             | `DatePicker` (shadcn)       |

### Chart components

| Angular Chart Component         | SvelteKit Equivalent                            |
| ------------------------------- | ----------------------------------------------- |
| `investment-chart.component.ts` | `$lib/components/charts/InvestmentChart.svelte` |
| `line-chart/` (ui lib)          | `$lib/components/charts/LineChart.svelte`       |
| `portfolio-proportion-chart/`   | `$lib/components/charts/ProportionChart.svelte` |
| `treemap-chart/`                | `$lib/components/charts/TreemapChart.svelte`    |
| `world-map-chart/`              | `$lib/components/charts/WorldMap.svelte`        |
| `benchmark-comparator`          | `$lib/components/charts/BenchmarkChart.svelte`  |
| `fear-and-greed-index`          | `$lib/components/charts/FearGreedIndex.svelte`  |

## API Client Design

```typescript
// $lib/api/client.ts
// Browser and SvelteKit loaders/actions call gofolio-web only.
// gofolio-web forwards to gofolio-api server-side.
const API_BASE = '/api/v1';

export async function api(path: string, options?: RequestInit) {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		}
	});
	if (!res.ok) throw new ApiError(res.status, await res.text());
	return res.json();
}

// Typed wrappers
export const getUser = () => api('/user');
export const getHoldings = (filters?: Filters) => api(`/portfolio/holdings?${qs(filters)}`);
export const getAccounts = () => api('/account');
// ...
```

Server-side loaders call same-origin API routes; JWT cookie is forwarded server-side:

```typescript
// routes/(app)/home/+page.server.ts
export async function load({ fetch }) {
	const [holdings, summary] = await Promise.all([
		fetch('/api/v1/portfolio/holdings').then((r) => r.json()),
		fetch('/api/v1/portfolio/performance?range=max').then((r) => r.json())
	]);
	return { holdings, summary };
}
```

## Auth Flow

```
Browser → gofolio-web → gofolio-api → db
  1. User visits /auth
  2. Submits token → gofolio-web POST /auth/login (form action)
  3. Server action calls gofolio-api POST /api/v1/auth/anonymous
  4. gofolio-api returns JWT
  5. gofolio-web sets httpOnly cookie with JWT
  6. Redirects to /home
  7. All subsequent requests from browser go to gofolio-web only (`/api/v1/*` or page loads)
  8. gofolio-web server reads cookie and forwards JWT to gofolio-api
  9. Client-side navigation: SvelteKit fetches loaders via internal __data.json
```

Benefits over current approach:

- JWT never exposed to client JS (httpOnly cookie)
- No localStorage token storage
- No CORS complexity (browser only talks to gofolio-web)
- SSR works (server has the token)

## Visual Identity

**Goal: the rewritten app should be visually indistinguishable from the original Ghostfolio.**

This is a technology rewrite, not a redesign. Same colors, same layout, same spacing, same component look-and-feel. A user switching between the Angular and SvelteKit versions should not notice a difference.
Implementation details may differ as long as visual and interaction outcomes remain equivalent.

### What stays the same

- Color palette (dark/light themes, accent colors)
- Typography (Inter / Roboto / Helvetica Neue stack)
- Layout structure (header, sidebar, content area)
- Component appearance (tables, cards, dialogs, buttons, charts)
- Spacing and sizing conventions
- Icon style (Lucide — visually similar to Ionicons)
- Chart colors and styling

### How to achieve this

- Port the existing CSS custom properties from `apps/client/src/styles/` verbatim
- Configure shadcn-svelte theme to match Ghostfolio's Material Design look (not shadcn defaults)
- Use Tailwind only for layout utilities — visual styling comes from the ported CSS vars
- Match the exact dark/light mode colors from the original `.theme-dark` class
- Reference the running Angular app as the visual spec during development

```css
/* app.css — ported from Ghostfolio */
:root {
	--dark-background: rgb(25, 25, 25);
	--light-background: rgb(255, 255, 255);
	--font-family-sans-serif: 'Inter', Roboto, 'Helvetica Neue', sans-serif;
	/* ... port all 100+ palette variables from the original */
}
```

Dark mode via Tailwind's `class` strategy + a toggle that sets `<html class="dark">`, matching the original's `<body class="theme-dark">` behavior.

## What Gets Dropped

### Angular-specific concerns (replaced by SvelteKit equivalents)

- `NgModule` / `@Component` / `@Injectable` decorators → just functions and components
- RxJS `Observable` / `pipe` / `subscribe` → Svelte stores + async/await
- Angular DI (`providers`, `inject()`) → module imports
- `HttpClient` + interceptors → `fetch` + `hooks.server.ts`
- Angular CLI / Nx build system → Vite
- Zone.js change detection → Svelte reactivity
- `ViewEncapsulation` → Svelte scoped styles (default)
- `ngx-device-detector` → CSS media queries
- `ngx-skeleton-loader` → CSS skeleton with Tailwind `animate-pulse`

### Features excluded from scope

- Marketing/content pages (about, blog, faq, features, pricing, resources, open, demo, register, start, landing)
- i18n / localization (English-only)
- OAuth (Google, OIDC)
- WebAuthn (FIDO2/passkeys)
- Agent/AI chat UI
- iOS app detection / Trusted Web Activity

## Scope Decisions

1. **Marketing/content pages** — Cut. No about, blog, faq, features, pricing, resources, open, demo, register, start, landing. App-only.
2. **i18n** — Deferred. English-only. Paraglide can be added later.
3. **OAuth + WebAuthn** — Excluded. Matches Go API scope.
4. **Agent/AI chat** — Excluded. Strip it out entirely.
5. **Mobile** — CSS responsive is fine, but not a priority. No iOS/TWA detection.
