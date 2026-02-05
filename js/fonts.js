// Font Management System
class FontManager {
  constructor() {
    this.fonts = {
      'Arial': 'Arial, sans-serif',
      'Georgia': 'Georgia, serif',
      'Courier New': '"Courier New", monospace',
      'DiceThrone': '"DiceThrone", sans-serif',
      'Comic Sans': '"Comic Sans MS", cursive',
      'Verdana': 'Verdana, sans-serif'
    };

    this.currentFont = 'Arial';
  }

  // Load custom font from file
  loadFont(fontName, fontPath) {
    const fontFace = new FontFace(fontName, `url('${fontPath}')`);
    fontFace.load().then((font) => {
      document.fonts.add(font);
      this.fonts[fontName] = fontName + ', sans-serif';
    }).catch((error) => {
      console.error(`Failed to load font ${fontName}:`, error);
    });
  }

  // Get all available fonts
  getAvailableFonts() {
    return Object.keys(this.fonts);
  }

  // Set active font
  setFont(fontName) {
    if (this.fonts[fontName]) {
      this.currentFont = fontName;
      this.applyFontToCard(fontName);
      return true;
    }
    return false;
  }

  // Apply font to card
  applyFontToCard(fontName) {
    const cardHeader = document.querySelector('.card-header h3');
    const cardDesc = document.querySelector('.card-description');
    if (cardHeader) cardHeader.style.fontFamily = this.fonts[fontName];
    if (cardDesc) cardDesc.style.fontFamily = this.fonts[fontName];
  }

  // Get current font
  getCurrentFont() {
    return this.currentFont;
  }

  // Get font family string
  getFontFamily(fontName) {
    return this.fonts[fontName] || this.fonts['Arial'];
  }
}

// Initialize font manager
const fontManager = new FontManager();
