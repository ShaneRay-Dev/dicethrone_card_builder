# Dice Throne Creator

A web-based tool for creating custom Dice Throne-style cards with a live preview, layered art, and high-resolution export.

## Features

- **Card Editor**: Customize card type, phase, name, description, and cost badge
- **Live Preview**: See your card design update in real time
- **Layer Controls**: Toggle each visual layer on/off
- **Art Controls**: Upload art, choose default art, move/scale art in the preview
- **Save & Load**: Export your cards as JSON files and reload them later
- **Export Options**:
  - Export as JSON (for saving and sharing)
  - Export as PNG image (600 DPI)
  - Copy JSON to clipboard
- **Auto-save**: Your work is saved to browser storage every 30 seconds
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
│   ├── cardRenderer.js    # Rendering logic and export
│   ├── ui.js              # UI event handlers
│   └── app.js             # App initialization
├── Assets/
│   ├── images/            # Card art and decorative elements
│   ├── fonts/             # Custom fonts
│   └── data/              # Sample cards and templates
└── README.md              # This file
```

## Getting Started

1. Open `index.html` in a modern web browser
2. Start creating your custom card using the editor panel on the left
3. Watch your card design update in real-time on the right
4. Save your card when you're happy with it

## Card Properties

### Basic Properties
- **Name**: Card name (max 50 characters)
- **Description**: Card description (max 200 characters)
- **Card Type / Phase**: Action cards and phases
- **Cost Badge**: 0-5 selection

## Keyboard Shortcuts

- `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac): Save card
- `Ctrl+Z` (Windows/Linux) or `Cmd+Z` (Mac): Undo
- `Ctrl+Shift+Z` (Windows/Linux) or `Cmd+Shift+Z` (Mac): Redo

## Future Enhancements

- [ ] Advanced text styling and effects
- [ ] Card set management
- [ ] Collaboration features

## Browser Compatibility

Works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is open source and available for personal and commercial use.
