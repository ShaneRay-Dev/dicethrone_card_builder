# Mockup A: Command Center

Goal: premium, focused, dark professional workspace for advanced editing.

## Design Direction

- Style: cinematic control-room
- Mood: confident, high-contrast, tactical
- Best for: power users who multitask across card/leaflet/board flows

## Layout Structure

```
+--------------------------------------------------------------------------------------+
| Brand | Deck Context | Global Actions (Save, Export, Print, Publish)                |
+-------------------------------+--------------------------------------+---------------+
| Left Rail                     | Main Stage                           | Right Rail    |
| - Card Type/Mode              | - Large live preview                | - Inspector   |
| - Asset tools                 | - Layer overlays                    | - Layer list  |
| - Text tools                  | - Snap/grid controls                | - Diagnostics |
| - Icon/status tools           | - Quick compare toggle              | - History      |
+-------------------------------+--------------------------------------+---------------+
| Bottom Utility Bar: status, render ms, memory indicator, undo/redo timeline         |
+--------------------------------------------------------------------------------------+
```

## Visual Tokens

- Background gradient: `#090C12 -> #101827 -> #0C1320`
- Accent primary: `#2EC4B6` (teal)
- Accent secondary: `#FF9F1C` (amber)
- Surface: `rgba(17, 24, 39, 0.78)` with subtle blur
- Border: `#253247`
- Text primary: `#E6EDF6`
- Text secondary: `#9BA9BC`

## Typography

- Headings: `Sora SemiBold`
- UI body: `IBM Plex Sans`
- Data/metrics: `JetBrains Mono`

## Interaction Style

- Panels open with short slide/fade (120-160ms)
- Selected tool uses strong accent edge + glow, not full-color fill
- Live render status chip updates in bottom utility bar
- Keyboard command palette (`Cmd/Ctrl + K`) for frequent actions

## Why This Works

- Gives the tool an intentional, premium identity
- Supports complex workflows with clear information hierarchy
- Makes current “blocks/single-color” feel significantly more polished without becoming noisy

## Implementation Notes

1. Build with CSS variables and 3 elevation levels.
2. Keep current DOM zones, but reframe as left rail + stage + right rail.
3. Add render diagnostics strip driven by existing timing hooks from performance phase.

