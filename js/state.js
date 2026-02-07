// State Management
class CardState {
  constructor() {
    this.card = this.getDefaultCard();
    this.history = [JSON.parse(JSON.stringify(this.card))];
    this.historyIndex = 0;
  }

  getDefaultCard() {
    return {
      cardType: 'Action Cards',
      cardSubType: 'Main Phase',
      name: 'Title',
      description: 'place holder',
      artUrl: null,
      artData: null, // Base64 encoded image
      artTransform: { x: 0, y: 0, scale: 1 },
      artCropToFrame: false,
      titlePosition: { x: 0, y: 0 },
      descriptionPosition: { x: 0, y: 0 },
      export: {
        includeBleed: true
      },
      bleed: {
        enabled: false,
        color: '#ffffff'
      },
      layers: {
        bleed: true,
        backgroundLower: true,
        backgroundUpper: true,
        imageFrame: true,
        frameShading: true,
        border: true,
        titleBar: true,
        panelUpper: true,
        titleText: true,
        artwork: true,
        panelBleed: true,
        bottomText: true,
        panelLower: true,
        costBadge: true,
        attackModifier: true,
        cardText: true
      },
      theme: 'warrior',
      font: 'Arial',
      costBadge: {
        value: 0
      }
    };
  }

  // Update card properties
  updateProperty(key, value) {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      this.card[parent][child] = value;
    } else {
      this.card[key] = value;
    }
    this.addToHistory();
  }

  // Batch update properties
  updateProperties(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        this.card[parent][child] = value;
      } else {
        this.card[key] = value;
      }
    });
    this.addToHistory();
  }

  // Get current card state
  getCard() {
    return JSON.parse(JSON.stringify(this.card));
  }

  // History management
  addToHistory() {
    // Remove any history after current index (for redo)
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(JSON.parse(JSON.stringify(this.card)));
    this.historyIndex = this.history.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.card = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.card = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      return true;
    }
    return false;
  }

  // Save to JSON
  toJSON() {
    return JSON.stringify(this.card, null, 2);
  }

  // Load from JSON
  fromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.card = { ...this.getDefaultCard(), ...data };
      this.addToHistory();
      return true;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return false;
    }
  }

  // Reset to default
  reset() {
    this.card = this.getDefaultCard();
    this.history = [JSON.parse(JSON.stringify(this.card))];
    this.historyIndex = 0;
  }
}

// Export for use in other files
const gameState = new CardState();
