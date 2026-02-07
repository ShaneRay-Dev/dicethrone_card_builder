# Dice Throne Card Design Guide

This guide covers the current layout and workflow in the builder.

## Card Anatomy (Preview)

1. Card title (editable text)
2. Artwork window (drag + zoom)
3. Panels (upper and lower)
4. Cost badge (optional layer)
5. Card description (editable text)

## Layer Order (Bottom to Top)

- Bleed
- Artwork
- Background Lower
- Background Upper
- Image Frame
- Frame
- Panel Lower
- Panel Upper
- Cost Badge
- Title
- Card Text

## Art Workflow

- Upload or select default art.
- Click the art to activate it.
- Drag to reposition and use the mouse wheel to scale.
- Use the Crop Art To Frame button to mask the art to the window.

## Export

- PNG export is set to 600 DPI.
- Use the bleed toggle for print-safe exports.

## JSON Fields (Key Ones)

- `name`, `description`
- `cardType`, `cardSubType`
- `artData`, `artUrl`, `artTransform`
- `layers` (per-layer visibility)
- `costBadge.value`
