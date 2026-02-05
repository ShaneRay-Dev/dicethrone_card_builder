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
      name: 'Card Name',
      description: 'Card description goes here',
      artUrl: null,
      artData: null, // Base64 encoded image
      artTransform: { x: 0, y: 0, scale: 1 },
      artCropToFrame: false,
      titlePosition: { x: 0, y: 0 },
      cardTextPosition: { x: 0, y: 0 },
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
        border: true,
        titleBar: true,
        panelUpper: true,
        titleText: true,
        artwork: true,
        bottomText: true,
        panelLower: true,
        costBadge: true,
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

  // Apply template
  applyTemplate(templateName) {
    const templates = {
      warrior: {
        name: 'Warrior',
        description: 'A powerful warrior with high attack and defense.',
        color: '#ff6b6b',
        rarity: 'Common',
        stats: { health: 5, attack: 7, defense: 6, speed: 4, range: 1 }
      },
      mage: {
        name: 'Mage',
        description: 'A wise mage that deals magical damage.',
        color: '#9b59b6',
        rarity: 'Rare',
        stats: { health: 3, attack: 8, defense: 3, speed: 6, range: 3 }
      },
      rogue: {
        name: 'Rogue',
        description: 'A swift rogue that strikes with precision.',
        color: '#4ecdc4',
        rarity: 'Uncommon',
        stats: { health: 4, attack: 6, defense: 4, speed: 8, range: 2 }
      },
      healer: {
        name: 'Healer',
        description: 'A holy healer that mends wounds.',
        color: '#f39c12',
        rarity: 'Rare',
        stats: { health: 6, attack: 2, defense: 7, speed: 5, range: 2 }
      }
    };

    const template = templates[templateName];
    if (template) {
      this.updateProperties({
        name: template.name,
        description: template.description,
        color: template.color,
        rarity: template.rarity,
        'stats.health': template.stats.health,
        'stats.attack': template.stats.attack,
        'stats.defense': template.stats.defense,
        'stats.speed': template.stats.speed,
        'stats.range': template.stats.range,
        theme: templateName
      });
    }
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
