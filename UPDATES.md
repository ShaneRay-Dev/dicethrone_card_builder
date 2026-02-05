# Updates: Real Dice Throne Card Design

Based on the authentic Dice Throne card format, I've updated the card builder with the following improvements:

## 🎯 Card Layout Changes

### New Card Structure
```
┌─────────────────┐
│   Character     │
│      Name       │
├─────────────────┤
│                 │ 
│                 │
│   Character     │ ⭕ HP Badge
│      Art        │
│                 │
│                 │
├─────────────────┤
│ ATK  DEF  SPD RNG│
│  7    6    4   1 │
├─────────────────┤
│  Ability Text   │
│  (Description)  │
├─────────────────┤
│    Rarity       │
└─────────────────┘
```

## 📊 Updated Statistics

Removed "Cost" stat and added real Dice Throne stats:

| Before | After |
|--------|-------|
| Attack | Health (HP) ✅ |
| Defense | Attack (ATK) ✅ |
| Speed | Defense (DEF) ✅ |
| Cost ❌ | Speed (SPD) ✅ |
| | Range (RNG) ✅ |

### Health System
- **Range**: 1-20
- **Display**: Red circular badge on card left
- **Purpose**: Character's life points
- **Templates**: 3-6 HP by character type

### Range Stat
- **Range**: 0-5
- **Default**: Varies by character
- **Purpose**: Attack distance
- **Example**: Mage (3), Warrior (1)

## 🎨 Visual Improvements

### Health Badge
- Positioned on the left side of artwork
- Circular red badge with white border
- Shows HP prominently
- Easy to read during gameplay

### Card Sizing
- Increased height to 440px (was 400px)
- Better proportion for character art
- More space for ability text
- Matches real card dimensions

### Stat Display
- Smaller, more compact layout
- 4 stats instead of 5
- Better spacing
- Easier to read at a glance

### Typography
- Cleaner ability section
- Better text contrast
- Improved line spacing
- Professional card appearance

## 📥 File Updates

### Modified Files
- ✅ [index.html](index.html) - New card layout, health field, range field
- ✅ [js/state.js](js/state.js) - Updated stats object, templates
- ✅ [js/ui.js](js/ui.js) - Health and range input handlers
- ✅ [js/cardRenderer.js](js/cardRenderer.js) - Updated stat rendering
- ✅ [css/preview.css](css/preview.css) - New health badge, layout improvements

### New Documentation
- ✅ [DICE_THRONE_GUIDE.md](DICE_THRONE_GUIDE.md) - Complete design guide

## 🎮 Character Templates Updated

All four templates now use the new stat system:

```
WARRIOR          MAGE            ROGUE           HEALER
HP: 5            HP: 3           HP: 4           HP: 6
ATK: 7           ATK: 8          ATK: 6          ATK: 2
DEF: 6           DEF: 3          DEF: 4          DEF: 7
SPD: 4           SPD: 6          SPD: 8          SPD: 5
RNG: 1           RNG: 3          RNG: 2          RNG: 2
```

## 🔄 JSON Format

Cards now save with the new stat structure:

```json
{
  "name": "Shadow Dancer",
  "description": "Strike twice if attack hits",
  "stats": {
    "health": 4,
    "attack": 6,
    "defense": 4,
    "speed": 8,
    "range": 2
  }
}
```

## 🚀 Ready to Use

Everything is backwards compatible and ready to go:
1. Open [index.html](index.html) in your browser
2. Create a new card or edit existing ones
3. Upload your character artwork
4. Adjust the 5 key stats
5. Save as JSON or export as PNG

The card builder now accurately reflects the authentic Dice Throne game mechanics! 🎲
