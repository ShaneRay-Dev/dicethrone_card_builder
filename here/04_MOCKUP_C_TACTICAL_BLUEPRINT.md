# Mockup C: Tactical Blueprint

Goal: high-density professional workspace for expert users managing many assets and layers.

## Design Direction

- Style: blueprint + production console
- Mood: precise, technical, high-control
- Best for: advanced users doing heavy layer management and repeat workflows

## Layout Structure

```
+--------------------------------------------------------------------------------------+
| Top Command Strip: project, mode, templates, performance badge, save/export/print   |
+------------------------------+--------------------------------------+-----------------+
| Asset Matrix                 | Live Render Grid                     | Precision Dock  |
| - Folder tree                | - Main canvas                        | - Numeric nudges|
| - Search + tags              | - Optional split compare             | - Snapping grid |
| - Batch actions              | - Overlay toggles                    | - Alignment     |
| - Drag to stage              | - Safe area indicators               | - Constraints   |
+------------------------------+--------------------------------------+-----------------+
| Bottom Timeline: undo/redo graph, change list, render events, warnings              |
+--------------------------------------------------------------------------------------+
```

## Visual Tokens

- Background: `#0A1220`
- Grid overlay tint: `rgba(74, 144, 226, 0.16)`
- Surface: `#111C2E`
- Surface elevated: `#16243A`
- Primary accent: `#4A90E2`
- Secondary accent: `#5CD6C0`
- Critical accent: `#E35D6A`
- Border: `#2B3E5D`
- Text primary: `#E7EFFC`
- Text secondary: `#A4B4CB`

## Typography

- Headings: `Space Grotesk`
- Body/UI: `Public Sans`
- Metrics/data: `JetBrains Mono`

## Interaction Style

- Strong snap and alignment feedback with short guide lines
- Layer hover previews on stage without opening the full panel
- Numeric edit mode supports keyboard increments with modifier keys
- Bottom timeline highlights expensive actions to surface performance hotspots

## Why This Works

- Optimized for speed and precision under complex workloads
- Makes performance and render behavior visible, which helps maintain quality
- Establishes a serious pro-tool identity while staying coherent and clean

## Implementation Notes

1. Add optional stage grid and safe-area overlay toggles.
2. Build a reusable dock pattern for numeric controls and constraints.
3. Reuse audit instrumentation to feed the performance badge and event timeline.
