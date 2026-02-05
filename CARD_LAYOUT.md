# Card Layout Reference

## Visual Card Structure

Here's exactly how your Dice Throne cards are laid out:

```
╔════════════════════════════════╗
║      CHARACTER NAME            ║  ← Card Header
║      (UPPERCASE BOLD)          ║     18px font
╠════════════════════════════════╣
║                                ║
║      ⭕ HP BADGE               ║  ← Character Artwork Area
║  (Red Circle)                  ║     (Upload your art here)
║                                ║
║      CHARACTER ART             ║
║      (600x800px recommended)   ║
║                                ║
║                                ║
╠════════════════════════════════╣
║ ATK  DEF  SPD  RNG             ║  ← Stats Grid (4 columns)
║  7    6    4    1              ║     Compact stat boxes
╠════════════════════════════════╣
║  ABILITY                       ║  ← Ability Section
║  Strike twice if attack hits   ║     Description text
║  (max 3 lines)                 ║     Dark background
╠════════════════════════════════╣
║        COMMON                  ║  ← Rarity Badge
║  (Uncommon, Rare, Legendary)   ║
╚════════════════════════════════╝
```

## Layer Order

From bottom to top:
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

## Component Sizes

### Card Dimensions
- **Width**: 280px
- **Height**: 440px
- **Corner Radius**: 12px
- **Aspect Ratio**: Slightly taller than traditional playing cards

### Health Badge
- **Position**: Left side, over artwork
- **Shape**: Circle (50x50px)
- **Color**: Red (#DC3545)
- **Border**: White (2px)
- **Font Size**: 24px (number), 10px (label)

### Card Header
- **Height**: ~25px
- **Font Size**: 18px
- **Font Weight**: 700 (bold)
- **Text Transform**: UPPERCASE
- **Letter Spacing**: 0.5px

### Character Artwork
- **Height**: 120px minimum
- **Format**: Supports JPG, PNG, WebP
- **Recommended Size**: 600x800px
- **Best Ratio**: 3:4 (portrait)

### Stats Grid
- **Columns**: 4
- **Gap**: 4px between boxes
- **Each Box**: ~60px wide
- **Height**: ~45px
- **Font Size**: 16px (value), 9px (label)

### Ability Section
- **Max Lines**: 3 lines visible
- **Font Size**: 10px
- **Line Height**: 1.3
- **Background**: Transparent with 40% black overlay
- **Border**: 1px dashed white

### Rarity Badge
- **Position**: Bottom right
- **Font Size**: 11px
- **Font Weight**: 600
- **Text Transform**: UPPERCASE

## Color System

### Rarity Gradients

```
COMMON (Gray)
┌─────────────────┐
│ Gradient:       │
│ #808080 →       │
│ #696969         │
└─────────────────┘

UNCOMMON (Teal)
┌─────────────────┐
│ Gradient:       │
│ #4ecdc4 →       │
│ #3db8b0         │
└─────────────────┘

RARE (Purple)
┌─────────────────┐
│ Gradient:       │
│ #9b59b6 →       │
│ #8e44ad         │
└─────────────────┘

LEGENDARY (Gold)
┌─────────────────┐
│ Gradient:       │
│ #f39c12 →       │
│ #e67e22         │
└─────────────────┘
```

### Text Colors
- **Primary**: White (#FFFFFF)
- **Secondary**: Light Gray (with 60-90% opacity)
- **Shadow**: Black 2px offset
- **Badge Text**: White with text shadow

### Overlay Effects
- **Base**: 135° diagonal gradient
- **Inner Border**: 1px white with 10% opacity
- **Shine Effect**: Gradient overlay for depth

## Responsive Adjustments

### On Smaller Screens
- Card width: 240px
- Card height: 340px
- Header font: 16px
- Stat value font: 14px
- Overall scale: 85% of full size

## Animation & Effects

### Hover Effects
- Card lifts slightly (4px translateY)
- Shadow deepens
- Border glow increases
- Duration: 300ms ease

### Transitions
- All property changes: 300ms
- Easing: ease
- Smooth color changes
- Fluid stat updates

## Export Considerations

### PNG Export
- Resolution: 2x scale (560px × 880px)
- Transparent background: ✅ Supported
- Quality: Best with solid backgrounds
- File Size: ~50-150KB

### JSON Export
- All data embedded in single file
- Images as base64
- Fonts referenced by name
- Can be edited as text

## Printing Tips

### For Physical Cards
1. Export as PNG at 2x resolution
2. Print on 300 DPI glossy card stock
3. Use card dimensions: 2.5" × 3.5" (standard)
4. Laminate for durability
5. Add rounded corners with corner cutter

### Layout for Print
- Ensure 0.25" bleed margin
- Place important info away from edges
- Test print color accuracy
- Consider game table lighting

---

This layout is optimized for:
- ✅ Easy readability during gameplay
- ✅ Professional appearance
- ✅ Authentic Dice Throne style
- ✅ Responsive display on all devices
- ✅ Print-friendly format
