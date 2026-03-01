# Gofolio-Web vs Ghostfolio UI Parity Gaps

This document tracks the remaining work to recreate Ghostfolio's UI/UX in `gofolio-web`.

## Scope

- Target baseline: Ghostfolio client UI in `~/github/gauntlet/ghostfolio/apps/client` and `~/github/gauntlet/ghostfolio/libs/ui`.
- Focus: signed-in product experience first (`/home*`, `/accounts`, portfolio sections), then secondary/admin/public surfaces.
- Non-goal for this phase: backend behavior parity beyond what is required for UI rendering and interaction.

## Current Snapshot

- Core shell + home tabs + accounts are implemented and visually aligned at a structural level.
- Portfolio section work is underway: shared portfolio layout/tabs are in place and Activities now runs on live `/api/v1/order` data with create/update/delete baseline flows.
- Account settings and admin surfaces now have permission-gated route scaffolds, with core settings update flow wired.
- Remaining work is primarily deep interaction fidelity, component completeness, and advanced route/dialog coverage.

## 1. Navigation and Shell Fidelity

- [~] Match header behavior exactly (done: active states and mobile drawer behavior improved; pending: final spacing and icon-token parity).
- [~] Add parity for account/user entry points and contextual actions in the header (done: overview/accounts/add-activity quick actions; pending: impersonation/resources/admin account-menu parity).
- [~] Verify page container widths and breakpoints against Ghostfolio at mobile/tablet/desktop (done: global app shell container tightened to `max-w-6xl`; pending: final breakpoint/token audit).

## 2. Home Overview Parity

- [x] Add data-provider error/status indicators and associated affordances.
- [x] Align loading/skeleton and empty fallback states to Ghostfolio behavior.
- [x] Match chart behavior details (animation condition, axis visibility toggles, empty/fallback handling).
- [x] Complete onboarding empty-state flow logic (state-based CTA progression: setup accounts vs add activity).

## 3. Home Holdings Parity

- [x] Add view-mode switching (table vs chart-style treemap cards) with permission gates.
- [x] Add holding-type toggle (`ACTIVE` / `CLOSED`) and corresponding query/filter behavior.
- [x] Add row click behavior for holding detail dialogs.
- [x] Implement key missing columns/visibility rules from `gf-holdings-table` (first activity, quantity/value desktop columns, allocation/change/performance).
- [x] Add “Show all” behavior/pagination pattern for holdings table.

## 4. Home Summary Parity

- [x] Align `PortfolioSummary` card internals closer to Ghostfolio summary semantics.
- [x] Add missing summary fields/grouping and emergency fund setting update interaction (`?/emergencyFund`).
- [x] Match summary loading and permission-dependent variant behavior for editable settings.

## 5. Home Watchlist Parity

- [x] Add create-watchlist flow (FAB + dialog + `?/create` action to `/api/v1/watchlist`).
- [x] Add delete flow and row-level action menu.
- [x] Add benchmark detail dialog behavior when row clicked (query-param driven detail modal with asset history chart).
- [~] Match permission and impersonation-driven UI states (done: permission and restricted-view gating; pending: impersonation-specific gating after impersonation context is available in the app shell).

## 6. Home Markets Parity

- [x] Add Fear & Greed module (chart + gauge) when permission-enabled.
- [x] Match benchmark table interactions and detail dialogs (row click opens benchmark detail modal).
- [x] Verify permission-driven behavior and explanatory messaging (module hidden with explanatory notice when permission is missing).

## 7. Accounts Page Parity

- [x] Replace placeholder transfer action with transfer-balance dialog flow (`?/transfer` action wired to `/api/v1/account/transfer-balance`).
- [x] Implement account row action menu (view details, edit, delete where allowed; delete disabled for accounts with activities).
- [x] Add create-account flow (FAB + dialog) and empty-state bootstrap behavior (auto-open create dialog when empty + allowed).
- [~] Match restricted/impersonation permission states (done: restricted view enforcement; pending: impersonation-specific gating after impersonation context is available in the app shell).

## 8. Shared Table/Component Fidelity

- [x] Add entity/logo components where Ghostfolio surfaces logos (holdings, watchlist, markets, accounts platform entries).
- [ ] Implement consistent skeleton loaders for all list/table screens.
- [~] Ensure sticky columns, sorting behavior, and responsive column hiding match Ghostfolio (done: sticky key columns across core tables; pending: fine-grained sorting and responsive hide behavior parity).
- [ ] Validate typography, paddings, and row heights against Ghostfolio UI tokens.

## 9. Portfolio Section Coverage (Major Missing Area)

- [x] Implement portfolio routes/pages scaffold:
  - [~] Activities page upgraded from placeholder to live `/api/v1/order` table (done: pagination, sorting, and create/update/delete baseline; pending: advanced import/filter/detail parity).
  - Activities
  - Allocations
  - Fire
  - X-Ray
  - Analysis
- [x] Recreate shared portfolio layout/tab structure.
- [~] Port critical dialogs and flows tied to these views (done: activities create/update/delete baseline; pending: advanced import/filter/detail parity).

## 10. User Account / Settings Coverage

- [~] Implement account settings page and subroutes (done: core settings route and access subroute; pending: membership and billing surfaces).
- [~] Recreate settings update flows and UI states (done: basic settings update flow via `/api/v1/user/setting`; pending: advanced state variations).

## 11. Admin Surface Coverage (If In Scope)

- [~] Implement admin overview/jobs/market-data/settings/users pages and tabs (done: route/tab scaffolds; pending: page-level parity and interactions).
- [x] Permission-gated admin routing/navigation implemented (`accessAdminControl` guard).

## 12. Public/Marketing/Docs Surfaces (If In Scope)

- Auth/landing/open/resources/about/faq/etc. currently mostly not recreated.
- Prioritize only if product goals require full Ghostfolio site parity.

## 13. Design System and Tokens

- [ ] Audit design tokens (colors, radii, shadows, muted states) against Ghostfolio.
- [ ] Establish a parity token map and component-level override list.
- [ ] Add regression checks for visual consistency after each page port.

## 14. QA and Regression Coverage

- [~] Add route-by-route parity checklist with screenshots (done: checklist doc at `docs/PARITY_CHECKLIST.md`; pending: screenshot set).
- [x] Add responsive QA matrix (mobile/tablet/desktop) in parity checklist.
- [x] Add interaction checklist (dialogs, row clicks, filters, empty/error/loading states).
- [ ] Add basic visual regression snapshots for key pages.

## Prioritized Execution Plan

## Phase A (Near-Term UI Fidelity)

- Finish interaction parity for existing pages (`home*`, `accounts`).
- Implement missing dialogs/FAB/actions and permission states.
- Close skeleton/loading/error-state gaps.

## Phase B (Core Product Surface)

- Continue portfolio parity beyond scaffolded routes (Allocations/Fire/X-Ray/Analysis depth and controls).
- Port high-usage dialogs and filtering systems (activities import/filter/detail parity and shared table behaviors).

## Phase C (Extended Surface)

- User account/settings pages.
- Admin pages (if required).
- Public site pages (if required).

## Definition of Done for "UI Parity"

A page is considered parity-complete when:

- Route exists and matches Ghostfolio information architecture.
- Layout/spacing/typography are visually equivalent at key breakpoints.
- Loading/empty/error states are present and behaviorally equivalent.
- Interactions (dialogs, toggles, menus, row actions) work equivalently.
- Permission/role/impersonation states match Ghostfolio behavior.
- Data representation and table behavior (sorting, columns, responsiveness) are equivalent.

## Tracking

- Keep this file updated as gaps are closed.
- For each implemented gap, add a short note in PR/commit referencing the section ID above.
