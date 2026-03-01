# Gofolio-Web vs Ghostfolio UI Parity Gaps

This document tracks the remaining work to recreate Ghostfolio's UI/UX in `gofolio-web`.

## Scope

- Target baseline: Ghostfolio client UI in `~/github/gauntlet/ghostfolio/apps/client` and `~/github/gauntlet/ghostfolio/libs/ui`.
- Focus: signed-in product experience first (`/home*`, `/accounts`, portfolio sections), then secondary/admin/public surfaces.
- Non-goal for this phase: backend behavior parity beyond what is required for UI rendering and interaction.

## Current Snapshot

- Core shell + home tabs + accounts are implemented and visually aligned at a structural level.
- Table density and layout rhythm are substantially closer to Ghostfolio.
- Remaining work is mostly interaction fidelity, component completeness, and additional route coverage.

## Remaining Gaps

## 1. Navigation and Shell Fidelity

- Match header behavior exactly (active states, spacing/size constants, mobile drawer behavior, icon sizing).
- Add parity for account/user entry points and contextual actions in the header.
- Verify page container widths and breakpoints against Ghostfolio at mobile/tablet/desktop.

## 2. Home Overview Parity

- Add data-provider error/status indicators and associated affordances.
- Align loading/skeleton states to Ghostfolio behavior.
- Match chart behavior details (animation conditions, axis visibility toggles, empty/fallback handling).
- Complete onboarding empty-state flow logic (state-based CTA progression).

## 3. Home Holdings Parity

- Add view-mode switching (table vs treemap chart) with permission gates.
- Add holding-type toggle (`ACTIVE` / `CLOSED`) and corresponding query/filter behavior.
- Add row click behavior for holding detail dialogs.
- Implement any remaining columns/visibility rules present in Ghostfolio's `gf-holdings-table`.
- Add “Show all” behavior/pagination pattern where applicable.

## 4. Home Summary Parity

- Align `PortfolioSummary` card internals with Ghostfolio summary component semantics.
- Add any missing summary fields, grouping, and edit interactions (e.g., emergency fund setting interactions where supported).
- Match summary loading states and permission-dependent variants.

## 5. Home Watchlist Parity

- Add create-watchlist flow (FAB + dialog + add action).
- Add delete flow and row-level action menus.
- Add benchmark detail dialog behavior when row clicked.
- Match permission and impersonation-driven UI states.

## 6. Home Markets Parity

- Add Fear & Greed module (chart + gauge) when permission-enabled.
- Match benchmark table interactions and detail dialogs.
- Verify premium/permission-driven behavior and explanatory messaging.

## 7. Accounts Page Parity

- [x] Replace placeholder transfer action with transfer-balance dialog flow (`?/transfer` action wired to `/api/v1/account/transfer-balance`).
- [x] Implement account row action menu (view details, edit, delete where allowed; delete disabled for accounts with activities).
- [x] Add create-account flow (FAB + dialog) and empty-state bootstrap behavior (auto-open create dialog when empty + allowed).
- [~] Match restricted/impersonation permission states (restricted view is enforced; impersonation-specific gating still pending due missing impersonation context in current app shell).

## 8. Shared Table/Component Fidelity

- Add entity/logo components where Ghostfolio surfaces logos.
- Implement consistent skeleton loaders for all list/table screens.
- Ensure sticky columns, sorting behavior, and responsive column hiding match Ghostfolio.
- Validate typography, paddings, and row heights against Ghostfolio UI tokens.

## 9. Portfolio Section Coverage (Major Missing Area)

- Implement portfolio routes and pages:
  - Activities
  - Allocations
  - Fire
  - X-Ray
  - Analysis
- Recreate shared portfolio layout/tab structure and filters.
- Port critical dialogs and flows tied to these views.

## 10. User Account / Settings Coverage

- Implement account settings page and subroutes (membership/access where relevant).
- Recreate settings update flows and UI states.

## 11. Admin Surface Coverage (If In Scope)

- Admin overview/jobs/market-data/settings/users pages and tabs.
- Permission-gated navigation and components.

## 12. Public/Marketing/Docs Surfaces (If In Scope)

- Auth/landing/open/resources/about/faq/etc. currently mostly not recreated.
- Prioritize only if product goals require full Ghostfolio site parity.

## 13. Design System and Tokens

- Audit design tokens (colors, radii, shadows, muted states) against Ghostfolio.
- Establish a parity token map and component-level override list.
- Add regression checks for visual consistency after each page port.

## 14. QA and Regression Coverage

- Add route-by-route parity checklist with screenshots.
- Add responsive QA matrix (mobile/tablet/desktop).
- Add interaction checklist (dialogs, row clicks, filters, empty/error/loading states).
- Add basic visual regression snapshots for key pages.

## Prioritized Execution Plan

## Phase A (Near-Term UI Fidelity)

- Finish interaction parity for existing pages (`home*`, `accounts`).
- Implement missing dialogs/FAB/actions and permission states.
- Close skeleton/loading/error-state gaps.

## Phase B (Core Product Surface)

- Implement portfolio pages and their shared controls.
- Port high-usage dialogs and filtering systems.

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
