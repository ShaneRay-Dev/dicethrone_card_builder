# Installation & Setup Guide

## Quick Start

1. **Open the application**
   - Open `index.html` in a modern web browser
   - No installation or server required!

## Adding Custom Fonts

Your custom fonts can be added easily:

### Step 1: Convert Your Fonts
Make sure your fonts are in WOFF2 format (best) or WOFF format.

- TTF/OTF files? Use an online converter: https://transfonter.org/
- Keep file sizes small for faster loading

### Step 2: Place Font Files
1. Copy your font files to: `assets/fonts/`
   - Example: `assets/fonts/MyCustomFont.woff2`

### Step 3: Register the Font
1. Open `js/fonts.js`
2. Add your font to the fonts object:
   ```javascript
   this.fonts = {
     'Arial': 'Arial, sans-serif',
     'MyCustomFont': '"MyCustomFont", sans-serif',
     // Add more fonts here
   };
   ```

3. Optionally add @font-face in `css/styles.css`:
   ```css
   @font-face {
     font-family: 'MyCustomFont';
     src: url('../assets/fonts/MyCustomFont.woff2') format('woff2');
   }
   ```

That's it! Your font will now be available in the editor.

## Uploading Card Images

The image upload feature allows you to add custom art to your cards:

### Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 600x800px
- **Max file size**: 5MB

### How to Upload
1. In the left panel, go to **Card Art** section
2. Click the upload area or drag and drop an image
3. The image will instantly appear on your card preview
4. Click **Clear Image** to remove it

### Image Tips
- For best results, use vertical images (portrait orientation)
- Transparent PNGs work great for layered designs
- WebP format gives best compression for large files

## Saving Your Cards

### Auto-Save
- Your cards are automatically saved to browser storage every 30 seconds
- Refreshing the page will restore your last session

### Manual Save (JSON)
1. Click **Save** button in the header
2. A `.json` file will download
3. Use **Load** to restore the card later

### Export Options
Click **Export** to choose:
- **JSON** - Save card data
- **Image (PNG)** - Export as image file
- **Clipboard** - Copy JSON to clipboard

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---|---|
| Save | Ctrl+S | Cmd+S |
| Undo | Ctrl+Z | Cmd+Z |
| Redo | Ctrl+Shift+Z | Cmd+Shift+Z |

## Browser Compatibility

Works best in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Fonts not appearing?
1. Check that font files are in `assets/fonts/` folder
2. Verify filename matches exactly in `fonts.js`
3. Clear browser cache (Ctrl+Shift+Delete)

### Images not uploading?
1. Check file size (max 5MB)
2. Ensure file is a valid image (JPG, PNG, WebP)
3. Try a different image file

### Card data not saving?
1. Check if browser storage is enabled
2. Clear old browser data and refresh
3. Use JSON export/import as backup

## Storage Limits

- Browser storage: typically 5-10MB per site
- JSON files: very small (a few KB)
- Image data: depends on image size (usually stored efficiently)

Enjoy creating your custom Dice Throne cards!
