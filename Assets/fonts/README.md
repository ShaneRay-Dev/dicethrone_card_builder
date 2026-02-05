# Custom Fonts Directory

This folder contains custom fonts for the Dice Throne Creator.

## Supported Formats

- **WOFF2** (recommended - best compression)
- **WOFF** (fallback)
- **TTF** (will need conversion)
- **OTF** (will need conversion)

## How to Add Your Custom Fonts

1. **Place your font files in this directory**
   - Examples: `DiceThrone.woff2`, `HighFantasy.woff2`, etc.

2. **Update the fonts.js file** with your new fonts
   ```javascript
   this.fonts = {
     'Arial': 'Arial, sans-serif',
     'Your Font Name': '"Your Font Name", sans-serif',
     // Add more fonts here
   };
   ```

3. **If using WOFF/WOFF2 files, add to styles.css** (optional, for web fonts)
   ```css
   @font-face {
     font-family: 'Your Font Name';
     src: url('../assets/fonts/YourFont.woff2') format('woff2'),
          url('../assets/fonts/YourFont.woff') format('woff');
   }
   ```

## Converting Fonts

If you only have TTF or OTF files, convert them to WOFF2 format:

### Using Online Tools
- https://convertio.co/ttf-woff2/
- https://transfonter.org/

### Using Command Line (FontTools)
```bash
pip install fonttools zopfli
fonttools ttLib.woff2 --flavor=woff2 your-font.ttf
```

## Example

If you have a font file named `PixelMaster.woff2`:

1. Copy it to this folder: `assets/fonts/PixelMaster.woff2`

2. Add to fonts.js:
   ```javascript
   this.fonts = {
     'Arial': 'Arial, sans-serif',
     'PixelMaster': '"PixelMaster", monospace',
   };
   ```

3. The font will be available for selection in the card editor!

## Font Licensing

Make sure you have the proper licenses to use any custom fonts. Some fonts may require attribution.
