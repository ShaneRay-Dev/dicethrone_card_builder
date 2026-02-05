# Quick Reference - Custom Fonts & Images

## For Your Custom Fonts

You mentioned you have custom fonts ready! Here's how to add them:

### 1. Font Format
- **Best**: WOFF2 files (smallest, fastest)
- **Fallback**: WOFF files
- **Need to convert?** Use: https://transfonter.org/

### 2. Adding Fonts
1. Copy your font files to: `assets/fonts/` folder
   ```
   assets/fonts/
   ├── YourFont.woff2
   ├── AnotherFont.woff2
   └── README.md
   ```

2. Edit `js/fonts.js` and add your fonts:
   ```javascript
   this.fonts = {
     'Arial': 'Arial, sans-serif',
     'Your Font Name': '"Your Font Name", sans-serif',
     // Add your fonts here
   };
   ```

3. That's it! Fonts appear automatically in the card preview.

### 3. Using Fonts
- The font is applied to the card title and description
- Changes appear in real-time
- Fonts are saved with your card data

---

## Image Upload Features

### Upload Methods
1. **Click** the "Upload Image" button
2. **Drag & Drop** images onto the preview area
3. **Select** JPG, PNG, or WebP files

### Image Storage
- Images are stored as **base64** in your card data
- Automatically included when you save/export
- No separate image files needed!

### Requirements
- **Max size**: 5MB per image
- **Recommended**: 600x800px (portrait)
- **Formats**: JPG, PNG, WebP

### Tips
- Transparent PNGs great for layered designs
- Portrait orientation works best
- WebP format = smaller file sizes
- Auto-saves every 30 seconds

---

## File Structure
```
Dice throne Card Builder/
├── index.html              ← Open this in browser
├── js/
│   ├── fonts.js           ← Add custom fonts here
│   ├── state.js           ← Card data
│   ├── cardRenderer.js    ← Card display
│   ├── ui.js              ← Button handlers
│   └── app.js             ← Initialization
├── css/
│   ├── styles.css         ← Global styles
│   ├── editor-panel.css   ← Left panel
│   └── preview.css        ← Card preview
└── assets/
    └── fonts/             ← Your font files go here
```

---

## Next Steps

1. **Add your fonts**:
   - Copy .woff2 files to `assets/fonts/`
   - Update `js/fonts.js`

2. **Test the app**:
   - Open `index.html` in your browser
   - Try uploading an image
   - Create a card with your custom fonts

3. **Save your work**:
   - Click Save to download as JSON
   - Auto-saves to browser storage

That's all you need to get started! 🎲
