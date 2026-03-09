# Mockup B: Studio Light

Goal: clean, modern, approachable interface that still feels production-grade.

## Design Direction

- Style: product studio + design app
- Mood: minimal, crisp, high legibility
- Best for: creators who want less visual noise and fast onboarding

## Layout Structure

```
+--------------------------------------------------------------------------------------+
| Header: Project Name | Card Type | Search | Save | Export | Share                    |
+--------------------------------------------------------------------------------------+
| Left Panel                      | Center Canvas Stage             | Right Properties   |
| - Templates                     | - Card preview                 | - Selected layer   |
| - Assets browser                | - Zoom controls               | - Position/size    |
| - Commands/macros               | - Snap guides                 | - Typography       |
| - References                    | - Compare mode                | - Color/effects    |
+---------------------------------+-------------------------------+--------------------+
| Context Toolbar: mode controls, quick presets, undo/redo, recent actions            |
+--------------------------------------------------------------------------------------+
```

## Visual Tokens

- Page background: `#F4F7FB`
- Surface: `#FFFFFF`
- Surface alt: `#EEF3FA`
- Primary accent: `#0A84FF`
- Success accent: `#1FA971`
- Warning accent: `#D48A00`
- Border: `#D8E1EE`
- Text primary: `#152238`
- Text secondary: `#50627D`

## Typography

- Headings: `Manrope Bold`
- Body/UI: `Source Sans 3`
- Numeric fields: `IBM Plex Mono`

## Interaction Style

- White-card surfaces with subtle elevation and tight spacing rhythm
- Focus state uses 2px accent ring and no heavy shadows
- Property panel groups use collapsible sections with sticky section headers
- Inline help appears as compact tooltips, not persistent helper text

## Why This Works

- Feels immediately professional while remaining easy to read for long sessions
- Supports dense controls without overwhelming the user
- Strong contrast and spacing improve form accuracy and reduce misclicks

## Implementation Notes

1. Introduce a light theme token set with CSS variables.
2. Replace hard borders with consistent radius + elevation rules.
3. Keep existing feature set and only shift composition/visual system first.
