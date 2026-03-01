# UI Parity QA Checklist

This checklist is used to validate `gofolio-web` against Ghostfolio UI behavior.

## Route Matrix

| Route | Desktop | Tablet | Mobile | Notes |
| --- | --- | --- | --- | --- |
| `/home/overview` | ☐ | ☐ | ☐ | onboarding, chart, provider errors |
| `/home/holdings` | ☐ | ☐ | ☐ | view mode, holding type, detail dialog |
| `/home/summary` | ☐ | ☐ | ☐ | summary fields, emergency fund update |
| `/home/watchlist` | ☐ | ☐ | ☐ | create/delete/detail dialog |
| `/home/markets` | ☐ | ☐ | ☐ | fear & greed + benchmark detail dialog |
| `/accounts` | ☐ | ☐ | ☐ | create/edit/delete/transfer/detail |
| `/portfolio/activities` | ☐ | ☐ | ☐ | scaffold route present |
| `/portfolio/allocations` | ☐ | ☐ | ☐ | allocation table |
| `/portfolio/fire` | ☐ | ☐ | ☐ | fire overview cards |
| `/portfolio/x-ray` | ☐ | ☐ | ☐ | asset class breakdown |
| `/portfolio/analysis` | ☐ | ☐ | ☐ | analysis cards |
| `/account` | ☐ | ☐ | ☐ | settings update |
| `/account/access` | ☐ | ☐ | ☐ | access list |
| `/admin/overview` | ☐ | ☐ | ☐ | guard + scaffold |
| `/admin/jobs` | ☐ | ☐ | ☐ | scaffold |
| `/admin/market-data` | ☐ | ☐ | ☐ | scaffold |
| `/admin/settings` | ☐ | ☐ | ☐ | scaffold |
| `/admin/users` | ☐ | ☐ | ☐ | scaffold |

## Interaction Checklist

- ☐ Row-click detail dialogs open and close correctly.
- ☐ Dialog query params are removed when dialog closes.
- ☐ Permission-gated actions are hidden/disabled correctly.
- ☐ Restricted view states hide edit/create actions correctly.
- ☐ Table sticky columns render correctly during horizontal scroll.
- ☐ Empty states and CTA progression match expected route behavior.
- ☐ Error and loading placeholders render when API data is unavailable.

## Visual Checks

- ☐ Header/nav active state and spacing consistency.
- ☐ Card/table paddings and row heights.
- ☐ Typography scale and muted text contrast.
- ☐ Icon sizing and alignment.

## Regression Notes

- Record any parity mismatches here with route, viewport, and screenshot reference.
