# Dice Throne Card Design Guide

This Dice Throne Creator is now designed to match the authentic Dice Throne card game style!

## Card Anatomy

Your card preview is divided into these sections:

### 1. **Card Header**
- Character/card name at the top
- Bold, uppercase lettering
- Visible in all conditions

### 2. **Character Artwork (Main Focus)**
- Large central image area
- Portrait orientation recommended (600x800px)
- Shows your custom uploaded art
- Takes up most of the card space

### 3. **Health Badge (HP)**
- Red circular badge on the left side
- Shows health/life points
- Prominent and easy to read during gameplay
- Values: 1-20 (typical range)

### 4. **Stats Grid (Bottom)**
Four key statistics:
- **ATK** (Attack): Offensive power (0-10)
- **DEF** (Defense): Defensive capability (0-10)
- **SPD** (Speed): Turn order value (0-10)
- **RNG** (Range): Attack distance (0-5)

### 5. **Ability/Description**
- Special power or ability text
- Appears below the stats
- Describes what makes this character unique

### 6. **Rarity Badge (Footer)**
- Common, Uncommon, Rare, or Legendary
- Affects card color gradient
- Shows card power level

## Card Properties

### Basic Information
| Property | Purpose | Limit |
|----------|---------|-------|
| Name | Character name | 50 chars |
| Description | Special ability text | 200 chars |
| Rarity | Power level | 4 options |
| Color | Card base color | Any color |

### Character Statistics
| Stat | Range | Purpose |
|------|-------|---------|
| Health (HP) | 1-20 | Life points before elimination |
| Attack (ATK) | 0-10 | Damage dealt to opponents |
| Defense (DEF) | 0-10 | Damage reduction capability |
| Speed (SPD) | 0-10 | Turn order (higher = faster) |
| Range (RNG) | 0-5 | Distance for attacks |

## Card Templates

Quick-start templates with balanced stats:

### Warrior 🛡️
- **HP**: 5
- **ATK**: 7 (High attack)
- **DEF**: 6 (Strong defense)
- **SPD**: 4 (Slow)
- **RNG**: 1 (Close combat)
- **Best for**: Tank/melee fighter

### Mage 🔮
- **HP**: 3 (Low health)
- **ATK**: 8 (Very high attack)
- **DEF**: 3 (Fragile)
- **SPD**: 6 (Fast)
- **RNG**: 3 (Long range)
- **Best for**: Glass cannon/ranged

### Rogue 🗡️
- **HP**: 4
- **ATK**: 6
- **DEF**: 4
- **SPD**: 8 (Fastest)
- **RNG**: 2 (Medium range)
- **Best for**: Agile striker

### Healer ❤️
- **HP**: 6 (Highest health)
- **ATK**: 2 (Low damage)
- **DEF**: 7 (High defense)
- **SPD**: 5 (Medium)
- **RNG**: 2 (Medium range)
- **Best for**: Support/tank

## Rarity & Colors

Colors affect the card's visual appearance:

- **Common** (Gray): Basic characters
- **Uncommon** (Teal): Improved characters
- **Rare** (Purple): Powerful characters
- **Legendary** (Gold): Best characters

## Design Tips

### For Balance
1. **High ATK** → Lower DEF and HP
2. **High DEF** → Lower ATK
3. **High SPD** → Lower HP and DEF
4. **High HP** → Lower ATK

### For Visual Appeal
1. Use high-contrast artwork
2. Portrait orientation images look best
3. Keep descriptions concise
4. Use uppercase for names

### For Gameplay
1. Consider the role (Warrior, Mage, etc.)
2. Balance offensive and defensive stats
3. Speed affects turn order
4. Range defines playstyle

## File Structure in JSON

When you save a card, it includes:
```json
{
  "name": "Card Name",
  "description": "Ability description",
  "color": "#ff6b6b",
  "rarity": "Common",
  "stats": {
    "health": 5,
    "attack": 7,
    "defense": 6,
    "speed": 4,
    "range": 1
  },
  "artData": "base64-encoded-image",
  "theme": "warrior",
  "font": "Arial"
}
```

The `artData` field contains your image as base64, so it's all in one file!

## Example: Creating a Rogue Character

1. Start with **Rogue template** (fast, agile)
2. Upload an **action-packed artwork** (sharp, dynamic)
3. Name it something cool: **"Shadow Dancer"**
4. Adjust stats:
   - Keep SPD at 8 (need speed advantage)
   - Boost ATK to 7 (add more power)
   - Lower DEF to 3 (fragile fighter)
   - Reduce HP to 3
5. Write ability: **"Strike twice if attack hits"**
6. Save and use in your game!

---

Have fun creating your Dice Throne characters! 🎲✨
