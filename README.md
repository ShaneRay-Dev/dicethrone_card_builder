# Dice Throne Creator

A modern web-based tool for creating custom Dice Throne game cards with a live preview, customizable stats, and export capabilities.

## Features

- **Card Editor**: Easily customize card properties like name, description, stats, and rarity
- **Live Preview**: See your card design in real-time as you edit
- **Card Templates**: Quick-start with predefined templates (Warrior, Mage, Rogue, Healer)
- **Save & Load**: Export your cards as JSON files and reload them later
- **Export Options**:
  - Export as JSON (for saving and sharing)
  - Export as PNG image
  - Copy JSON to clipboard
- **Auto-save**: Your work is automatically saved to browser storage every 30 seconds
- **Undo/Redo**: Use Ctrl+Z (Cmd+Z on Mac) to undo and Ctrl+Shift+Z to redo

## Project Structure

```
Dice throne Card Builder/
├── index.html              # Main entry point
├── css/
│   ├── styles.css         # Global styles and layout
│   ├── editor-panel.css   # Left panel styles
│   └── preview.css        # Card preview styles
├── js/
│   ├── state.js           # State management and card data
│   ├── cardRenderer.js    # Card rendering logic
│   ├── ui.js              # UI event handlers
│   └── app.js             # App initialization
├── assets/
│   ├── images/            # Card art and decorative elements
│   ├── fonts/             # Custom fonts
│   └── data/              # Sample cards and templates
└── README.md              # This file
```

## Getting Started

1. Open `index.html` in a modern web browser
2. Start creating your custom card using the editor panel on the left
3. Watch your card design update in real-time on the right
4. Use templates for quick-start designs
5. Save your card when you're happy with it

## Card Properties

### Basic Properties
- **Name**: Card name (max 50 characters)
- **Description**: Card description (max 200 characters)
- **Color**: Choose a base color for the card
- **Rarity**: Select from Common, Uncommon, Rare, or Legendary

### Stats
- **Attack**: Attack power (0-10)
- **Defense**: Defense value (0-10)
- **Speed**: Speed stat (0-10)
- **Cost**: Mana/resource cost (0-10)

## Keyboard Shortcuts

- `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac): Save card
- `Ctrl+Z` (Windows/Linux) or `Cmd+Z` (Mac): Undo
- `Ctrl+Shift+Z` (Windows/Linux) or `Cmd+Shift+Z` (Mac): Redo

## Future Enhancements

- [ ] Image upload for card art
- [ ] Advanced color schemes and gradients
- [ ] Card set management
- [ ] Collaboration features
- [ ] Card printing support
- [ ] Custom fonts and text effects

## Browser Compatibility

Works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is open source and available for personal and commercial use.
