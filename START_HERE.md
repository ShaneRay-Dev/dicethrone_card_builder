# 🎲 Dice Throne Creator - Complete & Ready!

Your custom Dice Throne card builder is now fully updated to match the authentic game design!

## ✨ What's New

### Authentic Card Layout
- **Health Badge** (HP): Red circular badge showing life points
- **Character Artwork**: Large centered image area (upload your art)
- **5 Core Stats**: Health, Attack, Defense, Speed, Range
- **Ability Section**: Text area for special powers
- **Rarity System**: 4 levels with unique color gradients

### Features
✅ Real-time preview of your cards  
✅ Upload custom character artwork  
✅ Custom font support (add your fonts to assets/fonts/)  
✅ Save/load cards as JSON  
✅ Export as PNG image  
✅ Auto-saves every 30 seconds  
✅ Undo/Redo support (Ctrl+Z, Ctrl+Shift+Z)  
✅ Pre-made templates (Warrior, Mage, Rogue, Healer)  

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| [README.md](README.md) | Quick start & features overview |
| [INSTALLATION.md](INSTALLATION.md) | Setup guide & troubleshooting |
| [DICE_THRONE_GUIDE.md](DICE_THRONE_GUIDE.md) | Card design & game mechanics |
| [FONTS_IMAGES_GUIDE.md](FONTS_IMAGES_GUIDE.md) | Custom fonts & image upload |
| [UPDATES.md](UPDATES.md) | What changed & improvements |

## 🚀 Quick Start

1. **Open the app**
   - Just open `index.html` in your web browser
   - No installation needed!

2. **Add your fonts**
   - Copy `.woff2` files to `assets/fonts/`
   - Update `js/fonts.js` with font names
   - Refresh browser to see them

3. **Create a card**
   - Choose a template (Warrior, Mage, etc.)
   - Upload character artwork
   - Adjust stats to match your character
   - Save when done

4. **Export your card**
   - Save as JSON for later editing
   - Export as PNG to share or print

## 📁 Project Structure

```
Dice throne Card Builder/
├── 📄 index.html              ← Open this!
├── 📂 css/
│   ├── styles.css
│   ├── editor-panel.css
│   └── preview.css
├── 📂 js/
│   ├── app.js
│   ├── state.js
│   ├── cardRenderer.js
│   ├── ui.js
│   └── fonts.js
├── 📂 assets/
│   └── fonts/                 ← Put your fonts here
├── 📄 README.md
├── 📄 INSTALLATION.md
├── 📄 DICE_THRONE_GUIDE.md
├── 📄 FONTS_IMAGES_GUIDE.md
└── 📄 UPDATES.md
```

## 🎮 Card Statistics

### Health (HP)
- Range: 1-20
- Shows on red badge
- Typical: 3-6 for most characters

### Attack (ATK)
- Range: 0-10
- Damage dealt
- High = damage dealer

### Defense (DEF)
- Range: 0-10
- Damage reduction
- High = tank/protector

### Speed (SPD)
- Range: 0-10
- Turn order (higher = faster)
- Affects gameplay tempo

### Range (RNG)
- Range: 0-5
- Attack distance
- 1 = close, 3+ = ranged

## 🎨 Character Templates

### ⚔️ Warrior
Strong melee fighter with balanced stats
- HP: 5, ATK: 7, DEF: 6, SPD: 4, RNG: 1

### 🔮 Mage
Glass cannon with high damage and range
- HP: 3, ATK: 8, DEF: 3, SPD: 6, RNG: 3

### 🗡️ Rogue
Fast and agile striker
- HP: 4, ATK: 6, DEF: 4, SPD: 8, RNG: 2

### ❤️ Healer
Support character with high defense
- HP: 6, ATK: 2, DEF: 7, SPD: 5, RNG: 2

## 💾 Save & Load

### Auto-Save
Cards save automatically to browser storage every 30 seconds

### Manual Save (JSON)
1. Click **Save** button
2. `.json` file downloads
3. Keep it safe for later edits

### Load Previously Saved Card
1. Click **Load** button
2. Select your `.json` file
3. Card restores with all data

### Image Storage
Images are embedded in the JSON file as base64, so everything is in one file!

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save Card | Ctrl+S / Cmd+S |
| Undo | Ctrl+Z / Cmd+Z |
| Redo | Ctrl+Shift+Z / Cmd+Shift+Z |

## 🎯 Next Steps

1. **Add your fonts** (if you have custom ones)
   - See [FONTS_IMAGES_GUIDE.md](FONTS_IMAGES_GUIDE.md)

2. **Start creating!**
   - Open `index.html`
   - Try uploading some artwork
   - Create your first character

3. **Customize everything**
   - Adjust colors in CSS files
   - Add more templates in `state.js`
   - Extend stats if needed

## 🔧 Customization

Want to modify the card builder?

- **Add more stats**: Edit [js/state.js](js/state.js)
- **Change colors**: Edit [css/preview.css](css/preview.css)
- **Add fonts**: Edit [js/fonts.js](js/fonts.js)
- **Create templates**: Edit template section in [js/state.js](js/state.js)

All files are well-commented and easy to modify!

## 📞 Support

Got questions? Check these docs:

- **How to add fonts?** → [FONTS_IMAGES_GUIDE.md](FONTS_IMAGES_GUIDE.md)
- **How to upload images?** → [FONTS_IMAGES_GUIDE.md](FONTS_IMAGES_GUIDE.md)
- **Understanding stats?** → [DICE_THRONE_GUIDE.md](DICE_THRONE_GUIDE.md)
- **Troubleshooting?** → [INSTALLATION.md](INSTALLATION.md)

---

## 🎲 You're all set!

Your Dice Throne Creator is ready to use. Have fun making amazing character cards! 

**Start here:** Open `index.html` in your browser! 🚀
