# Performance And Architecture Audit

Created: 2026-03-09  
Scope: `js/ui.js`, `js/cardRenderer.js`, `js/state.js`, `js/app.js`, `css/*.css`, `index.html`, tests

No code changes were made in this audit.

## Executive Summary

The app is feature-rich and functional, but current architecture is optimized for directness over throughput. Performance bottlenecks are mostly caused by state churn, repeated deep cloning, high-frequency writes to history/localStorage, and expensive render work being triggered too often on the main thread.

You can get significant speed and responsiveness gains with a sweeping but controlled refactor:

1. Introduce a transaction-based state store and stop recording history on every tiny mutation.
2. Add a render scheduler with dirty flags so only changed parts redraw.
3. Move expensive canvas/raster work to OffscreenCanvas + Worker where possible.
4. Separate UI concerns from render concerns into smaller modules.

## Baseline Signals From Current Code

- `js/ui.js`: 6,629 lines, ~230 class methods
- `js/cardRenderer.js`: 4,263 lines, ~122 class methods
- `gameState.getCard(` calls in core JS: ~152
- `gameState.updateProperty(` calls in core JS: ~107
- `renderer.render(` calls in core JS: ~20
- `toDataURL(` usage in core JS: ~14
- `innerHTML =` usage in core JS: ~28

These numbers indicate high read/write frequency plus heavy per-update render paths.

## Priority Findings

## P0: State cloning + history strategy is a major hotspot

Evidence:

- Full deep clone returned from every `getCard()` call: `js/state.js:198-200`
- Every `updateProperty` and `updateProperties` records history immediately: `js/state.js:174-195`
- History stores full card snapshots with no cap: `js/state.js:203-208`
- Drag operations update state continuously on pointer move:
  - Description drag: `js/ui.js:1603-1620`
  - Title drag: `js/ui.js:1621-1637`
  - Cost badge drag: `js/ui.js:1638-1641`

Impact:

- High CPU from repeated deep cloning
- Rapid memory growth from unbounded history snapshots
- Jank during drag and text editing

Recommendation:

- Add `beginTransaction()/commit()` state API
- Use transient UI state during drag; commit once on pointer-up
- Store history as diffs/patches (or capped snapshots)
- Add history cap (example: 200 entries configurable)

## P0: Too much render work on each interaction

Evidence:

- `render()` triggers broad update pipeline: `js/cardRenderer.js:1200-1240`
- `updateCardContent()` calls title + description + cardId updates together: `js/cardRenderer.js:2031-2040`
- Multiple UI handlers call render/update directly in high frequency paths: `js/ui.js:1030-1058`, `js/ui.js:1075-1079`, `js/ui.js:3792-3828`

Impact:

- Main-thread saturation while typing/sliding/dragging
- Lower frame consistency on weaker hardware

Recommendation:

- Create render scheduler:
  - Collect changes into dirty flags (`title`, `description`, `art`, `layers`, `costBadge`)
  - Flush once per animation frame
- Coalesce rapid events (input/wheel/pointermove) into one frame update

## P1: Text layer rendering uses repeated canvas -> base64 -> CSS background

Evidence:

- Title raster to data URL per update: `js/cardRenderer.js:2148-2165`
- Description raster to data URL per block: `js/cardRenderer.js:2435-2480`
- Card ID raster to data URL: `js/cardRenderer.js:2320`

Impact:

- Expensive encoding allocations
- GC pressure from many short-lived base64 strings

Recommendation:

- Prefer direct canvas layers over base64 background images
- Reuse canvases by size buckets
- Cache rendered text blocks keyed by content/style hash
- Use `ImageBitmap` where helpful

## P1: Layout thrash risk from repeated geometry reads in render paths

Evidence:

- Frequent `getBoundingClientRect`/`clientWidth` reads in text render routines:
  - `js/cardRenderer.js:2183-2214`
  - `js/cardRenderer.js:2498-2531`
  - `js/cardRenderer.js:2590`
  - `js/cardRenderer.js:3077-3083`

Impact:

- Potential forced sync layout when mixed with style writes
- Increased frame time variability

Recommendation:

- Build a `layoutSnapshot` once per frame
- Pass dimensions/offsets into render helpers
- Avoid geometry reads after style mutation in same frame

## P1: Image loading for non-icon layers is not centrally cached

Evidence:

- Generic `loadImage(src)` creates a new `Image` each call: `js/cardRenderer.js:1262-1269`
- Export layer drawing repeatedly calls `loadImage`: `js/cardRenderer.js:2890-2913`
- Icon-specific cache exists, but full layer cache does not: `js/cardRenderer.js:1283-1305`

Impact:

- Repeated decode overhead on exports/deck/print renders

Recommendation:

- Add shared `assetCache` for all layer images (not only icons)
- Promote decoded assets to `ImageBitmap` on supported browsers
- Preload hot paths (current card type + default print assets)

## P2: Autosave strategy can create avoidable stalls

Evidence:

- Whole-card autosave every 30s: `js/app.js:15-18`
- Card payload includes art/base64 in many cases

Impact:

- Possible periodic jank and quota pressure

Recommendation:

- Save only on dirty-state change + idle callback
- Compress or split payload (metadata vs binary art references)
- Consider IndexedDB for large binary content

## P2: Monolithic class design slows delivery of future optimization

Evidence:

- `UI` and `CardRenderer` are very large and tightly coupled

Impact:

- Optimization work is harder, riskier, and slower

Recommendation:

- Split into modules:
  - `state/`
  - `render/`
  - `ui/panels/`
  - `services/assets/`
  - `services/persistence/`

## P2: Missing performance guardrails in workflow

Evidence:

- No perf budget checks in scripts/tests (`package.json`)

Impact:

- Regressions can slip in unnoticed

Recommendation:

- Add simple perf regression suite:
  - Render latency budget (typing, drag, export)
  - Memory budget for history growth
  - Lighthouse/Web Vitals baseline snapshots

## Sweeping Refactor Plan (Recommended)

## Phase 1: Instrument and measure first (1-2 days)

- Add timing markers around:
  - `updateDescriptionStateFromEditor`
  - `updateDescriptionImage`
  - `renderArtPreview`
  - `renderCardToCanvas`
- Add frame-time logging toggle in dev mode
- Capture baseline numbers on 2 device classes

## Phase 2: State engine redesign (3-5 days)

- Transaction-based updates
- Patch-based history + capped entries
- Transient drag state with commit on release

Expected win: major interaction smoothness improvement.

## Phase 3: Render scheduler + dirty flags (3-6 days)

- Central `scheduleRender()` using `requestAnimationFrame`
- Partial redraw by region/type instead of whole pipeline

Expected win: lower CPU and better responsiveness while editing.

## Phase 4: Raster/asset pipeline upgrade (5-10 days)

- Shared layer asset cache
- Canvas reuse pools
- Optional Worker/OffscreenCanvas path for heavy text/art composition

Expected win: faster export/print/deck rendering and reduced GC churn.

## Phase 5: UI modularization + visual refresh implementation support (parallel)

- Split large files, preserve behavior with tests
- Makes future perf work and design upgrades safer/faster

## Quick Wins (Low Risk, High ROI)

1. Guard style writes (`if (next !== current)`) before assigning style values repeatedly.
2. Batch related state writes into one update call where possible.
3. Add debounce/coalescing around rich text editor updates.
4. Cap history length immediately even before larger state rewrite.
5. Add generic image cache for `loadImage()` path.

## Final Recommendation

If you want top-tier performance, do not patch around the edges.  
Execute Phases 1-4 with an architecture-first approach. The current feature depth justifies a foundational rewrite of state + render scheduling.

