# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # serve the production build locally
```

There are no tests or linter configured yet.

## Architecture

This is a read-only analytics dashboard (React 19 + TypeScript + Vite) that visualises data from the `mtg-ctm-be` Express API. It makes **GET requests only**.

### Key files

| File | Purpose |
|---|---|
| `src/config.ts` | Single source of truth for `BASE_URL` (backend host) and the `localStorage` key used to persist the mock-data toggle |
| `src/types.ts` | Shared TypeScript interfaces mirroring every API response shape |
| `src/api.ts` | Thin fetch wrapper — one exported function per GET endpoint, all routed through a private `get<T>()` helper that throws on non-2xx responses |
| `src/mockData.ts` | Static data matching every API shape, used when the mock toggle is on |
| `src/useData.ts` | Generic `useData<T>(fetcher, deps)` hook: manages loading/error/data state and exposes a `reload()` trigger |
| `src/App.tsx` | Wires everything together; owns all filter state (days, topN) and the mock toggle |

### Data flow

```
App.tsx
  └─ useData(useMock ? mockData.X : api.fetchX(), [deps])
       └─ api.ts  →  BASE_URL + path  →  mtg-ctm-be
```

Each panel component receives `{ data, loading, error }` as props — they are purely presentational. All state lives in `App.tsx`.

**Exceptions:**
- `SellersPanel` combines two `useData` results (sellers + seller health check) into one merged display, since the health check is slower and keyed by seller name. It receives `sellers`/`loading`/`error` for the seller list plus `health`/`healthLoading`/`healthError` and an `onRecheck` callback for the health data — sellers render immediately, with each row showing a spinner until that seller's health result resolves.
- `CardsBySellerPanel` combines two `useData` results (`fetchClickThroughByCard` aggregated across all sellers + `fetchClickThroughByCardBySeller` broken down per seller) behind a single "Seller" dropdown. It receives `allSellers`/`allSellersLoading`/`allSellersError` and `bySeller`/`bySellerLoading`/`bySellerError`; both requests fire in parallel from `App.tsx` (sharing the same `days` filter) and the component's local seller selection just picks which result to render — "All sellers" (the default) shows the aggregate, selecting a named seller shows that seller's own `cards` breakdown.

### Mock data toggle

The toggle is a checkbox in the header. Its state is persisted to `localStorage` (key defined in `config.ts`). When on, every `useData` call resolves immediately from `mockData.ts` instead of hitting the network. The yellow banner at the top of the page indicates mock mode is active.

### Adding a new panel

1. Add the response type to `types.ts`.
2. Add a `fetchX()` function to `api.ts`.
3. Add matching static data to `mockData.ts`.
4. Create a component in `src/components/` that accepts `{ data, loading, error }`.
5. Wire up a `useData` call in `App.tsx` and render the component.

### Styling

All styles are in `src/index.css` — a single flat file using CSS custom properties defined on `:root`. No CSS modules, no Tailwind. The layout is a two-column CSS grid (narrow left sidebar + wide right column), collapsing to one column below 900 px.
