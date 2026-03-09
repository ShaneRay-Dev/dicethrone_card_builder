// UI Event Handlers
const DTC_UI_COMMON = window.DTC_COMMON || {};
const deepCloneUI = DTC_UI_COMMON.deepClone || ((value) => JSON.parse(JSON.stringify(value)));
const DTC_UI_EXPORT_SIZE = DTC_UI_COMMON.EXPORT_CARD_SIZE || { width: 675, height: 1050 };

class UI {
  constructor() {
    this.cardNameInput = document.getElementById('cardName');
    this.cardIdInput = document.getElementById('cardIdInput');
    this.descriptionToolbar = document.getElementById('descriptionToolbar');
    this.descriptionEditor = document.getElementById('descriptionEditor');
    this.descriptionQuill = null;
    this.suppressDescriptionUpdate = false;
    this.lastDescriptionSelection = null;
    this.activeTitleId = null;
    this.titleIdCounter = 0;
    this.activeDescriptionId = null;
    this.descriptionIdCounter = 0;
    this.fontOptions = [];
    this.fontIdMap = new Map();
    this.fontIdToFamily = new Map();
    this.cardIdFontSizeInput = document.getElementById('cardIdFontSize');
    this.cardIdFontSizeValue = document.getElementById('cardIdFontSizeValue');
    this.cardIdPositionXInput = document.getElementById('cardIdPositionX');
    this.cardIdPositionXValue = document.getElementById('cardIdPositionXValue');
    this.cardIdPositionYInput = document.getElementById('cardIdPositionY');
    this.cardIdPositionYValue = document.getElementById('cardIdPositionYValue');
    this.titleFontSelect = document.getElementById('titleFontSelect');
    this.descriptionFontSelect = document.getElementById('descriptionFontSelect');
    this.titleFontSizeInput = document.getElementById('titleFontSize');
    this.descriptionFontSizeInput = document.getElementById('descriptionFontSize');
    this.descriptionLineHeightInput = document.getElementById('descriptionLineHeight');
    this.descriptionLineHeightValue = document.getElementById('descriptionLineHeightValue');
    this.descriptionBaselineOffsetInput = document.getElementById('descriptionBaselineOffset');
    this.descriptionBaselineOffsetValue = document.getElementById('descriptionBaselineOffsetValue');
    this.abilityDiceSelect = document.getElementById('abilityDiceSelect');
    this.abilityDiceAddBtn = document.getElementById('abilityDiceAddBtn');
    this.abilityDiceList = document.getElementById('abilityDiceList');
    this.defaultDiceColorInput = document.getElementById('defaultDiceColor');
    this.defaultDiceColorPicker = document.getElementById('defaultDiceColorPicker');
    this.customStatusNameInput = document.getElementById('customStatusNameInput');
    this.customStatusAddBtn = document.getElementById('customStatusAddBtn');
    this.customStatusList = document.getElementById('customStatusList');
    this.descriptionBoxScaleInput = document.getElementById('descriptionBoxScale');
    this.descriptionBoxScaleValue = document.getElementById('descriptionBoxScaleValue');
    this.titleLetterSpacingInput = document.getElementById('titleLetterSpacing');
    this.descriptionLetterSpacingInput = document.getElementById('descriptionLetterSpacing');
    this.titleLetterSpacingValue = document.getElementById('titleLetterSpacingValue');
    this.descriptionLetterSpacingValue = document.getElementById('descriptionLetterSpacingValue');
    this.titleBoxAddBtn = document.getElementById('titleBoxAdd');
    this.titleBoxRemoveBtn = document.getElementById('titleBoxRemove');
    this.abilityDiceSection = document.getElementById('abilityDiceSection');
    this.defaultTitleFont = 'PHOSPHATE_FIXED_SOLID';
    this.defaultDescriptionFont = 'MYRIADPRO-BOLDCOND';
    this.defaultTitleFontSize = 46;
    this.defaultDescriptionFontSize = 39;
    this.defaultLeafletDescriptionFontSize = 20;
    this.defaultDescriptionLineHeight = 1.2;
    this.defaultDescriptionBaselineOffset = -1;
    this.defaultTitleLetterSpacing = 0.5;
    this.defaultDescriptionLetterSpacing = 0;
    this.defaultDescriptionBoxScale = 1;
    this.defaultDescriptionColor = '#ffffff';
    this.defaultDiceColor = '#33ccff';
    this.descriptionColorPicker = null;
    this.descriptionColorHexInput = null;
    this.descriptionColorCopyButton = null;
    this.defaultCardIdFont = 'MYRIADPRO-REGULAR';
    this.defaultCardIdFontSize = 15;
    this.defaultCardIdOffset = 0;
    this.defaultCardIdOffsetX = -3.5;
    this.cardTypeSelect = document.getElementById('cardType');
    this.cardSubTypeSelect = document.getElementById('cardSubType');
    this.costInput = document.getElementById('costInput');
    this.cardTypeGroup = document.getElementById('cardTypeGroup');
    this.cardSubTypeGroup = document.getElementById('cardSubTypeGroup');
    this.costBadgeGroup = document.getElementById('costBadgeGroup');
    this.cardIdSection = document.getElementById('cardIdSection');
    this.cardPropertiesSummary = document.getElementById('cardPropertiesSummary');
    this.cardLayersSection = document.getElementById('cardLayersSection');
    this.descriptionLineHeightGroup = document.getElementById('descriptionLineHeightGroup');
    this.descriptionLetterSpacingGroup = document.getElementById('descriptionLetterSpacingGroup');
    this.descriptionBaselineOffsetGroup = document.getElementById('descriptionBaselineOffsetGroup');
    this.leafletLayerBackground = document.getElementById('leafletLayerBackground');
    this.leafletLayerArt = document.getElementById('leafletLayerArt');
    this.leafletLayerTitle = document.getElementById('leafletLayerTitle');
    this.leafletLayerText = document.getElementById('leafletLayerText');
    this.leafletBreakAddBtn = document.getElementById('leafletBreakAddBtn');
    this.leafletBreakList = document.getElementById('leafletBreakList');
    this.leafletBreakOptions = this.buildLeafletBreakOptions();
    this.boardSlotSelects = Array.from({ length: 8 }, (_, index) => document.getElementById(`boardSlot${index + 1}`));
    this.boardSlotCards = Array.from(document.querySelectorAll('.board-slot-card'));
    this.boardSlotRenderToken = 0;

    this.imageUploadInput = document.getElementById('imageUpload');
    this.artSectionTitle = document.getElementById('artSectionTitle');
    this.imageUploadLabel = document.getElementById('imageUploadLabel');
    this.artUploadHelpText = document.getElementById('artUploadHelpText');
    this.imagePreview = document.getElementById('imagePreview');
    this.btnClearImage = document.getElementById('btn-clear-image');
    this.artSelect = document.getElementById('artSelect');
    this.toggleCropperOnUpload = document.getElementById('toggleCropperOnUpload');
    this.cropModal = document.getElementById('cropModal');
    this.cropArea = document.getElementById('cropArea');
    this.cropImage = document.getElementById('cropImage');
    this.cropPreviewImage = document.getElementById('cropPreviewImage');
    this.cropFrameOverlay = document.getElementById('cropFrameOverlay');
    this.cropZoomInput = document.getElementById('cropZoom');
    this.cropPreviewBtn = document.getElementById('cropPreviewBtn');
    this.cropApplyBtn = document.getElementById('cropApplyBtn');
    this.cropCloseBtn = document.getElementById('cropCloseBtn');
    this.cropperOnUploadKey = 'dtc_cropper_on_upload_v1';
    this.cropMaskSelect = document.getElementById('cropMaskSelect');
    this.cropMaskKey = 'dtc_crop_mask_v1';
    this.defaultCropMask = 'Assets/images/Card Art/Common Loot.png';
    this.leafletCropMask = 'Assets/Leaflet/Front/Leaflet_front_background.png';
    this.cardModeCropMask = null;
    this.cropState = {
      x: 0,
      y: 0,
      scale: 1,
      scaleFactor: 1
    };
    this.cropDragState = null;
    this.cropPreviewActive = false;

    this.referenceImageInput = document.getElementById('referenceImage');
    this.referenceImageLabel = document.getElementById('referenceImageLabel');
    this.referencePreview = document.getElementById('referencePreview');
    this.referenceSelect = document.getElementById('referenceSelect');
    this.showReferenceCheckbox = document.getElementById('showReference');
    this.showReferenceSideBySideCheckbox = document.getElementById('showReferenceSideBySide');
    this.referenceOverlay = document.getElementById('referenceOverlay');
    this.referenceSide = document.getElementById('referenceSide');
    this.referenceOpacity = document.getElementById('referenceOpacity');

    this.toggleExportBleed = document.getElementById('toggleExportBleed');

    this.toggleBackgroundLower = document.getElementById('toggleBackgroundLower');
    this.toggleBackgroundUpper = document.getElementById('toggleBackgroundUpper');
    this.toggleImageFrame = document.getElementById('toggleImageFrame');
    this.toggleFrameShading = document.getElementById('toggleFrameShading');
    this.toggleCardBleed = document.getElementById('toggleCardBleed');
    this.toggleBorder = document.getElementById('toggleBorder');
    this.toggleCardId = document.getElementById('toggleCardId');
    this.toggleTitleBar = document.getElementById('toggleTitleBar');
    this.toggleTitleText = document.getElementById('toggleTitleText');
    this.toggleArtwork = document.getElementById('toggleArtwork');
    this.togglePanelBleed = document.getElementById('togglePanelBleed');
    this.toggleBottomText = document.getElementById('toggleBottomText');
    this.toggleSecondAbilityFrame = document.getElementById('toggleSecondAbilityFrame');
    this.toggleTopNameGradient = document.getElementById('toggleTopNameGradient');
    this.toggleBottomNameGradient = document.getElementById('toggleBottomNameGradient');
    this.toggleCostBadge = document.getElementById('toggleCostBadge');
    this.toggleAttackModifier = document.getElementById('toggleAttackModifier');
    this.toggleCardText = document.getElementById('toggleCardText');
    this.layerList = document.getElementById('layerList');
    this.showHiddenLayersToggle = document.getElementById('toggleShowHiddenLayers');
    this.showHiddenLayersKey = 'dtc_show_hidden_layers_v1';

    this.cardTitleEl = document.getElementById('cardTitleBar');
    this.artworkLayer = document.getElementById('artworkLayer');
    this.artImage = document.getElementById('cardArtImage');
    this.descriptionImageLayer = document.getElementById('descriptionImageLayer');
    this.costBadgeLayer = document.getElementById('costBadgeLayer');

    this.previewContainer = document.querySelector('.preview-container');
    this.previewElement = document.getElementById('cardPreview');
    this.panelLowerLayer = document.getElementById('panelLowerLayer');
    this.containerEl = document.querySelector('.container');
    this.workspaceTabs = [...document.querySelectorAll('.workspace-tab')];
    this.workspacePanels = {
      shared: [...document.querySelectorAll('[data-tool-panel="card-settings"], [data-tool-panel="card-render"], [data-tool-panel="card-render-controls"]')],
      leaflet: [...document.querySelectorAll('[data-tool-panel="leaflet-settings"]')],
      board: [...document.querySelectorAll('[data-tool-panel="board-settings"], [data-tool-panel="board-render"]')]
    };
    this.workspaceModeStorageKey = 'dtc_workspace_mode_v1';
    this.workspaceMode = this.getStoredWorkspaceMode();
    this.sidebarResizer = document.getElementById('sidebarResizer');
    this.sidebarWidthKey = 'dtc_sidebar_width_v1';
    this.leafletSideSelect = document.getElementById('leafletSide');
    this.cardModeReferencePath = 'Assets/Reference/missed_me_II.png';
    this.leafletModeReferencePath = 'Assets/Reference/spiderman_leaflet.png';

    const ReferenceManagerCtor = window.ReferenceOverlayManager;
    this.referenceManager = ReferenceManagerCtor ? new ReferenceManagerCtor({
      referenceImageInput: this.referenceImageInput,
      referencePreview: this.referencePreview,
      referenceSelect: this.referenceSelect,
      showReferenceCheckbox: this.showReferenceCheckbox,
      showReferenceSideBySideCheckbox: this.showReferenceSideBySideCheckbox,
      referenceOverlay: this.referenceOverlay,
      referenceSide: this.referenceSide,
      referenceOpacity: this.referenceOpacity,
      previewContainer: this.previewContainer,
      manifestPath: 'Assets/Reference/manifest.json',
      defaultReferencePath: this.cardModeReferencePath,
      fitSize: 'cover'
    }) : null;
    this.sharedImagePicker = null;
    this.sharedImagePickerHandler = null;
    this.sharedImagePickerLabel = 'image';

    this.btnNew = document.getElementById('btn-new');
    this.btnSave = document.getElementById('btn-save');
    this.btnLoad = document.getElementById('btn-load');
    this.btnExport = document.getElementById('btn-export');
    this.exportMenu = document.getElementById('exportMenu');
    this.exportMenuPanel = document.getElementById('exportMenuPanel');
    this.btnResetCanvas = document.getElementById('btn-reset-canvas');
    this.fileInput = document.getElementById('fileInput');
    this.deckNameInput = document.getElementById('deckNameInput');
    this.deckCreateBtn = document.getElementById('deckCreateBtn');
    this.deckSelect = document.getElementById('deckSelect');
    this.deckCardSelect = document.getElementById('deckCardSelect');
    this.deckSaveBtn = document.getElementById('deckSaveBtn');
    this.deckLoadBtn = document.getElementById('deckLoadBtn');
    this.deckDeleteCardBtn = document.getElementById('deckDeleteCardBtn');
    this.deckDeleteBtn = document.getElementById('deckDeleteBtn');
    this.deckStorageKey = 'dtc_decks_v1';
    this.boardAbilityStorageKey = 'dtc_board_abilities_v1';
    this.boardSlotStorageKey = 'dtc_board_slots_v1';
    this.btnDeckView = document.getElementById('btn-deck-view');
    this.btnPrintSheet = document.getElementById('btn-print-sheet');
    this.deckViewModal = document.getElementById('deckViewModal');
    this.deckViewCloseBtn = document.getElementById('deckViewCloseBtn');
    this.deckViewRefreshBtn = document.getElementById('deckViewRefreshBtn');
    this.deckViewExportBtn = document.getElementById('deckViewExportBtn');
    this.deckViewGrid = document.getElementById('deckCardGrid');
    this.deckViewStatus = document.getElementById('deckViewStatus');
    this.deckViewSummary = document.getElementById('deckViewSummary');
    this.deckTemplate = document.getElementById('deckTemplate');
    this.printSheetModal = document.getElementById('printSheetModal');
    this.printSheetCloseBtn = document.getElementById('printSheetCloseBtn');
    this.printSheetRefreshBtn = document.getElementById('printSheetRefreshBtn');
    this.printSheetExportPngBtn = document.getElementById('printSheetExportPngBtn');
    this.printSheetExportPdfBtn = document.getElementById('printSheetExportPdfBtn');
    this.printSheetPrintBtn = document.getElementById('printSheetPrintBtn');
    this.printSheetGrid = document.getElementById('printSheetGrid');
    this.printSheetStatus = document.getElementById('printSheetStatus');
    this.printSheetSummary = document.getElementById('printSheetSummary');
    this.printSheetTemplate = document.getElementById('printSheetTemplate');
    this.printSheetPages = document.getElementById('printSheetPages');
    this.printSelectionList = document.getElementById('printSelectionList');
    this.printSelectionSummary = document.getElementById('printSelectionSummary');
    this.printSelectAllBtn = document.getElementById('printSelectAllBtn');
    this.printClearSelectionBtn = document.getElementById('printClearSelectionBtn');
    this.printLayerSafeToggle = document.getElementById('printLayerSafe');
    this.printLayerCutToggle = document.getElementById('printLayerCut');
    this.printLayerSafeLabel = document.getElementById('printLayerSafeLabel');
    this.printLayerCutLabel = document.getElementById('printLayerCutLabel');
    this.printModeSelect = document.getElementById('printModeSelect');
    this.printCardScaleInput = document.getElementById('printCardScale');
    this.printCardScaleValue = document.getElementById('printCardScaleValue');
    this.deckViewScaleSlider = document.getElementById('deckViewScale');
    this.deckViewScaleValue = document.getElementById('deckViewScaleValue');
    this.deckViewScaleKey = 'dtc_deck_view_scale_v2';
    this.deckViewOffsetXKey = 'dtc_deck_view_offset_x_v2';
    this.deckViewOffsetYKey = 'dtc_deck_view_offset_y_v2';
    this.deckViewCardScale = 1;
    this.deckViewCardOffsetX = 0;
    this.deckViewCardOffsetY = 0;
    this.deckViewRenderToken = 0;
    this.printSheetRenderToken = 0;
    this.printSheetEntries = [];
    this.printSheetSourceKey = '';
    this.printSheetSelectedIds = new Set();
    this.statusEffectsToggle = document.getElementById('toggleStatusEffects');
    this.statusEffectsModal = document.getElementById('statusEffectsModal');
    this.statusEffectsCloseBtn = document.getElementById('statusEffectsCloseBtn');
    this.statusEffectsTableBody = document.getElementById('statusEffectsTableBody');
    this.otherCommandsToggle = document.getElementById('toggleOtherCommands');
    this.otherCommandsModal = document.getElementById('otherCommandsModal');
    this.otherCommandsCloseBtn = document.getElementById('otherCommandsCloseBtn');
    this.otherCommandsTableBody = document.getElementById('otherCommandsTableBody');
    this.statusEffectsCache = null;
    this.deckDefaultCardPath = 'Assets/Deck/default/deck-default.json';
    this.deckDefaultCard = null;
    this.deckDefaultCardLoaded = false;
    this.deckTemplateConfig = {
      width: 3766,
      height: 4094,
      columns: 10,
      rows: 7,
      columnWidth: 353,
      columnGap: 24,
      rowHeights: [565, 561, 561, 561, 561, 561, 561],
      rowGap: 24,
      rowGaps: [24, 24, 24, 27, 24, 24],
      offsetX: 12,
      offsetY: 6
    };
    this.deckLayerAssets = {
      base: 'Assets/Deck/Deck Template_background_black.png',
      overlay: 'Assets/Deck/Deck Template.png'
    };
    this.deckThumbWidth = this.deckTemplateConfig.columnWidth;
    this.printModeStorageKey = 'dtc_print_mode_v1';
    this.printModes = {
      standard: {
        templateConfig: {
          width: 2550,
          height: 3300,
          columns: 2,
          rows: 4,
          columnWidth: 1004,
          columnGap: 118,
          rowHeight: 626,
          rowGap: 119,
          offsetX: 211,
          offsetY: 137,
          cardRotation: 90,
          cardScale: 1,
          renderWidth: Number(DTC_UI_EXPORT_SIZE.width) || 675,
          renderHeight: Number(DTC_UI_EXPORT_SIZE.height) || 1050
        },
        layerManifestPath: 'Assets/Reference/printpage/manifest.json',
        layerBaseDir: 'Assets/Reference/printpage',
        layerDefaults: {
          base: 'Assets/Reference/printpage/printpage_base_layer.png',
          safe: 'Assets/Reference/printpage/printpage_safe_margin.png',
          cut: 'Assets/Reference/printpage/printpage_card_template.png'
        }
      },
      compact: {
        templateConfig: {
          width: 2550,
          height: 3300,
          columns: 2,
          rows: 4,
          columnWidth: 1048,
          columnGap: 1,
          rowHeight: 673,
          rowGap: 2,
          offsetX: 227,
          offsetY: 76,
          cardRotation: 90,
          cardScale: 1,
          renderWidth: 627,
          renderHeight: 1005
        },
        layerManifestPath: 'Assets/Reference/printpage/compact/manifest.json',
        layerBaseDir: 'Assets/Reference/printpage/compact',
        layerDefaults: {
          base: 'Assets/Reference/printpage/compact/printpage_compact_cut_lines_.png',
          safe: '',
          cut: 'Assets/Reference/printpage/compact/printpage_compact_card_template_.png'
        }
      }
    };
    this.printMode = 'standard';
    this.printTemplateConfig = { ...this.printModes.standard.templateConfig };
    this.printLayerManifestPath = this.printModes.standard.layerManifestPath;
    this.printLayerBaseDir = this.printModes.standard.layerBaseDir;
    this.printLayerAssets = { ...this.printModes.standard.layerDefaults };
    const savedPrintMode = this.getStoredPrintMode();
    this.setPrintMode(savedPrintMode, { persist: false, rerender: false, refreshAssets: true });
    this.applyWorkspaceMode(this.workspaceMode, { persist: false });

    this.initEventListeners();
    this.initLayerListDragAndDrop();
    this.loadCardArtOptions();
    this.loadFontOptions();
    if (this.referenceManager) {
      this.referenceManager.init()
        .then(() => {
          this.applyWorkspaceReferenceDefault(this.workspaceMode, { force: true });
        })
        .catch((error) => {
          console.warn('Failed to initialize reference manager:', error);
        });
    }
    this.refreshDeckUI();
    this.refreshBoardAbilityOptions();
    this.updateDeckSaveAvailability(gameState.getCard());
  }

  getStoredPrintMode() {
    if (typeof localStorage === 'undefined') return 'standard';
    const raw = String(localStorage.getItem(this.printModeStorageKey) || '').trim().toLowerCase();
    return this.printModes?.[raw] ? raw : 'standard';
  }

  getStoredWorkspaceMode() {
    if (typeof localStorage === 'undefined') return 'card';
    const raw = String(localStorage.getItem(this.workspaceModeStorageKey) || '').trim().toLowerCase();
    if (raw === 'leaflet' || raw === 'board') return raw;
    return 'card';
  }

  getDescriptionContext(mode = this.workspaceMode) {
    const isLeaflet = String(mode || '').toLowerCase() === 'leaflet';
    return {
      isLeaflet,
      blocksKey: isLeaflet ? 'leafletDescriptionBlocks' : 'descriptionBlocks',
      activeIdKey: isLeaflet ? 'leafletActiveDescriptionId' : 'activeDescriptionId',
      defaultFontSize: isLeaflet ? this.defaultLeafletDescriptionFontSize : this.defaultDescriptionFontSize
    };
  }

  getDefaultReferencePathForMode(mode = this.workspaceMode) {
    const normalized = String(mode || '').toLowerCase();
    if (normalized === 'leaflet') return 'Assets/Reference/spiderman_leaflet.png';
    return 'Assets/Reference/missed_me_II.png';
  }

  applyWorkspaceReferenceDefault(mode = this.workspaceMode, options = {}) {
    if (!this.referenceManager || !this.referenceSelect) return;
    const normalized = String(mode || '').toLowerCase();
    const isLeaflet = normalized === 'leaflet';
    const currentValue = String(this.referenceSelect.value || '').trim();
    if (isLeaflet) {
      if (currentValue && currentValue !== '__upload__') {
        this.cardModeReferencePath = currentValue;
      }
    } else if (currentValue && currentValue !== '__upload__') {
      this.leafletModeReferencePath = currentValue;
    }

    const desiredValue = isLeaflet
      ? (this.leafletModeReferencePath || this.getDefaultReferencePathForMode('leaflet'))
      : (this.cardModeReferencePath || this.getDefaultReferencePathForMode('card'));
    if (!desiredValue) return;

    const force = options.force === true;
    if (!force && currentValue === desiredValue) return;

    const hasOption = Array.from(this.referenceSelect.options || []).some((opt) => opt.value === desiredValue);
    if (!hasOption) return;

    this.referenceSelect.value = desiredValue;
    const label = typeof this.referenceManager.formatLabel === 'function'
      ? this.referenceManager.formatLabel(desiredValue)
      : 'Reference';
    if (typeof this.referenceManager.applyImage === 'function') {
      this.referenceManager.applyImage(desiredValue, label);
    }
    if (isLeaflet) {
      this.leafletModeReferencePath = desiredValue;
    } else {
      this.cardModeReferencePath = desiredValue;
    }
  }

  applyWorkspaceMode(mode, options = {}) {
    const previousMode = this.workspaceMode;
    const nextMode = ['card', 'leaflet', 'board'].includes(mode) ? mode : 'card';
    this.workspaceMode = nextMode;

    this.workspaceTabs.forEach((tab) => {
      const isActive = tab.dataset.workspace === nextMode;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const showShared = nextMode === 'card' || nextMode === 'leaflet';
    (this.workspacePanels.shared || []).forEach((panel) => {
      panel.classList.toggle('is-active', showShared);
      panel.setAttribute('aria-hidden', showShared ? 'false' : 'true');
    });
    const showLeaflet = nextMode === 'leaflet';
    (this.workspacePanels.leaflet || []).forEach((panel) => {
      panel.classList.toggle('is-active', showLeaflet);
      panel.setAttribute('aria-hidden', showLeaflet ? 'false' : 'true');
    });
    const showBoard = nextMode === 'board';
    (this.workspacePanels.board || []).forEach((panel) => {
      panel.classList.toggle('is-active', showBoard);
      panel.setAttribute('aria-hidden', showBoard ? 'false' : 'true');
    });

    // Leaflet mode reuses title/description controls but hides card-only fields.
    const hideForLeaflet = showLeaflet;
    [
      this.cardTypeGroup,
      this.cardSubTypeGroup,
      this.costBadgeGroup,
      this.cardIdSection,
      this.cardLayersSection,
      this.descriptionLineHeightGroup,
      this.descriptionLetterSpacingGroup,
      this.descriptionBaselineOffsetGroup
    ].forEach((el) => {
      if (!el) return;
      el.style.display = hideForLeaflet ? 'none' : '';
    });
    if (this.abilityDiceSection) {
      this.abilityDiceSection.style.display = hideForLeaflet ? 'none' : '';
    }

    if (this.artSectionTitle) {
      this.artSectionTitle.textContent = hideForLeaflet ? 'Leaflet Art' : 'Card Art';
    }
    if (this.cardPropertiesSummary) {
      this.cardPropertiesSummary.textContent = hideForLeaflet ? 'Leaflet Properties' : 'Card Properties';
    }
    if (this.imageUploadLabel) {
      this.imageUploadLabel.textContent = hideForLeaflet
        ? 'Click to upload leaflet art'
        : 'Click to upload or drag and drop';
    }
    if (this.artUploadHelpText) {
      this.artUploadHelpText.textContent = hideForLeaflet
        ? 'Recommended: match leaflet layout dimensions (JPG, PNG, WebP)'
        : 'Recommended: 600x800px (JPG, PNG, WebP)';
    }
    if (this.cropMaskSelect) {
      if (hideForLeaflet) {
        this.cardModeCropMask = this.cropMaskSelect.value || this.defaultCropMask;
        this.cropMaskSelect.value = this.leafletCropMask;
      } else if (this.cardModeCropMask) {
        this.cropMaskSelect.value = this.cardModeCropMask;
      }
      if (this.cropModal && this.cropModal.classList.contains('is-open')) {
        this.applyCropMask(this.getSelectedCropMaskPath(), null, false);
      }
    }
    if (this.referenceManager && this.referenceSelect && previousMode !== nextMode) {
      this.applyWorkspaceReferenceDefault(nextMode, { force: true });
    }

    if (options.persist !== false && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.workspaceModeStorageKey, nextMode);
    }

    if (typeof renderer?.setWorkspaceMode === 'function') {
      try {
        renderer.setWorkspaceMode(nextMode);
        const normalizedCard = this.ensureDescriptionBlocks(gameState.getCard());
        renderer.render(normalizedCard);
        const activeId = this.getActiveDescriptionId(normalizedCard, this.getDescriptionBlocks(normalizedCard));
        if (activeId) this.setActiveDescriptionBlock(activeId, { syncEditor: true });
      } catch (error) {
        console.warn('Failed to re-render while applying workspace mode:', error);
      }
    }
  }

  async setPrintMode(mode, options = {}) {
    const nextMode = this.printModes?.[mode] ? mode : 'standard';
    const cfg = this.printModes[nextMode] || this.printModes.standard;
    this.printMode = nextMode;
    this.printTemplateConfig = { ...cfg.templateConfig };
    this.printLayerManifestPath = cfg.layerManifestPath;
    this.printLayerBaseDir = cfg.layerBaseDir;
    this.printLayerAssets = { ...cfg.layerDefaults };

    if (this.printModeSelect) this.printModeSelect.value = nextMode;
    if (this.printLayerSafeToggle) {
      const safeLabel = this.printLayerSafeToggle.closest('label');
      if (safeLabel) safeLabel.style.display = nextMode === 'compact' ? 'none' : '';
      if (nextMode === 'compact') this.printLayerSafeToggle.checked = false;
    }
    if (this.printLayerSafeLabel) {
      this.printLayerSafeLabel.textContent = 'Safe';
    }
    if (this.printLayerCutToggle && nextMode === 'compact') {
      this.printLayerCutToggle.checked = true;
    }
    if (this.printLayerCutLabel) {
      this.printLayerCutLabel.textContent = nextMode === 'compact' ? 'Card Template' : 'Cut';
    }
    this.syncPrintCardScaleUi();
    if (options.persist !== false && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.printModeStorageKey, nextMode);
    }

    const refreshAssets = options.refreshAssets !== false;
    if (refreshAssets) {
      await this.loadPrintLayerManifest();
    } else {
      this.applyPrintLayerCssVariables();
    }

    if (options.rerender && this.isPrintSheetOpen()) {
      this.ensurePrintSheetPages();
      this.updatePrintTemplateScale();
      this.renderPrintSheet();
      this.applyPrintLayerVisibility();
    }
  }

  syncPrintCardScaleUi() {
    const scale = Number.isFinite(this.printTemplateConfig?.cardScale) ? this.printTemplateConfig.cardScale : 1;
    if (this.printCardScaleInput) this.printCardScaleInput.value = String(scale);
    if (this.printCardScaleValue) this.printCardScaleValue.textContent = `${Math.round(scale * 100)}%`;
  }

  openFilePicker(inputEl) {
    if (!inputEl) return;
    try {
      inputEl.value = '';
    } catch (error) {
      // Ignore browsers that block direct value resets here.
    }
    inputEl.click();
  }

  validateImageFile(file, options = {}) {
    const safeLabel = String(options.label || 'image').trim() || 'image';
    const maxBytes = Number.isFinite(Number(options.maxBytes)) ? Number(options.maxBytes) : (5 * 1024 * 1024);
    const title = safeLabel.charAt(0).toUpperCase() + safeLabel.slice(1);
    if (!file) return false;
    if (!String(file.type || '').startsWith('image/')) {
      alert(`Please select a valid ${safeLabel} file.`);
      return false;
    }
    if (file.size > maxBytes) {
      const maxMb = Math.max(1, Math.round(maxBytes / (1024 * 1024)));
      alert(`${title} file is too large. Maximum size is ${maxMb}MB.`);
      return false;
    }
    return true;
  }

  readFileAsDataUrl(file, errorMessage = 'Failed to read image file.') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error(errorMessage));
      reader.readAsDataURL(file);
    });
  }

  ensureSharedImagePicker() {
    if (this.sharedImagePicker && this.sharedImagePicker.isConnected) {
      return this.sharedImagePicker;
    }
    if (typeof document === 'undefined' || !document.body) {
      return null;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.tabIndex = -1;
    input.setAttribute('aria-hidden', 'true');
    input.style.position = 'fixed';
    input.style.left = '0';
    input.style.top = '0';
    input.style.width = '1px';
    input.style.height = '1px';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    input.style.zIndex = '-1';

    input.addEventListener('change', () => {
      const file = input.files?.[0] || null;
      const handler = this.sharedImagePickerHandler;
      const label = this.sharedImagePickerLabel || 'image';
      this.sharedImagePickerHandler = null;
      this.sharedImagePickerLabel = 'image';
      input.value = '';
      if (!file || typeof handler !== 'function') return;
      if (!this.validateImageFile(file, { label })) return;
      try {
        const result = handler(file);
        if (result && typeof result.catch === 'function') {
          result.catch((error) => {
            console.warn('Shared image picker handler failed:', error);
          });
        }
      } catch (error) {
        console.warn('Shared image picker handler failed:', error);
      }
    });
    input.addEventListener('cancel', () => {
      this.sharedImagePickerHandler = null;
      this.sharedImagePickerLabel = 'image';
      input.value = '';
    });

    document.body.appendChild(input);
    this.sharedImagePicker = input;
    return input;
  }

  startSharedImagePick(label, onSelect) {
    if (typeof onSelect !== 'function') return;
    const input = this.ensureSharedImagePicker();
    if (!input) return;
    this.sharedImagePickerLabel = String(label || 'image');
    this.sharedImagePickerHandler = onSelect;
    input.value = '';
    this.openFilePicker(input);
  }

  openTransientFilePicker(options = {}) {
    return new Promise((resolve) => {
      if (typeof document === 'undefined' || !document.body) {
        resolve(null);
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      if (options.accept) input.accept = String(options.accept);
      if (options.multiple) input.multiple = true;
      input.tabIndex = -1;
      input.setAttribute('aria-hidden', 'true');
      input.style.position = 'fixed';
      input.style.left = '0';
      input.style.top = '0';
      input.style.width = '1px';
      input.style.height = '1px';
      input.style.opacity = '0';
      input.style.pointerEvents = 'none';
      input.style.zIndex = '-1';

      let settled = false;
      let focusTimer = null;

      const cleanup = (file = null) => {
        if (settled) return;
        settled = true;
        if (focusTimer) {
          clearTimeout(focusTimer);
          focusTimer = null;
        }
        input.removeEventListener('change', onChange);
        input.removeEventListener('cancel', onCancel);
        window.removeEventListener('focus', onWindowFocus, true);
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
        resolve(file);
      };

      const onChange = () => {
        const file = options.multiple ? Array.from(input.files || []) : (input.files?.[0] || null);
        cleanup(file);
      };

      const onWindowFocus = () => {
        focusTimer = window.setTimeout(() => {
          const file = options.multiple ? Array.from(input.files || []) : (input.files?.[0] || null);
          cleanup(file);
        }, 300);
      };

      const onCancel = () => {
        cleanup(null);
      };

      input.addEventListener('change', onChange, { once: true });
      input.addEventListener('cancel', onCancel, { once: true });
      window.addEventListener('focus', onWindowFocus, true);
      document.body.appendChild(input);
      this.openFilePicker(input);
    });
  }

  async promptForImageFile(label = 'image') {
    const file = await this.openTransientFilePicker({ accept: 'image/*' });
    if (!file) return null;
    if (!this.validateImageFile(file, { label })) return null;
    return file;
  }

  createActionButton(text, className = 'btn btn-secondary btn-small') {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    if (className) button.className = className;
    return button;
  }

  createInlineImageUploadInput(ariaLabel, onSelect) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.className = 'upload-input upload-input-inline';
    input.setAttribute('aria-label', String(ariaLabel || 'Upload image'));
    input.addEventListener('change', (e) => {
      const file = e?.target?.files?.[0];
      if (!file) return;
      try {
        const result = typeof onSelect === 'function' ? onSelect(file) : null;
        if (result && typeof result.catch === 'function') {
          result.catch((error) => {
            console.warn('Inline image upload handler failed:', error);
          });
        }
      } catch (error) {
        console.warn('Inline image upload handler failed:', error);
      } finally {
        if (e?.target) e.target.value = '';
      }
    });
    return input;
  }

  initEventListeners() {
    if (this.workspaceTabs.length) {
      this.workspaceTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const mode = tab.dataset.workspace || 'card';
          this.applyWorkspaceMode(mode);
        });
      });
    }

    if (this.referenceSelect) {
      this.referenceSelect.addEventListener('change', (e) => {
        const value = String(e?.target?.value || '').trim();
        if (!value || value === '__upload__') return;
        if (this.workspaceMode === 'leaflet') {
          this.leafletModeReferencePath = value;
        } else {
          this.cardModeReferencePath = value;
        }
      });
    }

    // Card properties

    if (this.cardNameInput) {
      this.cardNameInput.addEventListener('input', (e) => {
        const rawTitle = String(e.target.value || '');
        let card = gameState.getCard();
        card = this.ensureTitleBlocks(card);
        const blocks = this.getTitleBlocks(card);
        const activeId = this.getActiveTitleId(card, blocks);
        const updatedBlocks = blocks.map((block) => {
          if (block.id !== activeId) return block;
          return { ...block, text: rawTitle };
        });
        const activeBlock = updatedBlocks.find((block) => block.id === activeId) || updatedBlocks[0];
        gameState.updateProperties({
          titleBlocks: updatedBlocks,
          activeTitleId: activeId,
          name: rawTitle,
          titlePosition: activeBlock ? activeBlock.position : (card.titlePosition || { x: 0, y: 0 })
        });
        this.activeTitleId = activeId;
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    if (this.leafletSideSelect) {
      this.leafletSideSelect.addEventListener('change', (e) => {
        const side = String(e.target.value || 'front').toLowerCase() === 'back' ? 'back' : 'front';
        gameState.updateProperty('leafletSide', side);
        if (typeof renderer?.setLeafletSide === 'function') {
          renderer.setLeafletSide(side);
        }
        this.renderLeafletBreakControls(gameState.getCard());
        renderer.render(gameState.getCard());
      });
    }

    if (this.leafletLayerBackground) {
      this.leafletLayerBackground.addEventListener('change', (e) => {
        gameState.updateProperty('leafletLayers.background', !!e.target.checked);
        renderer.render(gameState.getCard());
      });
    }
    if (this.leafletLayerTitle) {
      this.leafletLayerTitle.addEventListener('change', (e) => {
        gameState.updateProperty('leafletLayers.title', !!e.target.checked);
        renderer.render(gameState.getCard());
      });
    }
    if (this.leafletLayerArt) {
      this.leafletLayerArt.addEventListener('change', (e) => {
        gameState.updateProperty('leafletLayers.art', !!e.target.checked);
        renderer.render(gameState.getCard());
      });
    }
    if (this.leafletLayerText) {
      this.leafletLayerText.addEventListener('change', (e) => {
        gameState.updateProperty('leafletLayers.text', !!e.target.checked);
        renderer.render(gameState.getCard());
      });
    }
    this.boardSlotSelects.forEach((selectEl) => {
      if (!selectEl) return;
      selectEl.addEventListener('change', () => {
        this.saveBoardSlotAssignments(this.boardSlotSelects.map((node) => (node ? node.value : '')));
        this.renderBoardSlotAssignments();
      });
    });

    if (this.titleBoxAddBtn) {
      this.titleBoxAddBtn.addEventListener('click', () => this.addTitleBox());
    }
    if (this.titleBoxRemoveBtn) {
      this.titleBoxRemoveBtn.addEventListener('click', () => this.removeActiveTitleBox());
    }
    if (this.abilityDiceAddBtn) {
      this.abilityDiceAddBtn.addEventListener('click', () => this.addAbilityDiceEntry());
    }
    if (this.defaultDiceColorPicker) {
      this.defaultDiceColorPicker.addEventListener('input', (e) => {
        const color = this.syncDefaultDiceColorControls(e.target.value);
        gameState.updateProperty('defaultDiceColor', color);
        renderer.render(gameState.getCard());
      });
      this.defaultDiceColorPicker.addEventListener('change', (e) => {
        const color = this.syncDefaultDiceColorControls(e.target.value);
        gameState.updateProperty('defaultDiceColor', color);
        renderer.render(gameState.getCard());
      });
    }
    if (this.defaultDiceColorInput) {
      const applyDefaultDiceColorFromHexInput = () => {
        const color = this.normalizeDiceColor(this.defaultDiceColorInput.value, this.defaultDiceColor);
        this.syncDefaultDiceColorControls(color);
        gameState.updateProperty('defaultDiceColor', color);
        renderer.render(gameState.getCard());
      };
      this.defaultDiceColorInput.addEventListener('change', applyDefaultDiceColorFromHexInput);
      this.defaultDiceColorInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        applyDefaultDiceColorFromHexInput();
        this.defaultDiceColorInput.select();
      });
    }

    if (this.customStatusAddBtn) {
      this.customStatusAddBtn.addEventListener('click', () => this.addCustomStatusEffectEntry());
    }
    if (this.leafletBreakAddBtn) {
      this.leafletBreakAddBtn.addEventListener('click', () => this.addLeafletBreakEntry());
    }

    if (this.cardIdInput) {
      this.cardIdInput.addEventListener('input', (e) => {
        const normalized = this.normalizeCardIdInput(e.target.value);
        e.target.value = normalized;
        gameState.updateProperty('cardId', normalized);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.cardIdFontSizeInput) {
      this.cardIdFontSizeInput.addEventListener('input', (e) => {
        const size = this.clampCardIdFontSize(e.target.value);
        e.target.value = size;
        if (this.cardIdFontSizeValue) this.cardIdFontSizeValue.textContent = size;
        gameState.updateProperty('cardIdFontSize', size);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.cardIdPositionXInput) {
      this.cardIdPositionXInput.addEventListener('input', (e) => {
        const offset = this.clampCardIdOffset(e.target.value);
        e.target.value = offset;
        if (this.cardIdPositionXValue) this.cardIdPositionXValue.textContent = offset.toFixed(1);
        gameState.updateProperty('cardIdOffsetX', offset);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.cardIdPositionYInput) {
      this.cardIdPositionYInput.addEventListener('input', (e) => {
        const offset = this.clampCardIdOffset(e.target.value);
        e.target.value = offset;
        if (this.cardIdPositionYValue) this.cardIdPositionYValue.textContent = offset.toFixed(1);
        gameState.updateProperty('cardIdOffset', offset);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.titleFontSelect) {
      this.titleFontSelect.addEventListener('change', (e) => {
        gameState.updateProperty('titleFont', e.target.value || this.defaultTitleFont);
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    if (this.titleFontSizeInput) {
      this.titleFontSizeInput.addEventListener('change', (e) => {
        const value = Number(e.target.value);
        const size = Number.isFinite(value) ? Math.max(8, Math.min(96, value)) : this.defaultTitleFontSize;
        e.target.value = size;
        gameState.updateProperty('titleFontSize', size);
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    if (this.titleLetterSpacingInput) {
      this.titleLetterSpacingInput.addEventListener('input', (e) => {
        const spacing = this.clampLetterSpacing(e.target.value);
        e.target.value = spacing;
        if (this.titleLetterSpacingValue) this.titleLetterSpacingValue.textContent = spacing;
        gameState.updateProperty('titleLetterSpacing', spacing);
        renderer.updateTitleImage(gameState.getCard());
      });
    }

    if (this.descriptionFontSelect) {
      this.descriptionFontSelect.addEventListener('change', (e) => {
        const font = e.target.value || this.defaultDescriptionFont;
        gameState.updateProperty('descriptionFont', font);
        this.applyFontToDescriptionSelection(font);
        this.updateDescriptionStateFromEditor(true);
        renderer.updateCardIdText(gameState.getCard());
      });
    }

    if (this.descriptionFontSizeInput) {
      this.descriptionFontSizeInput.addEventListener('change', (e) => {
        const context = this.getDescriptionContext();
        const size = this.clampDescriptionFontSize(e.target.value, context.defaultFontSize);
        e.target.value = size;
        let card = gameState.getCard();
        card = this.ensureDescriptionBlocks(card);
        const blocks = this.getDescriptionBlocks(card);
        const activeId = this.getActiveDescriptionId(card, blocks);
        const updatedBlocks = blocks.map((block) => {
          if (block.id !== activeId) return block;
          return { ...block, fontSize: size };
        });
        const updates = {
          [context.blocksKey]: updatedBlocks
        };
        if (!context.isLeaflet) {
          updates.descriptionFontSize = size;
        }
        gameState.updateProperties(updates);
        renderer.updateDescriptionImage(gameState.getCard());
        this.updateStatusEffectsIconSize();
      });
    }

    if (this.descriptionLineHeightInput) {
      this.descriptionLineHeightInput.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        const spacing = this.clampLineHeightScale(value);
        e.target.value = spacing;
        if (this.descriptionLineHeightValue) this.descriptionLineHeightValue.textContent = spacing.toFixed(2);
        gameState.updateProperty('descriptionLineHeightScale', spacing);
        renderer.updateDescriptionImage(gameState.getCard());
      });
    }

    if (this.descriptionLetterSpacingInput) {
      this.descriptionLetterSpacingInput.addEventListener('input', (e) => {
        const spacing = this.clampLetterSpacing(e.target.value);
        e.target.value = spacing;
        if (this.descriptionLetterSpacingValue) this.descriptionLetterSpacingValue.textContent = spacing;
        gameState.updateProperty('descriptionLetterSpacing', spacing);
        renderer.updateDescriptionImage(gameState.getCard());
      });
    }

    if (this.descriptionBaselineOffsetInput) {
      this.descriptionBaselineOffsetInput.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        const offset = Number.isFinite(value) ? Math.max(-5, Math.min(5, value)) : this.defaultDescriptionBaselineOffset;
        e.target.value = offset;
        if (this.descriptionBaselineOffsetValue) this.descriptionBaselineOffsetValue.textContent = offset.toFixed(1);
        gameState.updateProperty('descriptionBaselineOffset', offset);
        renderer.updateDescriptionImage(gameState.getCard());
      });
    }

    if (this.descriptionBoxScaleInput) {
      this.descriptionBoxScaleInput.addEventListener('input', (e) => {
        const context = this.getDescriptionContext();
        const scale = this.clampDescriptionBoxScale(e.target.value);
        e.target.value = scale;
        if (this.descriptionBoxScaleValue) this.descriptionBoxScaleValue.textContent = scale.toFixed(2);
        let card = gameState.getCard();
        card = this.ensureDescriptionBlocks(card);
        const blocks = this.getDescriptionBlocks(card);
        const activeId = this.getActiveDescriptionId(card, blocks);
        const updatedBlocks = blocks.map((block) => {
          if (block.id !== activeId) return block;
          return { ...block, scale };
        });
        gameState.updateProperties({
          [context.blocksKey]: updatedBlocks
        });
        renderer.updateDescriptionImage(gameState.getCard());
        this.updateStatusEffectsIconSize();
      });
    }

    this.cardTypeSelect.addEventListener('change', (e) => {
      gameState.updateProperty('cardType', e.target.value);
      this.updateSubTypeOptions(e.target.value);
      this.updateSubTypeLabel(e.target.value);
      renderer.applyAssetsForCardType(e.target.value, this.cardSubTypeSelect.value);
      this.applyLayerPresetForCard(e.target.value, this.cardSubTypeSelect.value);
      this.updateDeckSaveAvailability(gameState.getCard());
      renderer.updateCardIdText(gameState.getCard());
    });

    this.cardSubTypeSelect.addEventListener('change', (e) => {
      gameState.updateProperty('cardSubType', e.target.value);
      renderer.applyAssetsForCardType(this.cardTypeSelect.value, e.target.value);
      this.applyLayerPresetForCard(this.cardTypeSelect.value, e.target.value);
      renderer.updateCardIdText(gameState.getCard());
    });

    if (this.costInput) {
      this.costInput.addEventListener('input', (e) => {
        const value = String(e.target.value || '').trim();
        gameState.updateProperty('costBadge.value', value);
        renderer.updateCostBadge(gameState.getCard());
      });
    }

    // Buttons
    this.btnNew.addEventListener('click', () => this.newCard());
    this.btnSave.addEventListener('click', () => this.saveCard());
    this.btnLoad.addEventListener('click', () => this.loadCard());
    if (this.btnExport) {
      this.btnExport.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleExportMenu();
      });
    }
    if (this.btnResetCanvas) {
      this.btnResetCanvas.addEventListener('click', () => this.resetCanvas());
    }
    if (this.btnDeckView) {
      this.btnDeckView.addEventListener('click', () => this.openDeckView());
    }
    if (this.btnPrintSheet) {
      this.btnPrintSheet.addEventListener('click', () => this.openPrintSheet());
    }
    window.addEventListener('resize', () => {
      if (this.isDeckViewOpen()) {
        this.updateDeckTemplateScale();
      }
      if (this.isPrintSheetOpen()) {
        this.updatePrintTemplateScale();
      }
    });
    if (this.deckViewRefreshBtn) {
      this.deckViewRefreshBtn.addEventListener('click', () => this.renderDeckView());
    }
    if (this.deckViewExportBtn) {
      this.deckViewExportBtn.addEventListener('click', () => this.exportDeckView());
    }
    if (this.deckViewCloseBtn) {
      this.deckViewCloseBtn.addEventListener('click', () => this.closeDeckView());
    }
    if (this.deckViewModal) {
      this.deckViewModal.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('deck-modal__backdrop')) {
          this.closeDeckView();
        }
      });
    }
    if (this.printSheetRefreshBtn) {
      this.printSheetRefreshBtn.addEventListener('click', () => this.renderPrintSheet());
    }
    if (this.printSheetExportPngBtn) {
      this.printSheetExportPngBtn.addEventListener('click', () => this.exportPrintSheetAsPng());
    }
    if (this.printSheetExportPdfBtn) {
      this.printSheetExportPdfBtn.addEventListener('click', () => this.exportPrintSheetAsPdf());
    }
    if (this.printSheetPrintBtn) {
      this.printSheetPrintBtn.addEventListener('click', () => this.printPrintSheet());
    }
    if (this.printSheetCloseBtn) {
      this.printSheetCloseBtn.addEventListener('click', () => this.closePrintSheet());
    }
    if (this.printSheetModal) {
      this.printSheetModal.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('print-modal__backdrop')) {
          this.closePrintSheet();
        }
      });
    }
    if (this.printLayerSafeToggle) {
      this.printLayerSafeToggle.addEventListener('change', () => this.applyPrintLayerVisibility());
    }
    if (this.printLayerCutToggle) {
      this.printLayerCutToggle.addEventListener('change', () => this.applyPrintLayerVisibility());
    }
    if (this.printModeSelect) {
      this.printModeSelect.addEventListener('change', async (e) => {
        const mode = String(e?.target?.value || 'standard');
        await this.setPrintMode(mode, { persist: true, rerender: true, refreshAssets: true });
      });
    }
    if (this.printCardScaleInput) {
      this.printCardScaleInput.addEventListener('input', () => {
        const raw = Number(this.printCardScaleInput.value);
        const scale = Number.isFinite(raw) ? Math.max(0.7, Math.min(1.3, raw)) : 1;
        this.printTemplateConfig.cardScale = scale;
        if (this.printModes?.[this.printMode]?.templateConfig) {
          this.printModes[this.printMode].templateConfig.cardScale = scale;
        }
        this.syncPrintCardScaleUi();
        if (this.isPrintSheetOpen()) this.renderPrintSheet();
      });
    }
    if (this.printSelectAllBtn) {
      this.printSelectAllBtn.addEventListener('click', () => {
        if (!this.printSheetEntries.length) return;
        this.printSheetSelectedIds = new Set(this.printSheetEntries.map((entry) => entry.__printId));
        this.renderPrintSelectionList();
        this.renderPrintSheet();
      });
    }
    if (this.printClearSelectionBtn) {
      this.printClearSelectionBtn.addEventListener('click', () => {
        this.printSheetSelectedIds = new Set();
        this.renderPrintSelectionList();
        this.renderPrintSheet();
      });
    }
    if (this.deckViewScaleSlider) {
      const storedScale = Number(localStorage.getItem(this.deckViewScaleKey));
      const initial = Number.isFinite(storedScale) ? storedScale : 1;
      this.setDeckViewScale(initial, false);
      this.deckViewScaleSlider.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        this.setDeckViewScale(value, true);
      });
    }
    const storedOffsetX = Number(localStorage.getItem(this.deckViewOffsetXKey));
    const storedOffsetY = Number(localStorage.getItem(this.deckViewOffsetYKey));
    this.deckViewCardOffsetX = Number.isFinite(storedOffsetX) ? storedOffsetX : 0;
    this.deckViewCardOffsetY = Number.isFinite(storedOffsetY) ? storedOffsetY : 0;
    this.applyDeckViewTransform();

    document.addEventListener('keydown', (e) => this.handleDeckViewKeyDown(e));
    if (this.statusEffectsToggle) {
      this.statusEffectsToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.openStatusEffectsModal();
        } else {
          this.closeStatusEffectsModal();
        }
      });
    }
    if (this.otherCommandsToggle) {
      this.otherCommandsToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.openOtherCommandsModal();
        } else {
          this.closeOtherCommandsModal();
        }
      });
    }
    if (this.statusEffectsCloseBtn) {
      this.statusEffectsCloseBtn.addEventListener('click', () => this.closeStatusEffectsModal());
    }
    if (this.otherCommandsCloseBtn) {
      this.otherCommandsCloseBtn.addEventListener('click', () => this.closeOtherCommandsModal());
    }
    if (this.statusEffectsModal) {
      this.statusEffectsModal.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('status-modal__backdrop')) {
          this.closeStatusEffectsModal();
        }
      });
    }
    if (this.otherCommandsModal) {
      this.otherCommandsModal.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('status-modal__backdrop')) {
          this.closeOtherCommandsModal();
        }
      });
    }

    if (this.exportMenuPanel) {
      this.exportMenuPanel.addEventListener('click', (e) => {
        const target = e.target.closest('.export-menu__item');
        if (!target) return;
        const type = target.getAttribute('data-export') || 'png';
        this.exportCard(type);
        this.closeExportMenu();
      });
    }

    document.addEventListener('click', (e) => {
      if (!this.exportMenu || !this.exportMenuPanel) return;
      if (!this.exportMenu.contains(e.target)) {
        this.closeExportMenu();
      }
    });

    if (this.deckCreateBtn) {
      this.deckCreateBtn.addEventListener('click', () => this.createDeck());
    }
    if (this.deckSaveBtn) {
      this.deckSaveBtn.addEventListener('click', () => this.saveCardToDeck());
    }
    if (this.deckLoadBtn) {
      this.deckLoadBtn.addEventListener('click', () => this.loadCardFromDeck());
    }
    if (this.deckDeleteCardBtn) {
      this.deckDeleteCardBtn.addEventListener('click', () => this.deleteCardFromDeck());
    }
    if (this.deckDeleteBtn) {
      this.deckDeleteBtn.addEventListener('click', () => this.deleteDeck());
    }
    if (this.deckSelect) {
      this.deckSelect.addEventListener('change', () => {
        this.refreshDeckCards();
        if (this.isDeckViewOpen()) this.renderDeckView();
        if (this.isPrintSheetOpen()) this.renderPrintSheet();
      });
    }
    if (this.deckCardSelect) {
      this.deckCardSelect.addEventListener('change', () => this.loadCardFromDeck());
    }

    // Image upload
    this.imageUploadInput.addEventListener('change', (e) => this.handleImageUpload(e));
    this.btnClearImage.addEventListener('click', () => this.clearImage());
    if (this.artSelect) {
      this.artSelect.addEventListener('change', (e) => this.handleArtSelect(e));
    }
    if (this.toggleCropperOnUpload) {
      const saved = localStorage.getItem(this.cropperOnUploadKey);
      if (saved !== null) {
        this.toggleCropperOnUpload.checked = saved === 'true';
      }
      this.toggleCropperOnUpload.addEventListener('change', (e) => {
        localStorage.setItem(this.cropperOnUploadKey, String(!!e.target.checked));
      });
    }
    if (this.cropMaskSelect) {
      const saved = localStorage.getItem(this.cropMaskKey);
      if (saved && Array.from(this.cropMaskSelect.options).some((opt) => opt.value === saved)) {
        this.cropMaskSelect.value = saved;
      }
      this.cropMaskSelect.addEventListener('change', (e) => {
        const value = e.target.value || this.defaultCropMask;
        localStorage.setItem(this.cropMaskKey, value);
        this.disableCropPreview();
        if (this.cropModal && this.cropModal.classList.contains('is-open')) {
          this.applyCropMask(value, null, false);
        }
      });
    }

    if (this.cropCloseBtn) {
      this.cropCloseBtn.addEventListener('click', () => this.closeCropper());
    }

    if (this.cropApplyBtn) {
      this.cropApplyBtn.addEventListener('click', () => this.applyCropper());
    }

    if (this.cropPreviewBtn) {
      this.cropPreviewBtn.addEventListener('click', () => this.toggleCropPreview());
    }

    if (this.cropZoomInput) {
      this.cropZoomInput.addEventListener('input', (e) => {
        const next = Math.max(0.6, Math.min(3, Number(e.target.value) || 1));
        this.cropState.scale = next;
        this.disableCropPreview();
        this.updateCropperTransform();
      });
    }

    if (this.cropModal) {
      this.cropModal.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('crop-modal__backdrop')) {
          this.closeCropper();
        }
      });
    }

    if (this.cropArea) {
      this.cropArea.addEventListener('pointerdown', (e) => {
        if (!this.cropImage || !this.cropImage.src) return;
        this.cropArea.setPointerCapture(e.pointerId);
        this.cropDragState = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          originX: this.cropState.x,
          originY: this.cropState.y
        };
        this.disableCropPreview();
        this.cropArea.classList.add('dragging');
      });
    }

    window.addEventListener('pointermove', (e) => {
      if (!this.cropDragState) return;
      const dx = e.clientX - this.cropDragState.startX;
      const dy = e.clientY - this.cropDragState.startY;
      this.cropState.x = this.cropDragState.originX + dx;
      this.cropState.y = this.cropDragState.originY + dy;
      this.updateCropperTransform();
    });

    window.addEventListener('pointerup', () => {
      if (!this.cropDragState) return;
      if (this.cropArea) {
        try {
          this.cropArea.releasePointerCapture(this.cropDragState.pointerId);
        } catch (error) {
          // ignore
        }
        this.cropArea.classList.remove('dragging');
      }
      this.cropDragState = null;
    });

    if (this.referenceManager) {
      this.referenceManager.bindEvents();
    }

    // Export settings
    if (this.toggleExportBleed) {
      this.toggleExportBleed.addEventListener('change', (e) => {
        gameState.updateProperty('export.includeBleed', e.target.checked);
      });
    }

    if (this.showHiddenLayersToggle) {
      const saved = localStorage.getItem(this.showHiddenLayersKey);
      if (saved !== null) {
        this.showHiddenLayersToggle.checked = saved === 'true';
      }
      this.showHiddenLayersToggle.addEventListener('change', (e) => {
        localStorage.setItem(this.showHiddenLayersKey, String(!!e.target.checked));
        this.updateLayerListHiddenStates(gameState.getCard());
      });
    }

    // Layer toggles for individual card elements
    if (this.toggleCardBleed) {
      this.toggleCardBleed.addEventListener('change', (e) => {
        gameState.updateProperty('layers.cardBleed', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBackgroundLower) {
      this.toggleBackgroundLower.addEventListener('change', (e) => {
        gameState.updateProperty('layers.backgroundLower', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBackgroundUpper) {
      this.toggleBackgroundUpper.addEventListener('change', (e) => {
        gameState.updateProperty('layers.backgroundUpper', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleImageFrame) {
      this.toggleImageFrame.addEventListener('change', (e) => {
        gameState.updateProperty('layers.imageFrame', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleFrameShading) {
      this.toggleFrameShading.addEventListener('change', (e) => {
        gameState.updateProperty('layers.frameShading', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBorder) {
      this.toggleBorder.addEventListener('change', (e) => {
        gameState.updateProperty('layers.border', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleCardId) {
      this.toggleCardId.addEventListener('change', (e) => {
        gameState.updateProperty('layers.cardId', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleTitleBar) {
      this.toggleTitleBar.addEventListener('change', (e) => {
        gameState.updateProperty('layers.titleBar', e.target.checked);
        gameState.updateProperty('layers.panelUpper', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleTitleText) {
      this.toggleTitleText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.titleText', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }


    if (this.toggleArtwork) {
      this.toggleArtwork.addEventListener('change', (e) => {
        gameState.updateProperty('layers.artwork', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.togglePanelBleed) {
      this.togglePanelBleed.addEventListener('change', (e) => {
        gameState.updateProperty('layers.panelBleed', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBottomText) {
      this.toggleBottomText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.bottomText', e.target.checked);
        gameState.updateProperty('layers.panelLower', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleSecondAbilityFrame) {
      this.toggleSecondAbilityFrame.addEventListener('change', (e) => {
        gameState.updateProperty('layers.secondAbilityFrame', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleTopNameGradient) {
      this.toggleTopNameGradient.addEventListener('change', (e) => {
        gameState.updateProperty('layers.topNameGradient', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleBottomNameGradient) {
      this.toggleBottomNameGradient.addEventListener('change', (e) => {
        gameState.updateProperty('layers.bottomNameGradient', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleCostBadge) {
      this.toggleCostBadge.addEventListener('change', (e) => {
        gameState.updateProperty('layers.costBadge', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleAttackModifier) {
      this.toggleAttackModifier.addEventListener('change', (e) => {
        gameState.updateProperty('layers.attackModifier', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }

    if (this.toggleCardText) {
      this.toggleCardText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.cardText', e.target.checked);
        renderer.updateVisibility(gameState.getCard());
      });
    }


    // Description + Title + Cost Badge are rendered as images; use identical drag behavior.
    if (this.descriptionImageLayer || this.cardTitleEl || this.costBadgeLayer) {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let startPos = { x: 0, y: 0 };
      let activeTarget = null;
      let activeTitleDragId = null;
      let activeDescriptionDragId = null;
      let activeLeafletBreakIndex = null;
      let activeLeafletBreakEl = null;
      let pendingLeafletBreakPosition = null;
      let dragBounds = null;
      let dragScale = 1;

      const setActiveTarget = (target, descriptionId = null, titleId = null) => {
        activeTarget = target;
        if (this.artworkLayer) {
          this.artworkLayer.classList.toggle('active', target === 'art');
        }
        if (target === 'description') {
          this.updateDescriptionLayerActiveState(descriptionId || this.activeDescriptionId);
        } else {
          this.updateDescriptionLayerActiveState(null);
        }
        if (target === 'title') {
          this.updateTitleLayerActiveState(titleId || this.activeTitleId);
        } else {
          this.updateTitleLayerActiveState(null);
        }
        if (this.costBadgeLayer) {
          this.costBadgeLayer.classList.toggle('active', target === 'costBadge');
        }
      };

      const onMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const scale = dragScale || 1;
        const newX = startPos.x + dx / scale;
        const newY = startPos.y + dy / scale;
        if (activeTarget === 'description') {
          if (!activeDescriptionDragId) return;
          const context = this.getDescriptionContext();
          const card = gameState.getCard();
          const blocks = this.getDescriptionBlocks(card);
          const updatedBlocks = blocks.map((block) => {
            if (block.id !== activeDescriptionDragId) return block;
            return {
              ...block,
              position: { x: newX, y: newY }
            };
          });
          const updates = { [context.blocksKey]: updatedBlocks };
          if (!context.isLeaflet && card[context.activeIdKey] === activeDescriptionDragId) {
            updates.descriptionPosition = { x: newX, y: newY };
          }
          gameState.updateProperties(updates);
          renderer.updateDescriptionImage(gameState.getCard());
        } else if (activeTarget === 'title') {
          if (!activeTitleDragId) return;
          const card = gameState.getCard();
          const blocks = this.getTitleBlocks(card);
          const updatedBlocks = blocks.map((block) => {
            if (block.id !== activeTitleDragId) return block;
            return {
              ...block,
              position: { x: newX, y: newY }
            };
          });
          const updates = { titleBlocks: updatedBlocks };
          if (card.activeTitleId === activeTitleDragId) {
            updates.titlePosition = { x: newX, y: newY };
          }
          gameState.updateProperties(updates);
          renderer.updateTitleImage(gameState.getCard());
        } else if (activeTarget === 'costBadge') {
          gameState.updateProperty('costBadgePosition', { x: newX, y: newY });
          renderer.updateCostBadge(gameState.getCard());
          renderer.updateCostBadgePosition(gameState.getCard());
        } else if (activeTarget === 'leafletBreak') {
          if (activeLeafletBreakIndex === null || !activeLeafletBreakEl || !dragBounds) return;
          const width = dragBounds.width || 1;
          const height = dragBounds.height || 1;
          const nextX = this.clampLeafletBreakPercent(startPos.x + (dx / width) * 100, startPos.x);
          const nextY = this.clampLeafletBreakPercent(startPos.y + (dy / height) * 100, startPos.y);
          pendingLeafletBreakPosition = { x: nextX, y: nextY };
          activeLeafletBreakEl.style.left = `${nextX}%`;
          activeLeafletBreakEl.style.top = `${nextY}%`;
        }
      };

      const onUp = () => {
        if (!isDragging) return;
        if (activeTarget === 'leafletBreak' && activeLeafletBreakIndex !== null && pendingLeafletBreakPosition) {
          this.setLeafletBreakPosition(activeLeafletBreakIndex, pendingLeafletBreakPosition);
        }
        isDragging = false;
        activeTitleDragId = null;
        activeDescriptionDragId = null;
        activeLeafletBreakIndex = null;
        pendingLeafletBreakPosition = null;
        dragBounds = null;
        if (activeLeafletBreakEl) {
          activeLeafletBreakEl.classList.remove('is-dragging');
          activeLeafletBreakEl = null;
        }
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (this.previewElement && this.previewElement.hasPointerCapture?.(pointerId)) {
          this.previewElement.releasePointerCapture(pointerId);
        }
      };

      let pointerId = null;
      const startTextDrag = (targetKey, textKey, positionKey, e) => {
        const card = gameState.getCard();
        const hasText = textKey === 'description'
          ? !!this.getDescriptionPlainText(card.descriptionRich).trim() || !!String(card.description || '').trim()
          : textKey === 'costBadge'
            ? !!String(card?.costBadge?.value || '').trim()
            : !!card[textKey];
        if (!hasText) return false;
        e.preventDefault();
        e.stopPropagation();
        setActiveTarget(targetKey);
        isDragging = true;
        dragScale = this.getPreviewScale();
        startX = e.clientX;
        startY = e.clientY;
        const current = gameState.getCard()[positionKey] || { x: 0, y: 0 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        pointerId = e.pointerId;
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        if (this.previewElement && Number.isFinite(pointerId)) {
          this.previewElement.setPointerCapture(pointerId);
        }
        return true;
      };

      const startLeafletBreakDrag = (breakIndex, breakEl, e) => {
        const safeIndex = Number(breakIndex);
        if (!Number.isInteger(safeIndex) || safeIndex < 0 || !breakEl) return false;
        const card = gameState.getCard();
        if (String(card?.leafletSide || 'front').toLowerCase() === 'back') return false;
        const entries = this.getLeafletBreakEntries(card);
        const entry = entries[safeIndex];
        if (!entry || !entry.path) return false;
        e.preventDefault();
        e.stopPropagation();
        setActiveTarget('leafletBreak');
        isDragging = true;
        activeLeafletBreakIndex = safeIndex;
        activeLeafletBreakEl = breakEl;
        activeLeafletBreakEl.classList.add('is-dragging');
        pendingLeafletBreakPosition = { x: entry.x, y: entry.y };
        dragBounds = this.previewElement ? this.previewElement.getBoundingClientRect() : null;
        startX = e.clientX;
        startY = e.clientY;
        startPos = { x: entry.x, y: entry.y };
        pointerId = e.pointerId;
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        if (this.previewElement && Number.isFinite(pointerId)) {
          this.previewElement.setPointerCapture(pointerId);
        }
        return true;
      };

      const startTitleDrag = (titleId, e) => {
        const card = gameState.getCard();
        const blocks = this.getTitleBlocks(card);
        const block = blocks.find((entry) => entry.id === titleId);
        if (!block) return false;
        const hasText = !!String(block.text || '').trim();
        if (!hasText) return false;
        e.preventDefault();
        e.stopPropagation();
        this.setActiveTitleBlock(titleId, { syncInput: true });
        setActiveTarget('title', null, titleId);
        isDragging = true;
        activeTitleDragId = titleId;
        dragScale = this.getPreviewScale();
        startX = e.clientX;
        startY = e.clientY;
        const current = block.position || { x: 0, y: 0 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        pointerId = e.pointerId;
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        if (this.previewElement && Number.isFinite(pointerId)) {
          this.previewElement.setPointerCapture(pointerId);
        }
        return true;
      };

      const startDescriptionDrag = (descriptionId, e) => {
        const card = gameState.getCard();
        const blocks = this.getDescriptionBlocks(card);
        const block = blocks.find((entry) => entry.id === descriptionId);
        if (!block) return false;
        const hasText = !!this.getDescriptionPlainText(block.descriptionRich).trim()
          || !!String(block.description || '').trim();
        if (!hasText) return false;
        e.preventDefault();
        e.stopPropagation();
        this.setActiveDescriptionBlock(descriptionId);
        setActiveTarget('description', descriptionId);
        isDragging = true;
        activeDescriptionDragId = descriptionId;
        dragScale = this.getPreviewScale();
        startX = e.clientX;
        startY = e.clientY;
        const current = block.position || { x: 0, y: 0 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        pointerId = e.pointerId;
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        if (this.previewElement && Number.isFinite(pointerId)) {
          this.previewElement.setPointerCapture(pointerId);
        }
        return true;
      };

      const hitTest = (el, e) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
      };

      if (this.previewElement) {
        this.previewElement.style.touchAction = 'none';
        this.previewElement.addEventListener('pointerdown', (e) => {
          const breakItems = Array.from(this.previewElement.querySelectorAll('.leaflet-break-item'));
          for (let i = breakItems.length - 1; i >= 0; i -= 1) {
            const breakItem = breakItems[i];
            if (!hitTest(breakItem, e)) continue;
            const breakIndex = breakItem.dataset.breakIndex;
            if (breakIndex !== undefined && startLeafletBreakDrag(breakIndex, breakItem, e)) {
              return;
            }
          }

          if (this.artworkLayer && this.artworkLayer.contains(e.target)) return;

          const titleLayers = this.getTitleLayerElements();
          for (let i = titleLayers.length - 1; i >= 0; i -= 1) {
            const layer = titleLayers[i];
            if (hitTest(layer, e)) {
              const titleId = layer.dataset.titleId || this.activeTitleId;
              if (titleId) {
                startTitleDrag(titleId, e);
                return;
              }
            }
          }
          const descriptionLayers = this.getDescriptionLayerElements();
          for (let i = descriptionLayers.length - 1; i >= 0; i -= 1) {
            const layer = descriptionLayers[i];
            if (hitTest(layer, e)) {
              const descriptionId = layer.dataset.descriptionId || this.activeDescriptionId;
              if (descriptionId) {
                startDescriptionDrag(descriptionId, e);
                return;
              }
            }
          }
          if (hitTest(this.costBadgeLayer, e)) {
            startTextDrag('costBadge', 'costBadge', 'costBadgePosition', e);
            return;
          }
          setActiveTarget(null);
        });
      }

      // Artwork drag/zoom removed; use crop tool for positioning.
    }

    // Drag and drop
    this.imagePreview.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.imagePreview.classList.add('dragover');
    });

    this.imagePreview.addEventListener('dragleave', () => {
      this.imagePreview.classList.remove('dragover');
    });

    this.imagePreview.addEventListener('drop', (e) => {
      e.preventDefault();
      this.imagePreview.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.applyCardArtFile(files[0]);
      }
    });

    // Artwork edit (Alt + drag / Alt + wheel) from anywhere on the card
    if (this.previewElement) {
      let isAltDragging = false;
      let startX = 0;
      let startY = 0;
      let startPos = { x: 0, y: 0 };

      const onAltMove = (e) => {
        if (!isAltDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newX = startPos.x + dx;
        const newY = startPos.y + dy;
        gameState.updateProperty('artTransform', {
          ...gameState.getCard().artTransform,
          x: newX,
          y: newY
        });
        renderer.updateArtTransform(gameState.getCard());
      };

      const onAltUp = () => {
        if (!isAltDragging) return;
        isAltDragging = false;
        window.removeEventListener('mousemove', onAltMove);
        window.removeEventListener('mouseup', onAltUp);
      };

      this.previewElement.addEventListener('mousedown', (e) => {
        if (!e.altKey) return;
        const card = gameState.getCard();
        if (!(card?.artData || card?.artUrl)) return;
        isAltDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const current = gameState.getCard().artTransform || { x: 0, y: 0, scale: 1 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        window.addEventListener('mousemove', onAltMove);
        window.addEventListener('mouseup', onAltUp);
      });

      this.previewElement.addEventListener('wheel', (e) => {
        if (!e.altKey) return;
        const card = gameState.getCard();
        if (!(card?.artData || card?.artUrl)) return;
        e.preventDefault();
        const current = gameState.getCard().artTransform || { x: 0, y: 0, scale: 1 };
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const nextScale = Math.max(0.5, Math.min(3, (current.scale || 1) + delta));
        gameState.updateProperty('artTransform', {
          ...current,
          scale: nextScale
        });
        renderer.updateArtTransform(gameState.getCard());
      }, { passive: false });
    }

    // File input
    this.fileInput.addEventListener('change', (e) => this.handleFileInput(e));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          this.saveCard();
        }
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          this.undo();
        }
        if (e.key === 'z' && e.shiftKey) {
          e.preventDefault();
          this.redo();
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeElement = document.activeElement;
        const tagName = activeElement ? activeElement.tagName.toLowerCase() : '';
        const isEditable = !!(
          activeElement
          && (activeElement.isContentEditable
            || tagName === 'input'
            || tagName === 'textarea'
            || tagName === 'select'
            || (this.descriptionEditor && this.descriptionEditor.contains(activeElement)))
        );
        if (isEditable) return;
        const activeId = this.activeDescriptionId;
        if (!activeId) return;
        const activeLayer = this.getDescriptionLayerElements().find((layer) => (
          layer.dataset.descriptionId === activeId && layer.classList.contains('active')
        ));
        if (!activeLayer) return;
        e.preventDefault();
        this.removeActiveDescriptionBox();
      }
    });
  }

  newCard() {
    if (confirm('Create a new card? This will clear the current card.')) {
      gameState.reset();
      this.applyDefaultCardIdFromDeck(true);
      this.updateUI();
      alert('New card created!');
    }
  }

  saveCard() {
    const json = gameState.toJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${gameState.card.name || 'card'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Card saved!');
  }

  loadCard() {
    this.openFilePicker(this.fileInput);
  }

  exportCard(type = 'png') {
    if (type === 'json') {
      this.saveCard();
      return;
    }
    renderer.exportAsImage();
  }

  buildDeckViewFilename() {
    const deck = this.getSelectedDeck();
    const name = deck?.name ? String(deck.name) : 'deck-view';
    const safe = name.replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '');
    return safe ? `${safe}.png` : 'deck-view.png';
  }

  async waitForDeckImages() {
    if (!this.deckViewGrid) return;
    const images = Array.from(this.deckViewGrid.querySelectorAll('img'));
    if (!images.length) return;
    const promises = images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      if (typeof img.decode === 'function') {
        return img.decode().catch(() => {});
      }
      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    });
    await Promise.all(promises);
  }

  async captureDeckViewCanvas(scale = 1) {
    const cfg = this.deckTemplateConfig || {};
    const renderScale = Number.isFinite(Number(scale)) ? Math.max(1, Number(scale)) : 1;
    const outW = Math.max(1, Math.round((Number(cfg.width) || 3766) * renderScale));
    const outH = Math.max(1, Math.round((Number(cfg.height) || 4094) * renderScale));
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, outW, outH);

    if (this.deckLayerAssets?.base) {
      await this.drawPrintLayerToContext(ctx, this.deckLayerAssets.base, outW, outH);
    }

    const columns = Math.max(1, Number(cfg.columns) || 10);
    const colWidth = (Number(cfg.columnWidth) || 353) * renderScale;
    const colGap = (Number(cfg.columnGap) || 24) * renderScale;
    const offsetX = (Number(cfg.offsetX) || 12) * renderScale;
    const offsetY = (Number(cfg.offsetY) || 6) * renderScale;
    const rowHeights = Array.isArray(cfg.rowHeights) && cfg.rowHeights.length
      ? cfg.rowHeights.map((h) => Number(h) * renderScale)
      : [((Number(cfg.rowHeight) || 561) * renderScale)];
    const rowGaps = Array.isArray(cfg.rowGaps) && cfg.rowGaps.length === (Number(cfg.rows) || 7) - 1
      ? cfg.rowGaps.map((g) => Number(g) * renderScale)
      : null;
    const rowGapDefault = (Number(cfg.rowGap) || 24) * renderScale;

    const images = this.deckViewGrid ? Array.from(this.deckViewGrid.querySelectorAll('img')) : [];
    const cardScale = Number.isFinite(this.deckViewCardScale) ? this.deckViewCardScale : 1;
    const cardOffsetX = (Number.isFinite(this.deckViewCardOffsetX) ? this.deckViewCardOffsetX : 0) * renderScale;
    const cardOffsetY = (Number.isFinite(this.deckViewCardOffsetY) ? this.deckViewCardOffsetY : 0) * renderScale;

    const rowTop = (rowIndex) => {
      let y = offsetY;
      for (let i = 0; i < rowIndex; i += 1) {
        const h = rowHeights[i] ?? rowHeights[rowHeights.length - 1] ?? rowHeights[0] ?? 0;
        y += h;
        y += rowGaps ? (rowGaps[i] ?? 0) : rowGapDefault;
      }
      return y;
    };

    for (let index = 0; index < images.length; index += 1) {
      const imgEl = images[index];
      const src = imgEl.currentSrc || imgEl.src;
      if (!src) continue;
      try {
        const img = await renderer.loadImage(src);
        const col = index % columns;
        const row = Math.floor(index / columns);
        const cellX = offsetX + (col * (colWidth + colGap));
        const cellH = rowHeights[row] ?? rowHeights[rowHeights.length - 1] ?? rowHeights[0] ?? 0;
        const cellY = rowTop(row);
        const drawW = colWidth * cardScale;
        const drawH = cellH * cardScale;
        const drawX = cellX + ((colWidth - drawW) / 2) + cardOffsetX;
        const drawY = cellY + ((cellH - drawH) / 2) + cardOffsetY;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch (error) {
        console.warn('Failed to draw deck card image:', src, error);
      }
    }

    if (this.deckLayerAssets?.overlay) {
      await this.drawPrintLayerToContext(ctx, this.deckLayerAssets.overlay, outW, outH);
    }

    return canvas;
  }

  async exportDeckView() {
    if (!this.deckTemplate) return;
    const wasOpen = this.isDeckViewOpen();
    if (!wasOpen) {
      this.openDeckView();
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    await this.renderDeckView();
    await this.waitForDeckImages();
    const canvas = await this.captureDeckViewCanvas(1);
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = this.buildDeckViewFilename();
    link.click();
  }

  buildPrintSheetBaseFilename() {
    const deck = this.getSelectedDeck();
    const name = deck?.name ? String(deck.name) : 'print-sheet';
    const safe = name.replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '');
    return safe || 'print-sheet';
  }

  async waitForPrintImages() {
    const pages = this.getPrintSheetPageNodes();
    const images = pages.flatMap((page) => Array.from(page.querySelectorAll('.print-card img')));
    if (!images.length) return;
    const waits = images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      if (typeof img.decode === 'function') {
        return img.decode().catch(() => {});
      }
      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    });
    await Promise.all(waits);
  }

  async drawPrintLayerToContext(ctx, path, width, height) {
    const src = String(path || '').trim();
    if (!src) return;
    try {
      const img = await renderer.loadImage(encodeURI(src));
      ctx.drawImage(img, 0, 0, width, height);
    } catch (error) {
      console.warn('Failed to draw print layer:', src, error);
    }
  }

  async capturePrintPageCanvases(scale = 1) {
    const pages = this.getPrintSheetPageNodes();
    if (!pages.length) return [];
    const canvases = [];
    const layerState = this.getPrintLayerState();
    const cfg = this.printTemplateConfig || {};
    const baseW = Math.max(1, Math.round(Number(cfg.width) || 2550));
    const baseH = Math.max(1, Math.round(Number(cfg.height) || 3300));
    const renderScale = Number.isFinite(Number(scale)) ? Math.max(1, Number(scale)) : 1;
    const outW = Math.max(1, Math.round(baseW * renderScale));
    const outH = Math.max(1, Math.round(baseH * renderScale));
    const colWidth = Math.round((Number(cfg.columnWidth) || 1004) * renderScale);
    const colGap = Math.round((Number(cfg.columnGap) || 118) * renderScale);
    const rowHeight = Math.round((Number(cfg.rowHeight) || 626) * renderScale);
    const rowGap = Math.round((Number(cfg.rowGap) || 119) * renderScale);
    const offsetX = Math.round((Number(cfg.offsetX) || 211) * renderScale);
    const offsetY = Math.round((Number(cfg.offsetY) || 137) * renderScale);
    const columns = Math.max(1, Number(cfg.columns) || 2);

    for (const page of pages) {
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (this.printLayerAssets.base) {
        await this.drawPrintLayerToContext(ctx, this.printLayerAssets.base, outW, outH);
      }
      if (layerState.safe) {
        await this.drawPrintLayerToContext(ctx, this.printLayerAssets.safe, outW, outH);
      }
      if (layerState.cut) {
        await this.drawPrintLayerToContext(ctx, this.printLayerAssets.cut, outW, outH);
      }

      const imgs = Array.from(page.querySelectorAll('.print-card img'));
      for (let index = 0; index < imgs.length; index += 1) {
        const imgEl = imgs[index];
        const src = imgEl.currentSrc || imgEl.src;
        if (!src) continue;
        try {
          const img = await renderer.loadImage(src);
          const col = index % columns;
          const row = Math.floor(index / columns);
          const x = offsetX + (col * (colWidth + colGap));
          const y = offsetY + (row * (rowHeight + rowGap));
          ctx.drawImage(img, x, y, colWidth, rowHeight);
        } catch (error) {
          console.warn('Failed to draw print card image:', src, error);
        }
      }
      canvases.push(canvas);
    }
    return canvases;
  }

  async exportPrintSheetAsPng() {
    if (!this.isPrintSheetOpen()) this.openPrintSheet();
    await this.renderPrintSheet();
    await this.waitForPrintImages();
    const canvases = await this.capturePrintPageCanvases();
    if (!canvases.length) return;

    let output = canvases[0];
    if (canvases.length > 1) {
      const width = Math.max(...canvases.map((canvas) => canvas.width));
      const height = canvases.reduce((sum, canvas) => sum + canvas.height, 0);
      output = document.createElement('canvas');
      output.width = width;
      output.height = height;
      const ctx = output.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        let y = 0;
        canvases.forEach((canvas) => {
          ctx.drawImage(canvas, 0, y);
          y += canvas.height;
        });
      }
    }

    const link = document.createElement('a');
    link.href = output.toDataURL('image/png');
    link.download = `${this.buildPrintSheetBaseFilename()}_print_sheet.png`;
    link.click();
  }

  async exportPrintSheetAsPdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF export is unavailable right now. Reload and try again.');
      return;
    }
    if (!this.isPrintSheetOpen()) this.openPrintSheet();
    await this.renderPrintSheet();
    await this.waitForPrintImages();
    const canvases = await this.capturePrintPageCanvases(2);
    if (!canvases.length) return;

    const { jsPDF } = window.jspdf;
    const first = canvases[0];
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [first.width, first.height]
    });

    canvases.forEach((canvas, index) => {
      if (index > 0) {
        pdf.addPage([canvas.width, canvas.height], 'portrait');
      }
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');
    });

    pdf.save(`${this.buildPrintSheetBaseFilename()}_print_sheet.pdf`);
  }

  async printPrintSheet() {
    if (!this.isPrintSheetOpen()) this.openPrintSheet();
    await this.renderPrintSheet();
    await this.waitForPrintImages();
    const canvases = await this.capturePrintPageCanvases(2);
    if (!canvases.length) return;

    const win = window.open('', '_blank');
    if (!win) {
      alert('Unable to open print window. Please allow popups for this site.');
      return;
    }
    const images = canvases.map((canvas) => canvas.toDataURL('image/png'));
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Print Sheet</title>
  <style>
    @page { margin: 0; }
    body { margin: 0; background: #fff; }
    img { display: block; width: 100%; page-break-after: always; }
    img:last-child { page-break-after: auto; }
  </style>
</head>
<body>
  ${images.map((src) => `<img src="${src}" alt="Print sheet page" />`).join('')}
</body>
</html>`;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  toggleExportMenu(force) {
    if (!this.exportMenuPanel || !this.btnExport) return;
    const isOpen = this.exportMenuPanel.classList.contains('is-open');
    const next = typeof force === 'boolean' ? force : !isOpen;
    this.exportMenuPanel.classList.toggle('is-open', next);
    this.exportMenuPanel.setAttribute('aria-hidden', next ? 'false' : 'true');
    this.btnExport.setAttribute('aria-expanded', next ? 'true' : 'false');
  }

  closeExportMenu() {
    this.toggleExportMenu(false);
  }

  handleFileInput(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      if (gameState.fromJSON(json)) {
        this.updateUI();
        alert('Card loaded successfully!');
      } else {
        alert('Failed to load card. Invalid JSON format.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    this.fileInput.value = '';
  }

  async applyCardArtFile(file) {
    if (!file) return false;
    if (!this.validateImageFile(file, { label: 'image' })) return false;

    let imageData = '';
    try {
      imageData = await this.readFileAsDataUrl(file, 'Failed to read card art.');
    } catch (error) {
      console.warn('Failed to upload card art:', error);
      alert('Failed to read the selected image.');
      return false;
    }

    if (!imageData) return false;

    const openCropperOnUpload = !!(this.toggleCropperOnUpload && this.toggleCropperOnUpload.checked);
    const defaultTransform = { x: 0, y: 0, scale: 1 };

    gameState.updateProperties({
      artData: openCropperOnUpload ? null : imageData,
      artUrl: null,
      artSourceData: openCropperOnUpload ? imageData : null,
      artSourceUrl: null,
      artCropTransform: null,
      artTransform: defaultTransform,
      artCropToFrame: false,
      artWasCropped: false
    });

    this.imagePreview.innerHTML = `<img src="${imageData}" alt="Card Art">`;
    this.btnClearImage.style.display = 'inline-block';
    renderer.setCardArt(openCropperOnUpload ? null : imageData);

    if (openCropperOnUpload) {
      this.openCropper(imageData, defaultTransform);
    }

    return true;
  }

  async handleImageUpload(event) {
    const inputEl = event?.target || null;
    const file = inputEl?.files?.[0];
    if (!file) return;
    try {
      await this.applyCardArtFile(file);
    } finally {
      if (inputEl) inputEl.value = '';
    }
  }

  clearImage() {
    gameState.updateProperty('artData', null);
    gameState.updateProperty('artUrl', null);
    gameState.updateProperty('artSourceData', null);
    gameState.updateProperty('artSourceUrl', null);
    gameState.updateProperty('artCropTransform', null);
    gameState.updateProperty('artWasCropped', false);
    this.imageUploadInput.value = '';
    this.imagePreview.innerHTML = '';
    this.btnClearImage.style.display = 'none';
    renderer.setCardArt(null);
  }

  resetCanvas() {
    if (confirm('Reset the canvas to defaults? This will reset text, images, and positions.')) {
      gameState.reset();
      this.updateUI();
    }
  }

  handleArtSelect(event) {
    const value = event.target.value || '';
    gameState.updateProperty('artUrl', value);
    gameState.updateProperty('artData', null);
    gameState.updateProperty('artSourceData', null);
    gameState.updateProperty('artSourceUrl', null);
    gameState.updateProperty('artCropTransform', null);
    gameState.updateProperty('artTransform', { x: 0, y: 0, scale: 1 });
    gameState.updateProperty('artCropToFrame', false);
    gameState.updateProperty('artWasCropped', false);
    if (value) {
      renderer.setCardArt(value);
      this.imagePreview.innerHTML = `<img src="${value}" alt="Card Art">`;
      this.btnClearImage.style.display = 'inline-block';
      } else {
      this.imagePreview.innerHTML = '';
      this.btnClearImage.style.display = 'none';
      renderer.setCardArt(null);
    }
  }

  openCropper(imageSrc, transform = { x: 0, y: 0, scale: 1 }) {
    if (!this.cropModal || !this.cropArea || !this.cropImage) return;
    this.cropImage.src = imageSrc;
    this.cropSourceData = imageSrc.startsWith('data:') ? imageSrc : null;
    this.cropSourceUrl = imageSrc.startsWith('data:') ? null : imageSrc;
    this.disableCropPreview();
    this.cropModal.classList.add('is-open');
    this.cropModal.setAttribute('aria-hidden', 'false');

    const frame = this.getSelectedCropMaskPath();
    this.applyCropMask(frame, transform, true);
  }

  closeCropper() {
    if (!this.cropModal) return;
    this.cropModal.classList.remove('is-open');
    this.cropModal.setAttribute('aria-hidden', 'true');
    if (this.cropArea) this.cropArea.classList.remove('dragging');
    this.cropDragState = null;
    this.disableCropPreview();
  }

  getSelectedCropMaskPath() {
    const fallback = this.defaultCropMask || 'Assets/images/Card Art/Common Loot.png';
    if (!this.cropMaskSelect) return fallback;
    const value = String(this.cropMaskSelect.value || '').trim();
    return value || fallback;
  }

  applyCropMask(frame, transform = null, resetTransform = true) {
    const safeFrame = frame || this.defaultCropMask || 'Assets/images/Card Art/Common Loot.png';
    if (this.cropFrameOverlay) {
      this.cropFrameOverlay.style.backgroundImage = `url('${safeFrame}')`;
    }
    this.loadImageSize(safeFrame).then((size) => {
      if (size && this.cropArea) {
        this.cropArea.style.width = `${size.width}px`;
        this.cropArea.style.height = `${size.height}px`;
      }
      requestAnimationFrame(() => {
        if (resetTransform) {
          const scaleFactor = 1;
          const baseX = Number(transform?.x) || 0;
          const baseY = Number(transform?.y) || 0;
          const baseScale = Number(transform?.scale) || 1;
          this.cropState.scaleFactor = scaleFactor;
          this.cropState.x = baseX;
          this.cropState.y = baseY;
          this.cropState.scale = baseScale;
          if (this.cropZoomInput) this.cropZoomInput.value = String(baseScale);
        }
        this.updateCropperTransform();
      });
    });
  }

  async applyCropper() {
    const source = this.cropSourceData || this.cropSourceUrl;
    if (!source) {
      this.closeCropper();
      return;
    }
    const scaleFactor = this.cropState.scaleFactor || 1;
    const nextTransform = {
      x: this.cropState.x / scaleFactor,
      y: this.cropState.y / scaleFactor,
      scale: this.cropState.scale
    };
    const cropped = await this.renderCroppedArt(source, nextTransform);
    if (!cropped) {
      this.closeCropper();
      return;
    }

    gameState.updateProperty('artCroppedData', null);
    gameState.updateProperties({
      artData: cropped,
      artUrl: null,
      artSourceData: null,
      artSourceUrl: null,
      artCropTransform: null,
      artTransform: { x: 0, y: 0, scale: 1 },
      artCropToFrame: false,
      artWasCropped: true
    });
    if (this.artSelect) this.artSelect.value = '';
    if (this.imagePreview) {
      this.imagePreview.innerHTML = `<img src="${cropped}" alt="Card Art">`;
    }
    if (this.btnClearImage) this.btnClearImage.style.display = 'inline-block';
    renderer.setCardArt(cropped);
    renderer.updateArtTransform(gameState.getCard());
    renderer.updateArtCrop(gameState.getCard());
    renderer.render(gameState.getCard());
    this.closeCropper();
  }

  updateCropperTransform() {
    if (!this.cropImage) return;
    this.cropImage.style.transform = `translate(calc(-50% + ${this.cropState.x}px), calc(-50% + ${this.cropState.y}px)) scale(${this.cropState.scale})`;
  }

  async toggleCropPreview() {
    if (this.cropPreviewActive) {
      this.disableCropPreview();
      return;
    }
    const source = this.cropSourceData || this.cropSourceUrl;
    if (!source || !this.cropPreviewImage) return;
    const nextTransform = {
      x: this.cropState.x,
      y: this.cropState.y,
      scale: this.cropState.scale
    };
    const preview = await this.renderCroppedArt(source, nextTransform);
    if (!preview) return;
    this.cropPreviewImage.src = preview;
    this.cropPreviewImage.style.display = 'block';
    if (this.cropImage) this.cropImage.style.visibility = 'hidden';
    if (this.cropFrameOverlay) this.cropFrameOverlay.style.display = 'none';
    this.cropPreviewActive = true;
    if (this.cropPreviewBtn) this.cropPreviewBtn.textContent = 'Edit Crop';
  }

  disableCropPreview() {
    if (this.cropPreviewImage) {
      this.cropPreviewImage.src = '';
      this.cropPreviewImage.style.display = 'none';
    }
    if (this.cropImage) this.cropImage.style.visibility = '';
    if (this.cropFrameOverlay) this.cropFrameOverlay.style.display = '';
    this.cropPreviewActive = false;
    if (this.cropPreviewBtn) this.cropPreviewBtn.textContent = 'Preview Crop';
  }

  loadImageSize(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async renderCroppedArt(source, transform) {
    try {
      const img = await this.loadImageLocal(source);
      if (!img) return null;
      const maskPath = this.getSelectedCropMaskPath();
      let maskImg = null;
      try {
        maskImg = await this.loadImageLocal(maskPath);
      } catch (error) {
        // Fall back to default mask.
      }
      if (!maskImg && maskPath !== this.defaultCropMask) {
        try {
          maskImg = await this.loadImageLocal(this.defaultCropMask);
        } catch (error) {
          maskImg = null;
        }
      }
      if (!maskImg) return null;

      const frameW = maskImg.width;
      const frameH = maskImg.height;

      const canvas = document.createElement('canvas');
      canvas.width = frameW;
      canvas.height = frameH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const tx = Number(transform?.x) || 0;
      const ty = Number(transform?.y) || 0;
      const scale = Number(transform?.scale) || 1;
      ctx.save();
      ctx.translate(frameW / 2 + tx, frameH / 2 + ty);
      ctx.scale(scale, scale);
      ctx.translate(-img.width / 2, -img.height / 2);
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      if (this.workspaceMode !== 'leaflet') {
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskImg, 0, 0, frameW, frameH);
        ctx.globalCompositeOperation = 'source-over';
      }

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.warn('Failed to crop art:', error);
      return null;
    }
  }

  loadImageLocal(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  getPreviewScale() {
    const baseRaw = this.previewContainer
      ? getComputedStyle(this.previewContainer).getPropertyValue('--card-width')
      : '';
    const baseWidth = parseFloat(baseRaw) || 520;
    const currentWidth = this.previewElement ? this.previewElement.clientWidth : baseWidth;
    if (!baseWidth || !currentWidth) return 1;
    return currentWidth / baseWidth;
  }

  clampLetterSpacing(value) {
    const spacing = Number(value);
    if (!Number.isFinite(spacing)) return 0;
    return Math.max(-10, Math.min(10, spacing));
  }

  clampDescriptionFontSize(value, fallback = this.defaultDescriptionFontSize) {
    const size = Number(value);
    if (!Number.isFinite(size)) return fallback;
    return Math.max(8, Math.min(96, size));
  }

  normalizeDescriptionColor(value, fallback = this.defaultDescriptionColor) {
    const raw = String(value || '').trim();
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) return raw;
    return fallback;
  }

  normalizeDiceColor(value, fallback = this.defaultDiceColor) {
    const raw = String(value || '').trim();
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) return raw;
    return fallback;
  }

  syncDefaultDiceColorControls(value) {
    const color = this.normalizeDiceColor(value, this.defaultDiceColor).toUpperCase();
    if (this.defaultDiceColorPicker) this.defaultDiceColorPicker.value = color;
    if (this.defaultDiceColorInput) this.defaultDiceColorInput.value = color;
    return color;
  }

  syncDescriptionColorControls(value) {
    const color = this.normalizeDescriptionColor(value, this.defaultDescriptionColor).toUpperCase();
    if (this.descriptionColorPicker) this.descriptionColorPicker.value = color;
    if (this.descriptionColorHexInput) this.descriptionColorHexInput.value = color;
    return color;
  }

  normalizeDescriptionHexInput(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const withHash = raw.startsWith('#') ? raw : `#${raw}`;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(withHash)) return withHash;
    return '';
  }

  clampLineHeightScale(value) {
    const spacing = Number(value);
    if (!Number.isFinite(spacing)) return this.defaultDescriptionLineHeight;
    return Math.max(0.8, Math.min(1.6, spacing));
  }

  clampDescriptionBoxScale(value) {
    const scale = Number(value);
    if (!Number.isFinite(scale)) return this.defaultDescriptionBoxScale;
    return Math.max(-3, Math.min(3, scale));
  }

  applyLayerPresetForCard(cardType, cardSubType) {
    const updates = {};
    if (cardType === 'Hero Upgrade' && cardSubType === 'Ability Upgrade') {
      updates['layers.imageFrame'] = false;
      updates['layers.attackModifier'] = false;
      updates['layers.secondAbilityFrame'] = true;
      updates['layers.topNameGradient'] = true;
      updates['layers.bottomNameGradient'] = true;
      updates['layers.cardId'] = true;
    }
    if (cardType === 'Hero Upgrade' && cardSubType === 'Defense Upgrade') {
      updates['layers.imageFrame'] = false;
      updates['layers.attackModifier'] = false;
      updates['layers.secondAbilityFrame'] = false;
      updates['layers.topNameGradient'] = true;
      updates['layers.bottomNameGradient'] = true;
      updates['layers.cardId'] = true;
    }
    if (cardType === 'Board Abilities' && cardSubType === 'Offensive ability') {
      updates['layers.imageFrame'] = false;
      updates['layers.attackModifier'] = false;
      updates['layers.secondAbilityFrame'] = false;
      updates['layers.topNameGradient'] = true;
      updates['layers.bottomNameGradient'] = false;
      updates['layers.cardId'] = false;
    }
    if (!Object.keys(updates).length) return;
    gameState.updateProperties(updates);
    const card = gameState.getCard();
    renderer.updateVisibility(card);
    if (this.toggleImageFrame) this.toggleImageFrame.checked = !!(card.layers && card.layers.imageFrame);
    if (this.toggleAttackModifier) this.toggleAttackModifier.checked = !!(card.layers && card.layers.attackModifier);
    if (this.toggleSecondAbilityFrame) this.toggleSecondAbilityFrame.checked = !!(card.layers && card.layers.secondAbilityFrame);
    if (this.toggleTopNameGradient) this.toggleTopNameGradient.checked = !!(card.layers && card.layers.topNameGradient);
    if (this.toggleBottomNameGradient) this.toggleBottomNameGradient.checked = !!(card.layers && card.layers.bottomNameGradient);
    if (this.toggleCardId) this.toggleCardId.checked = !!(card.layers && card.layers.cardId);
  }

  async copyTextToClipboard(text) {
    const value = String(text || '');
    if (!value) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch (error) {
      // Fall back to execCommand.
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch (error) {
      return false;
    }
  }

  clampCardIdFontSize(value) {
    const size = Number(value);
    if (!Number.isFinite(size)) return this.defaultCardIdFontSize;
    return Math.max(8, Math.min(48, size));
  }

  clampCardIdOffset(value) {
    const offset = Number(value);
    if (!Number.isFinite(offset)) return this.defaultCardIdOffset;
    return Math.max(-10, Math.min(10, offset));
  }

  isBoardAbilityCard(card = null) {
    const target = card && typeof card === 'object' ? card : gameState.getCard();
    return String(target?.cardType || '') === 'Board Abilities';
  }

  isDeckEligibleCard(card = null) {
    return !this.isBoardAbilityCard(card);
  }

  updateDeckSaveAvailability(card = null) {
    const isBoardAbility = this.isBoardAbilityCard(card);
    if (this.deckSaveBtn) {
      this.deckSaveBtn.disabled = false;
      this.deckSaveBtn.textContent = isBoardAbility ? 'Save Ability' : 'Save Card';
      this.deckSaveBtn.title = isBoardAbility ? 'Save this Board Ability to the board ability library.' : '';
    }
    if (this.deckLoadBtn) {
      this.deckLoadBtn.disabled = isBoardAbility;
      this.deckLoadBtn.title = isBoardAbility ? 'Board Abilities are loaded from the board ability library later.' : '';
    }
    if (this.deckDeleteCardBtn) {
      this.deckDeleteCardBtn.disabled = isBoardAbility;
      this.deckDeleteCardBtn.title = isBoardAbility ? 'Board Abilities are managed outside the deck system.' : '';
    }
    if (this.deckCardSelect) {
      this.deckCardSelect.disabled = isBoardAbility;
      this.deckCardSelect.title = isBoardAbility ? 'Board Abilities do not use deck slots.' : '';
    }
  }

  normalizeCardIdInput(value) {
    const raw = String(value || '');
    const letters = raw.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4);
    const digits = raw.replace(/[^0-9]/g, '').slice(0, 4);
    const parts = [];
    if (letters) parts.push(letters);
    if (digits.length > 0) {
      parts.push(digits.slice(0, Math.min(2, digits.length)));
    }
    if (digits.length >= 2) {
      parts.push(`v${digits.slice(2, 4)}`);
    }
    return parts.join(' ').slice(0, 11);
  }

  getSelectedDeck() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    return deckId && store.decks ? store.decks[deckId] : null;
  }

  getDeckPrefix(name) {
    const letters = String(name || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
    return letters.slice(0, 4) || '';
  }

  buildDeckCardId(deck, number) {
    if (!deck) return '';
    const prefix = this.getDeckPrefix(deck.name);
    if (!prefix) return '';
    const paddedNumber = String(Math.max(1, Number(number) || 1)).padStart(2, '0');
    const raw = `${prefix} ${paddedNumber} v1`;
    return this.normalizeCardIdInput(raw);
  }

  applyDefaultCardIdFromDeck(force = false) {
    const deck = this.getSelectedDeck();
    if (!deck) return;
    const count = Array.isArray(deck.cards) ? deck.cards.length : 0;
    const nextNumber = count + 1;
    const nextId = this.buildDeckCardId(deck, nextNumber);
    if (!nextId) return;
    const current = gameState.getCard().cardId || '';
    if (!force && current) return;
    gameState.updateProperty('cardId', nextId);
  }

  async loadDefaultDeckManifest() {
    try {
      const response = await fetch('Assets/Deck/default/manifest.json', { cache: 'no-store' });
      if (!response.ok) return [];
      const manifest = await response.json();
      if (Array.isArray(manifest)) return manifest;
      if (Array.isArray(manifest.files)) return manifest.files;
      return [];
    } catch (error) {
      console.warn('Failed to load default deck manifest:', error);
      return [];
    }
  }

  async importDefaultDeckCards(deck) {
    if (!deck) return [];
    const files = await this.loadDefaultDeckManifest();
    if (!files.length) return [];
    await this.ensureDeckDefaultCard();

    const cards = [];
    let index = 1;
    for (const file of files) {
      const safeFile = String(file || '').trim();
      if (!safeFile) continue;
      try {
        const response = await fetch(`Assets/Deck/default/${safeFile}`, { cache: 'no-store' });
        if (!response.ok) continue;
        const data = await response.json();
        const base = this.getDeckDefaultCardSnapshot();
        const cardData = { ...base, ...data };
        const generatedId = this.buildDeckCardId(deck, index);
        if (generatedId) {
          cardData.cardId = generatedId;
        }
        const name = String(cardData.name || `Card ${index}`).trim() || `Card ${index}`;
        const entry = {
          id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name,
          savedAt: new Date().toISOString(),
          json: JSON.stringify(cardData, null, 2)
        };
        cards.push(entry);
        index += 1;
      } catch (error) {
        console.warn('Failed to import default deck card:', file, error);
      }
    }
    return cards;
  }

  updateUI() {
    let card = gameState.getCard();
    card = this.ensureTitleBlocks(card);
    card = this.ensureDescriptionBlocks(card);
    const scale = this.getPreviewScale();
    if (card.positionUnits !== 'base') {
      const updates = { positionUnits: 'base' };
      const titleBlocks = Array.isArray(card.titleBlocks) ? card.titleBlocks : [];
      if (titleBlocks.length) {
        const scaledTitleBlocks = titleBlocks.map((block) => ({
          ...block,
          position: {
            x: (Number(block?.position?.x) || 0) / scale,
            y: (Number(block?.position?.y) || 0) / scale
          }
        }));
        updates.titleBlocks = scaledTitleBlocks;
        const activeId = this.getActiveTitleId(card, scaledTitleBlocks);
        const activeBlock = scaledTitleBlocks.find((block) => block.id === activeId);
        if (activeBlock) {
          updates.titlePosition = activeBlock.position;
        }
      } else if (card.titlePosition) {
        updates.titlePosition = {
          x: (Number(card.titlePosition.x) || 0) / scale,
          y: (Number(card.titlePosition.y) || 0) / scale
        };
      }
      const descContext = this.getDescriptionContext();
      const blocks = Array.isArray(card[descContext.blocksKey]) ? card[descContext.blocksKey] : [];
      if (blocks.length) {
        const scaledBlocks = blocks.map((block) => ({
          ...block,
          position: {
            x: (Number(block?.position?.x) || 0) / scale,
            y: (Number(block?.position?.y) || 0) / scale
          }
        }));
        updates[descContext.blocksKey] = scaledBlocks;
        const activeId = this.getActiveDescriptionId(card, scaledBlocks);
        const activeBlock = scaledBlocks.find((block) => block.id === activeId);
        if (activeBlock && !descContext.isLeaflet) {
          updates.descriptionPosition = activeBlock.position;
        }
      } else if (!descContext.isLeaflet && card.descriptionPosition) {
        updates.descriptionPosition = {
          x: (Number(card.descriptionPosition.x) || 0) / scale,
          y: (Number(card.descriptionPosition.y) || 0) / scale
        };
      }
    if (card.costBadgePosition) {
      updates.costBadgePosition = {
        x: (Number(card.costBadgePosition.x) || 0) / scale,
        y: (Number(card.costBadgePosition.y) || 0) / scale
      };
    }
      gameState.updateProperties(updates);
      card = gameState.getCard();
    }
    const fontUpdates = {};
    if (!card.titleFont) fontUpdates.titleFont = this.defaultTitleFont;
    if (!card.descriptionFont) fontUpdates.descriptionFont = this.defaultDescriptionFont;
    if (!card.titleFontSize) fontUpdates.titleFontSize = this.defaultTitleFontSize;
    if (!card.descriptionFontSize) fontUpdates.descriptionFontSize = this.defaultDescriptionFontSize;
    if (!card.descriptionLineHeightScale) fontUpdates.descriptionLineHeightScale = this.defaultDescriptionLineHeight;
    if (card.titleLetterSpacing === undefined) fontUpdates.titleLetterSpacing = this.defaultTitleLetterSpacing;
    if (card.descriptionLetterSpacing === undefined) fontUpdates.descriptionLetterSpacing = this.defaultDescriptionLetterSpacing;
    if (card.descriptionBaselineOffset === undefined) fontUpdates.descriptionBaselineOffset = this.defaultDescriptionBaselineOffset;
    if (card.descriptionColor === undefined) fontUpdates.descriptionColor = this.defaultDescriptionColor;
    if (card.defaultDiceColor === undefined) fontUpdates.defaultDiceColor = this.defaultDiceColor;
    if (Object.keys(fontUpdates).length > 0) {
      gameState.updateProperties(fontUpdates);
      card = gameState.getCard();
    }
    const normalizedDefaultDiceColor = this.normalizeDiceColor(card.defaultDiceColor, this.defaultDiceColor);
    if (normalizedDefaultDiceColor !== card.defaultDiceColor) {
      gameState.updateProperty('defaultDiceColor', normalizedDefaultDiceColor);
      card = gameState.getCard();
    }
    const descriptionContext = this.getDescriptionContext();
    if (!descriptionContext.isLeaflet && !Array.isArray(card.descriptionRich)) {
      const activeBlock = this.getActiveDescriptionBlock(card);
      gameState.updateProperty(
        'descriptionRich',
        Array.isArray(activeBlock?.descriptionRich) ? activeBlock.descriptionRich : []
      );
      card = gameState.getCard();
    }
    if (!descriptionContext.isLeaflet && card.descriptionHtml === undefined) {
      const activeBlock = this.getActiveDescriptionBlock(card);
      gameState.updateProperty('descriptionHtml', activeBlock?.descriptionHtml || '');
      card = gameState.getCard();
    }

    if (card.cardId === undefined) {
      gameState.updateProperty('cardId', '');
      card = gameState.getCard();
    }
    if (!card.cardIdFont) {
      gameState.updateProperty('cardIdFont', this.defaultCardIdFont);
      card = gameState.getCard();
    } else if (card.cardIdFont === 'MyriadPro-Light') {
      gameState.updateProperty('cardIdFont', this.defaultCardIdFont);
      card = gameState.getCard();
    }
    if (card.cardIdFontSize === undefined) {
      gameState.updateProperty('cardIdFontSize', this.defaultCardIdFontSize);
      card = gameState.getCard();
    }
    if (card.cardIdOffset === undefined) {
      gameState.updateProperty('cardIdOffset', this.defaultCardIdOffset);
      card = gameState.getCard();
    }
    if (card.cardIdOffsetX === undefined) {
      gameState.updateProperty('cardIdOffsetX', this.defaultCardIdOffsetX);
      card = gameState.getCard();
    }
    if (!Array.isArray(card.abilityDiceEntries)) {
      gameState.updateProperty('abilityDiceEntries', []);
      card = gameState.getCard();
    }
    if (!Array.isArray(card.customStatusEffects)) {
      gameState.updateProperty('customStatusEffects', []);
      card = gameState.getCard();
    }
    const rawLeafletLayers = card.leafletLayers || {};
    const normalizedLeafletLayers = {
      background: rawLeafletLayers.background !== false,
      art: rawLeafletLayers.art !== false,
      title: rawLeafletLayers.title !== false,
      text: rawLeafletLayers.text !== false
    };
    if (
      !card.leafletLayers
      || typeof card.leafletLayers !== 'object'
      || card.leafletLayers.background === undefined
      || card.leafletLayers.art === undefined
      || card.leafletLayers.title === undefined
      || card.leafletLayers.text === undefined
    ) {
      gameState.updateProperty('leafletLayers', normalizedLeafletLayers);
      card = gameState.getCard();
    }
    if (!card.leafletSide) {
      gameState.updateProperty('leafletSide', 'front');
      card = gameState.getCard();
    }
    const normalizedLeafletBreaks = this.getLeafletBreakEntries(card);
    const rawLeafletBreaks = Array.isArray(card.leafletBreaks) ? card.leafletBreaks : [];
    const leafletBreaksChanged = !Array.isArray(card.leafletBreaks)
      || rawLeafletBreaks.length !== normalizedLeafletBreaks.length
      || rawLeafletBreaks.some((entry, index) => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return true;
        const normalized = normalizedLeafletBreaks[index];
        return String(entry.path || '') !== normalized.path
          || this.clampLeafletBreakPercent(entry.x, normalized.x) !== normalized.x
          || this.clampLeafletBreakPercent(entry.y, normalized.y) !== normalized.y;
      });
    if (leafletBreaksChanged) {
      gameState.updateProperty('leafletBreaks', normalizedLeafletBreaks);
      card = gameState.getCard();
    }

    const layerUpdates = {};
    const layers = card.layers || {};
    if (layers.cardBleed === undefined) layerUpdates['layers.cardBleed'] = false;
    if (layers.secondAbilityFrame === undefined) layerUpdates['layers.secondAbilityFrame'] = true;
    if (layers.topNameGradient === undefined) layerUpdates['layers.topNameGradient'] = true;
    if (layers.bottomNameGradient === undefined) layerUpdates['layers.bottomNameGradient'] = true;
    if (Object.keys(layerUpdates).length > 0) {
      gameState.updateProperties(layerUpdates);
      card = gameState.getCard();
    }

    const normalizedLayerOrder = this.normalizeLayerOrder(card.layerOrder);
    if (!this.areLayerOrdersEqual(card.layerOrder, normalizedLayerOrder)) {
      gameState.updateProperty('layerOrder', normalizedLayerOrder);
      card = gameState.getCard();
    }
    const normalizedHiddenLayers = this.normalizeHiddenLayers(card.hiddenLayers, normalizedLayerOrder);
    if (!this.areLayerOrdersEqual(card.hiddenLayers, normalizedHiddenLayers)) {
      gameState.updateProperty('hiddenLayers', normalizedHiddenLayers);
      card = gameState.getCard();
    }
    this.syncLayerListToOrder(normalizedLayerOrder);
    this.updateLayerListHiddenStates(card);

    // Update inputs
    if (this.cardNameInput) {
      const activeTitleBlock = this.getActiveTitleBlock(card);
      const value = activeTitleBlock ? activeTitleBlock.text : card.name;
      const rawTitle = String(value || '');
      this.cardNameInput.value = rawTitle;
      if (rawTitle !== card.name || (activeTitleBlock && rawTitle !== activeTitleBlock.text)) {
        const blocks = this.getTitleBlocks(card);
        const activeId = this.getActiveTitleId(card, blocks);
        const updatedBlocks = blocks.map((block) => {
          if (block.id !== activeId) return block;
          return { ...block, text: rawTitle };
        });
        gameState.updateProperties({
          name: rawTitle,
          titleBlocks: updatedBlocks,
          activeTitleId: activeId
        });
        card = gameState.getCard();
      }
    }
    if (this.cardIdInput) this.cardIdInput.value = card.cardId || '';
    if (this.cardIdFontSizeInput) {
      const size = this.clampCardIdFontSize(card.cardIdFontSize);
      this.cardIdFontSizeInput.value = size;
      if (this.cardIdFontSizeValue) this.cardIdFontSizeValue.textContent = size;
    }
    if (this.cardIdPositionXInput) {
      const offset = this.clampCardIdOffset(card.cardIdOffsetX);
      this.cardIdPositionXInput.value = offset;
      if (this.cardIdPositionXValue) this.cardIdPositionXValue.textContent = offset.toFixed(1);
    }
    if (this.cardIdPositionYInput) {
      const offset = this.clampCardIdOffset(card.cardIdOffset);
      this.cardIdPositionYInput.value = offset;
      if (this.cardIdPositionYValue) this.cardIdPositionYValue.textContent = offset.toFixed(1);
    }
    this.syncDescriptionEditor(card);
    this.ensureFontSelection(this.titleFontSelect, card.titleFont || this.defaultTitleFont);
    this.ensureFontSelection(this.descriptionFontSelect, card.descriptionFont || this.defaultDescriptionFont);
    if (this.titleFontSizeInput) this.titleFontSizeInput.value = card.titleFontSize || this.defaultTitleFontSize;
    const activeDescriptionBlock = this.getActiveDescriptionBlock(card);
    if (this.descriptionFontSizeInput) {
      this.descriptionFontSizeInput.value = this.clampDescriptionFontSize(
        activeDescriptionBlock?.fontSize ?? card.descriptionFontSize,
        this.getDescriptionContext().defaultFontSize
      );
    }
    this.syncDescriptionColorControls(this.normalizeDescriptionColor(
      activeDescriptionBlock?.color,
      this.normalizeDescriptionColor(card.descriptionColor, this.defaultDescriptionColor)
    ));
    if (this.descriptionLineHeightInput) {
      const spacing = this.clampLineHeightScale(card.descriptionLineHeightScale);
      this.descriptionLineHeightInput.value = spacing;
      if (this.descriptionLineHeightValue) this.descriptionLineHeightValue.textContent = spacing.toFixed(2);
    }
    if (this.titleLetterSpacingInput) {
      const spacing = this.clampLetterSpacing(card.titleLetterSpacing);
      this.titleLetterSpacingInput.value = spacing;
      if (this.titleLetterSpacingValue) this.titleLetterSpacingValue.textContent = spacing;
    }
    if (this.descriptionLetterSpacingInput) {
      const spacing = this.clampLetterSpacing(card.descriptionLetterSpacing);
      this.descriptionLetterSpacingInput.value = spacing;
      if (this.descriptionLetterSpacingValue) this.descriptionLetterSpacingValue.textContent = spacing;
    }
    if (this.descriptionBoxScaleInput) {
      const activeBlock = this.getActiveDescriptionBlock(card);
      const scale = this.clampDescriptionBoxScale(activeBlock?.scale ?? this.defaultDescriptionBoxScale);
      this.descriptionBoxScaleInput.value = scale;
      if (this.descriptionBoxScaleValue) this.descriptionBoxScaleValue.textContent = scale.toFixed(2);
      if (activeBlock && activeBlock.scale !== scale) {
        const blocks = this.getDescriptionBlocks(card).map((block) => (
          block.id === activeBlock.id ? { ...block, scale } : block
        ));
        gameState.updateProperty(this.getDescriptionContext().blocksKey, blocks);
        card = gameState.getCard();
      }
    }
    this.cardTypeSelect.value = card.cardType;
    this.updateSubTypeLabel(card.cardType);
    this.updateSubTypeOptions(card.cardType, card.cardSubType, false);
    this.updateDeckSaveAvailability(card);

    if (this.costInput) {
      const current = card?.costBadge?.value ?? '';
      this.costInput.value = String(current);
    }
    this.syncDefaultDiceColorControls(card.defaultDiceColor);
    this.renderAbilityDiceControls(card);
    this.renderCustomStatusEffectsControls(card);
    this.renderLeafletBreakControls(card);
    if (this.leafletLayerBackground) this.leafletLayerBackground.checked = card.leafletLayers?.background !== false;
    if (this.leafletLayerArt) this.leafletLayerArt.checked = card.leafletLayers?.art !== false;
    if (this.leafletLayerTitle) this.leafletLayerTitle.checked = card.leafletLayers?.title !== false;
    if (this.leafletLayerText) this.leafletLayerText.checked = card.leafletLayers?.text !== false;
    if (this.leafletSideSelect) {
      this.leafletSideSelect.value = (card.leafletSide === 'back') ? 'back' : 'front';
    }

    // Update image preview
    if (card.artData) {
      if (!card.artTransform) {
        gameState.updateProperty('artTransform', { x: 0, y: 0, scale: 1 });
      }
      if (card.artSourceData === undefined) {
        gameState.updateProperty('artSourceData', null);
      }
      if (card.artSourceUrl === undefined) {
        gameState.updateProperty('artSourceUrl', null);
      }
      if (card.artCropTransform === undefined) {
        gameState.updateProperty('artCropTransform', null);
      }
      if (card.artCropToFrame === undefined) {
        gameState.updateProperty('artCropToFrame', false);
      }
      if (card.artWasCropped === undefined) {
        gameState.updateProperty('artWasCropped', false);
      }
      this.imagePreview.innerHTML = `<img src="${card.artData}" alt="Card Art">`;
      this.btnClearImage.style.display = 'inline-block';
      if (this.artSelect) this.artSelect.value = '';
      renderer.setCardArt(card.artData);
      renderer.updateArtCrop(card);
    } else if (card.artUrl) {
      if (!card.artTransform) {
        gameState.updateProperty('artTransform', { x: 0, y: 0, scale: 1 });
      }
      if (card.artSourceData === undefined) {
        gameState.updateProperty('artSourceData', null);
      }
      if (card.artSourceUrl === undefined) {
        gameState.updateProperty('artSourceUrl', null);
      }
      if (card.artCropTransform === undefined) {
        gameState.updateProperty('artCropTransform', null);
      }
      if (card.artCropToFrame === undefined) {
        gameState.updateProperty('artCropToFrame', false);
      }
      if (card.artWasCropped === undefined) {
        gameState.updateProperty('artWasCropped', false);
      }
      this.imagePreview.innerHTML = `<img src="${card.artUrl}" alt="Card Art">`;
      this.btnClearImage.style.display = 'inline-block';
      if (this.artSelect) this.artSelect.value = card.artUrl;
      renderer.setCardArt(card.artUrl);
      renderer.updateArtCrop(card);
    } else {
      this.imagePreview.innerHTML = '';
      this.btnClearImage.style.display = 'none';
      if (this.artSelect) this.artSelect.value = '';
      renderer.setCardArt(null);
      renderer.updateArtCrop(card);
    }
    if (!card.titlePosition) {
      const activeBlock = this.getActiveTitleBlock(card);
      const fallbackPosition = activeBlock ? activeBlock.position : { x: 0, y: 0 };
      gameState.updateProperty('titlePosition', fallbackPosition);
    }
    if (!this.getDescriptionContext().isLeaflet && !card.descriptionPosition) {
      const activeBlock = this.getActiveDescriptionBlock(card);
      const fallbackPosition = activeBlock ? activeBlock.position : { x: 0, y: 0 };
      gameState.updateProperty('descriptionPosition', fallbackPosition);
    }
    if (!card.costBadgePosition) {
      gameState.updateProperty('costBadgePosition', { x: 0, y: 0 });
    }

    // Update renderer
    if (typeof renderer?.setWorkspaceMode === 'function') {
      renderer.setWorkspaceMode(this.workspaceMode);
    }
    if (typeof renderer?.setLeafletSide === 'function') {
      renderer.setLeafletSide(card.leafletSide);
    }
    renderer.render(card);
    renderer.updateCostBadgePosition(card);
    const activeTitleId = this.getActiveTitleId(card, this.getTitleBlocks(card));
    this.updateTitleLayerActiveState(activeTitleId);
    this.activeTitleId = activeTitleId;
    const activeDescriptionId = this.getActiveDescriptionId(card, this.getDescriptionBlocks(card));
    this.updateDescriptionLayerActiveState(activeDescriptionId);
    this.activeDescriptionId = activeDescriptionId;

    // Update export settings
    if (this.toggleExportBleed) {
      this.toggleExportBleed.checked = !!(card.export && card.export.includeBleed);
    }

    // Update element layer toggles
    if (this.toggleCardBleed) this.toggleCardBleed.checked = !!(card.layers && card.layers.cardBleed);
    if (this.toggleBackgroundLower) this.toggleBackgroundLower.checked = !!(card.layers && card.layers.backgroundLower);
    if (this.toggleBackgroundUpper) this.toggleBackgroundUpper.checked = !!(card.layers && card.layers.backgroundUpper);
    if (this.toggleImageFrame) this.toggleImageFrame.checked = !!(card.layers && card.layers.imageFrame);
    if (this.toggleFrameShading) this.toggleFrameShading.checked = !!(card.layers && card.layers.frameShading);
    if (this.toggleBorder) this.toggleBorder.checked = !!(card.layers && card.layers.border);
    if (this.toggleCardId) this.toggleCardId.checked = !!(card.layers && card.layers.cardId);
    if (this.toggleTitleBar) {
      const panelUpper = card.layers && (card.layers.panelUpper ?? card.layers.titleBar);
      this.toggleTitleBar.checked = !!panelUpper;
    }
    if (this.toggleTitleText) this.toggleTitleText.checked = !!(card.layers && card.layers.titleText);
    if (this.toggleTopNameGradient) this.toggleTopNameGradient.checked = !!(card.layers && card.layers.topNameGradient);
    if (this.toggleBottomNameGradient) this.toggleBottomNameGradient.checked = !!(card.layers && card.layers.bottomNameGradient);
    if (this.toggleArtwork) this.toggleArtwork.checked = !!(card.layers && card.layers.artwork);
    if (this.togglePanelBleed) this.togglePanelBleed.checked = !!(card.layers && card.layers.panelBleed);
    if (this.toggleBottomText) {
      const panelLower = card.layers && (card.layers.panelLower ?? card.layers.bottomText);
      this.toggleBottomText.checked = !!panelLower;
    }
    if (this.toggleSecondAbilityFrame) this.toggleSecondAbilityFrame.checked = !!(card.layers && card.layers.secondAbilityFrame);
    if (this.toggleCostBadge) this.toggleCostBadge.checked = !!(card.layers && card.layers.costBadge);
    if (this.toggleAttackModifier) this.toggleAttackModifier.checked = !!(card.layers && card.layers.attackModifier);
    if (this.toggleCardText) this.toggleCardText.checked = !!(card.layers && card.layers.cardText);

  }
  updateSubTypeOptions(cardType, selectedValue = null, shouldUpdateState = true) {
    const subTypeOptions = {
      'Hero Upgrade': [
        'Ability Upgrade',
        'Defense Upgrade',
        'Passive Upgrade'
      ],
      'Action Cards': [
        'Main Phase',
        'Instant',
        'Roll Phase'
      ],
      'Board Abilities': [
        'Offensive ability',
        'Passive Ability',
        'Defensive ability'
      ]
    };

    const options = subTypeOptions[cardType] || [];
    this.cardSubTypeSelect.innerHTML = '';
    
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      this.cardSubTypeSelect.appendChild(optionElement);
    });

    if (!options.length) return;
    const desired = selectedValue && options.includes(selectedValue) ? selectedValue : options[0];
    this.cardSubTypeSelect.value = desired;
    if (shouldUpdateState || desired !== selectedValue) {
      gameState.updateProperty('cardSubType', desired);
    }
  }

  updateSubTypeLabel(cardType) {
    const label = document.getElementById('cardSubTypeLabel');
    if (label) {
      if (cardType === 'Action Cards') {
        label.textContent = 'Card Phase';
        return;
      }
      if (cardType === 'Board Abilities') {
        label.textContent = 'Ability Type';
        return;
      }
      label.textContent = 'Upgrade Type';
    }
  }

  async loadCardArtOptions() {
    if (!this.artSelect) return;
    try {
      const response = await fetch('Assets/manifest.json');
      const manifest = await response.json();
      const artMap = manifest.CardArt || {};
      Object.entries(artMap).forEach(([label, path]) => {
        const opt = document.createElement('option');
        opt.value = path;
        opt.textContent = label;
        this.artSelect.appendChild(opt);
      });
    } catch (error) {
      console.warn('Could not load card art options:', error);
    }
  }

  async loadFontOptions() {
    const selects = [this.titleFontSelect, this.descriptionFontSelect].filter(Boolean);
    if (!selects.length) return;

    const systemFonts = [
      { label: 'Default (Arial)', family: 'Arial' },
      { label: 'Georgia', family: 'Georgia' },
      { label: 'Times New Roman', family: 'Times New Roman' },
      { label: 'Verdana', family: 'Verdana' }
    ];

    let customFonts = [];
    try {
      const response = await fetch('Assets/fonts/manifest.json');
      const manifest = await response.json();
      customFonts = (manifest.fonts || []).map((font) => ({
        label: font.label || font.family,
        family: font.family
      }));
    } catch (error) {
      console.warn('Could not load font manifest:', error);
    }

    const allFonts = [...systemFonts, ...customFonts];
    selects.forEach((select) => {
      select.innerHTML = '';
      allFonts.forEach((font) => {
        const option = document.createElement('option');
        option.value = font.family;
        option.textContent = font.label;
        select.appendChild(option);
      });
    });

    const card = gameState.getCard();
    this.ensureFontSelection(this.titleFontSelect, card.titleFont || this.defaultTitleFont);
    this.ensureFontSelection(this.descriptionFontSelect, card.descriptionFont || this.defaultDescriptionFont);
    if (this.titleFontSizeInput) {
      this.titleFontSizeInput.value = card.titleFontSize || this.defaultTitleFontSize;
    }
    const activeDescriptionBlock = this.getActiveDescriptionBlock(card);
    if (this.descriptionFontSizeInput) {
      this.descriptionFontSizeInput.value = this.clampDescriptionFontSize(
        activeDescriptionBlock?.fontSize ?? card.descriptionFontSize,
        this.getDescriptionContext().defaultFontSize
      );
    }
    this.syncDescriptionColorControls(this.normalizeDescriptionColor(
      activeDescriptionBlock?.color,
      this.normalizeDescriptionColor(card.descriptionColor, this.defaultDescriptionColor)
    ));
    if (this.descriptionLineHeightInput) {
      const spacing = this.clampLineHeightScale(card.descriptionLineHeightScale);
      this.descriptionLineHeightInput.value = spacing;
      if (this.descriptionLineHeightValue) this.descriptionLineHeightValue.textContent = spacing.toFixed(2);
    }
    if (this.titleLetterSpacingInput) {
      const spacing = this.clampLetterSpacing(card.titleLetterSpacing);
      this.titleLetterSpacingInput.value = spacing;
      if (this.titleLetterSpacingValue) this.titleLetterSpacingValue.textContent = spacing;
    }
    if (this.descriptionLetterSpacingInput) {
      const spacing = this.clampLetterSpacing(card.descriptionLetterSpacing);
      this.descriptionLetterSpacingInput.value = spacing;
      if (this.descriptionLetterSpacingValue) this.descriptionLetterSpacingValue.textContent = spacing;
    }
    if (this.descriptionBaselineOffsetInput) {
      const offset = Number.isFinite(Number(card.descriptionBaselineOffset)) ? Number(card.descriptionBaselineOffset) : this.defaultDescriptionBaselineOffset;
      this.descriptionBaselineOffsetInput.value = offset;
      if (this.descriptionBaselineOffsetValue) this.descriptionBaselineOffsetValue.textContent = offset.toFixed(1);
    }
    if (this.referenceOpacity && this.referenceOverlay) {
      const current = parseFloat(this.referenceOverlay.style.opacity || '0.7');
      const opacity = Number.isFinite(current) ? Math.max(0, Math.min(1, current)) : 0.7;
      this.referenceOpacity.value = String(opacity);
      this.referenceOverlay.style.opacity = String(opacity);
    }

    this.initDescriptionEditor(allFonts);
  }

  async loadReferenceOptions() {
    if (!this.referenceManager) return;
    await this.referenceManager.loadReferenceOptions();
  }

  resolvePrintLayerPath(value, fallbackFile) {
    const baseDir = String(this.printLayerBaseDir || 'Assets/Reference/printpage').replace(/\\/g, '/').replace(/\/$/, '');
    const fallback = fallbackFile ? `${baseDir}/${fallbackFile}` : '';
    const raw = String(value || '').trim();
    if (!raw) return fallback;
    const normalized = raw.replace(/\\/g, '/');
    if (/^(data:|blob:|https?:\/\/|\/)/i.test(normalized)) return normalized;
    if (normalized.startsWith('Assets/')) return normalized;
    if (normalized.startsWith('Reference/')) return `Assets/${normalized}`;
    if (normalized.startsWith('printpage/')) return `Assets/Reference/${normalized}`;
    if (normalized.startsWith('./') || normalized.startsWith('../')) return normalized;
    return `${baseDir}/${normalized}`;
  }

  applyPrintLayerCssVariables() {
    const rootStyle = document.documentElement?.style;
    if (!rootStyle) return;
    const safeUrl = (value) => String(value || '').replace(/"/g, '%22');
    rootStyle.setProperty('--print-template-bg-url', this.printLayerAssets.base ? `url("${safeUrl(this.printLayerAssets.base)}")` : 'none');
    rootStyle.setProperty('--print-template-safe-url', `url("${safeUrl(this.printLayerAssets.safe)}")`);
    rootStyle.setProperty('--print-template-cut-url', `url("${safeUrl(this.printLayerAssets.cut)}")`);
    this.getPrintSheetPageNodes().forEach((page) => this.applyPrintLayerAssetsToPage(page));
    this.applyPrintLayerVisibility();
  }

  buildPrintLayerBackgroundUrl(path) {
    const raw = String(path || '').trim();
    if (!raw) return '';
    const encoded = encodeURI(raw).replace(/"/g, '%22');
    return `url("${encoded}")`;
  }

  applyPrintLayerAssetsToPage(page) {
    if (!page) return;
    const applyLayer = (selector, path) => {
      const el = page.querySelector(selector);
      if (!el) return;
      const bg = this.buildPrintLayerBackgroundUrl(path);
      if (!bg) {
        el.style.backgroundImage = 'none';
        return;
      }
      el.style.backgroundImage = bg;
      el.style.backgroundSize = '100% 100%';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
    };
    applyLayer('.print-template__bg', this.printLayerAssets.base);
    applyLayer('.print-template__safe', this.printLayerAssets.safe);
    applyLayer('.print-template__cut', this.printLayerAssets.cut);
  }

  async loadPrintLayerManifest() {
    const modeCfg = this.printModes?.[this.printMode] || this.printModes?.standard || {};
    const defaults = {
      base: modeCfg.layerDefaults?.base || '',
      safe: modeCfg.layerDefaults?.safe || 'Assets/Reference/printpage/printpage_safe_margin.png',
      cut: modeCfg.layerDefaults?.cut || 'Assets/Reference/printpage/printpage_cut_guide.png'
    };
    try {
      const response = await fetch(this.printLayerManifestPath, { cache: 'no-store' });
      if (!response.ok) {
        this.printLayerAssets = defaults;
        this.applyPrintLayerCssVariables();
        return;
      }
      const manifest = await response.json();
      const baseValue = manifest?.baseLayer ?? manifest?.base ?? manifest?.background ?? manifest?.template;
      const safeValue = manifest?.safeMargin ?? manifest?.safe ?? manifest?.safe_layer ?? manifest?.safeLayer;
      const cutValue = manifest?.cardTemplate
        ?? manifest?.card_template
        ?? manifest?.cutGuide
        ?? manifest?.cut
        ?? manifest?.cut_layer
        ?? manifest?.cutLayer;
      this.printLayerAssets = {
        base: this.resolvePrintLayerPath(baseValue, defaults.base ? String(defaults.base).split('/').pop() : ''),
        safe: this.resolvePrintLayerPath(safeValue, String(defaults.safe).split('/').pop()),
        cut: this.resolvePrintLayerPath(cutValue, String(defaults.cut).split('/').pop())
      };
    } catch (error) {
      console.warn('Could not load print layer manifest:', error);
      this.printLayerAssets = defaults;
    }
    this.applyPrintLayerCssVariables();
  }

  ensureFontSelection(select, value) {
    if (!select) return;
    const existing = Array.from(select.options).some((opt) => opt.value === value);
    if (!existing && value) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
    select.value = value || 'Arial';
  }

  initDescriptionEditor(allFonts) {
    if (!this.descriptionEditor || !window.Quill) return;
    if (this.descriptionQuill) return;
    const fonts = Array.isArray(allFonts) ? allFonts : [];
    this.fontOptions = fonts;

    const Font = Quill.import('formats/font');
    const fontIds = fonts.map((font) => this.buildFontId(font.family));
    Font.whitelist = fontIds.length ? fontIds : ['arial'];
    Quill.register(Font, true);

    this.fontIdMap.clear();
    this.fontIdToFamily.clear();
    fonts.forEach((font) => {
      const id = this.buildFontId(font.family);
      this.fontIdMap.set(font.family, id);
      this.fontIdToFamily.set(id, font.family);
    });

    this.injectFontStyles(fonts);
    this.setupDescriptionToolbar(fonts);

    this.descriptionQuill = new Quill(this.descriptionEditor, {
      theme: 'snow',
      placeholder: 'Card description',
      modules: {
        toolbar: this.descriptionToolbar
      },
      formats: ['font', 'bold', 'italic', 'underline', 'color']
    });

    this.updateQuillFontPickerLabels();

    this.descriptionQuill.on('text-change', () => {
      if (this.suppressDescriptionUpdate) return;
      this.updateDescriptionStateFromEditor(false);
    });

    this.descriptionQuill.on('selection-change', (range) => {
      if (range) this.lastDescriptionSelection = range;
    });

    const card = gameState.getCard();
    this.syncDescriptionEditor(card);
  }

  setupDescriptionToolbar(fonts) {
    if (!this.descriptionToolbar) return;
    this.descriptionToolbar.innerHTML = `
      <span class="ql-formats">
        <select class="ql-font"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-clean"></button>
      </span>
      <span class="ql-formats description-box-controls">
        <button type="button" class="description-box-add">+ Box</button>
        <button type="button" class="description-box-remove">- Box</button>
      </span>
      <span class="ql-formats description-color-controls">
        <input type="color" class="description-color-picker" value="#ffffff" aria-label="Description box color" title="Description box color">
        <input type="text" class="description-color-hex" value="#FFFFFF" aria-label="Description color hex" title="Description color hex" spellcheck="false">
        <button type="button" class="description-color-copy" aria-label="Copy description color hex" title="Copy hex">Copy</button>
      </span>
    `;

    const select = this.descriptionToolbar.querySelector('.ql-font');
    if (!select) return;
    select.innerHTML = '';
    fonts.forEach((font) => {
      const opt = document.createElement('option');
      opt.value = this.buildFontId(font.family);
      opt.textContent = font.label || font.family;
      select.appendChild(opt);
    });

    const addButton = this.descriptionToolbar.querySelector('.description-box-add');
    if (addButton) {
      addButton.addEventListener('click', () => this.addDescriptionBox());
    }
    const removeButton = this.descriptionToolbar.querySelector('.description-box-remove');
    if (removeButton) {
      removeButton.addEventListener('click', () => this.removeActiveDescriptionBox());
    }

    const colorPicker = this.descriptionToolbar.querySelector('.description-color-picker');
    const colorHexInput = this.descriptionToolbar.querySelector('.description-color-hex');
    const colorCopyButton = this.descriptionToolbar.querySelector('.description-color-copy');
    if (colorPicker) {
      this.descriptionColorPicker = colorPicker;
      this.descriptionColorHexInput = colorHexInput || null;
      this.descriptionColorCopyButton = colorCopyButton || null;
      const applySelectionColor = (value) => {
        if (!this.descriptionQuill) return;
        const color = this.syncDescriptionColorControls(value);
        const range = this.descriptionQuill.getSelection() || this.lastDescriptionSelection;
        if (!range || !Number.isFinite(range.length) || range.length <= 0) return;
        this.descriptionQuill.setSelection(range);
        this.descriptionQuill.format('color', color);
        this.updateDescriptionStateFromEditor(true);
      };
      colorPicker.addEventListener('input', (e) => applySelectionColor(e.target.value));
      colorPicker.addEventListener('change', (e) => applySelectionColor(e.target.value));

      if (colorHexInput) {
        const applyHexInput = () => {
          const normalized = this.normalizeDescriptionHexInput(colorHexInput.value);
          if (!normalized) {
            this.syncDescriptionColorControls(colorPicker.value || this.defaultDescriptionColor);
            return;
          }
          applySelectionColor(normalized);
        };
        colorHexInput.addEventListener('change', applyHexInput);
        colorHexInput.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          applyHexInput();
          colorHexInput.select();
        });
      }

      if (colorCopyButton) {
        colorCopyButton.addEventListener('click', async () => {
          const color = this.syncDescriptionColorControls(
            colorHexInput?.value || colorPicker.value || this.defaultDescriptionColor
          );
          let copied = false;
          if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
              await navigator.clipboard.writeText(color);
              copied = true;
            } catch (error) {
              copied = false;
            }
          }
          if (!copied && colorHexInput && typeof document.execCommand === 'function') {
            colorHexInput.focus();
            colorHexInput.select();
            copied = document.execCommand('copy');
          }
          colorCopyButton.textContent = copied ? 'Copied' : 'Copy';
          if (copied) {
            window.setTimeout(() => {
              if (this.descriptionColorCopyButton === colorCopyButton) {
                colorCopyButton.textContent = 'Copy';
              }
            }, 900);
          }
        });
      }

      this.syncDescriptionColorControls(this.defaultDescriptionColor);
    }

    this.initSidebarResize();
  }

  updateQuillFontPickerLabels() {
    if (!this.descriptionToolbar) return;
    const picker = this.descriptionToolbar.querySelector('.ql-font');
    if (!picker) return;
    const label = picker.querySelector('.ql-picker-label');
    const items = Array.from(picker.querySelectorAll('.ql-picker-item'));

    items.forEach((item) => {
      const value = item.getAttribute('data-value') || '';
      const family = this.fontIdToFamily.get(value) || value || 'Default';
      item.setAttribute('data-label', family);
      item.textContent = family;
      item.title = family;
    });

    if (label) {
      const value = label.getAttribute('data-value') || '';
      const family = this.fontIdToFamily.get(value) || value || 'Default';
      label.setAttribute('data-label', family);
      label.textContent = family;
      label.title = family;
    }
  }

  injectFontStyles(fonts) {
    const styleId = 'description-font-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    const rules = fonts.map((font) => {
      const id = this.buildFontId(font.family);
      return `.ql-font-${id} { font-family: "${font.family}", Arial, sans-serif; }`;
    });
    styleTag.textContent = rules.join('\n');
  }

  buildFontId(family) {
    const raw = String(family || '').trim().toLowerCase();
    if (!raw) return 'arial';
    const cleaned = raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return cleaned || 'arial';
  }

  updateDescriptionStateFromEditor(force = false) {
    if (!this.descriptionQuill) return;
    const context = this.getDescriptionContext();
    let card = gameState.getCard();
    card = this.ensureDescriptionBlocks(card);
    const defaultFont = card.descriptionFont || this.defaultDescriptionFont;
    const delta = this.descriptionQuill.getContents();
    const runs = this.buildRunsFromDelta(delta, defaultFont);
    const plain = this.descriptionQuill.getText().replace(/\n$/, '');
    const html = this.descriptionQuill.root.innerHTML;
    const blocks = this.getDescriptionBlocks(card);
    const activeId = this.getActiveDescriptionId(card, blocks);
    const updatedBlocks = blocks.map((block) => {
      if (block.id !== activeId) return block;
      return {
        ...block,
        description: plain,
        descriptionRich: runs,
        descriptionHtml: html
      };
    });
    const activeBlock = updatedBlocks.find((block) => block.id === activeId) || updatedBlocks[0];
    const updates = {
      [context.blocksKey]: updatedBlocks,
      [context.activeIdKey]: activeId
    };
    if (!context.isLeaflet) {
      updates.description = plain;
      updates.descriptionRich = runs;
      updates.descriptionHtml = html;
      updates.descriptionPosition = activeBlock ? activeBlock.position : (card.descriptionPosition || { x: 0, y: 0 });
    }
    gameState.updateProperties(updates);
    this.activeDescriptionId = activeId;
    if (force) {
      renderer.updateDescriptionImage(gameState.getCard());
      return;
    }
    renderer.updateDescriptionImage(gameState.getCard());
  }

  buildRunsFromDelta(delta, defaultFont) {
    const runs = [];
    const ops = (delta && delta.ops) ? delta.ops : [];
    ops.forEach((op) => {
      if (typeof op.insert !== 'string') return;
      const fontId = op.attributes && op.attributes.font ? op.attributes.font : '';
      const fontFamily = this.fontIdToFamily.get(fontId) || fontId || defaultFont;
      const colorAttr = op.attributes && op.attributes.color ? String(op.attributes.color) : '';
      const color = this.normalizeDescriptionColor(colorAttr, '');
      runs.push({ text: op.insert, font: fontFamily || defaultFont, color });
    });
    const merged = this.mergeAdjacentRuns(runs);
    if (merged.length > 0) {
      const last = merged[merged.length - 1];
      if (last.text.endsWith('\n')) {
        last.text = last.text.replace(/\n$/, '');
        if (!last.text) merged.pop();
      }
    }
    return merged;
  }

  getDescriptionPlainText(runs) {
    if (!Array.isArray(runs)) return '';
    return runs.map((run) => run.text || '').join('');
  }

  mergeAdjacentRuns(runs) {
    const merged = [];
    runs.forEach((run) => {
      const text = String(run.text || '');
      if (!text) return;
      const font = run.font || this.defaultDescriptionFont;
      const color = this.normalizeDescriptionColor(run.color, '');
      const prev = merged[merged.length - 1];
      if (prev && prev.font === font && this.normalizeDescriptionColor(prev.color, '') === color) {
        prev.text += text;
      } else {
        merged.push({ text, font, color });
      }
    });
    return merged;
  }

  createTitleId() {
    this.titleIdCounter += 1;
    const seed = Date.now().toString(36);
    const counter = this.titleIdCounter.toString(36);
    const rand = Math.random().toString(36).slice(2, 6);
    return `title-${seed}-${counter}-${rand}`;
  }

  normalizeTitleBlock(block, fallback, fallbackId) {
    const safeBlock = (block && typeof block === 'object') ? block : {};
    const safeFallback = (fallback && typeof fallback === 'object') ? fallback : {};
    const id = String(safeBlock.id || fallbackId || '').trim() || String(fallbackId || 'title-1');
    const text = safeBlock.text !== undefined
      ? String(safeBlock.text)
      : String(safeFallback.text || '');
    const rawPos = safeBlock.position || safeFallback.position || {};
    const position = {
      x: Number(rawPos.x) || 0,
      y: Number(rawPos.y) || 0
    };
    return {
      id,
      text,
      position
    };
  }

  getTitleBlocks(card) {
    const fallback = {
      text: card.name || '',
      position: card.titlePosition || { x: 1.4874028450301893, y: -1.2779890290537477 }
    };
    if (Array.isArray(card.titleBlocks) && card.titleBlocks.length) {
      return card.titleBlocks.map((block, idx) => (
        this.normalizeTitleBlock(block, idx === 0 ? fallback : null, `title-${idx + 1}`)
      ));
    }
    return [this.normalizeTitleBlock({}, fallback, 'title-1')];
  }

  ensureTitleBlocks(card) {
    const rawBlocks = Array.isArray(card.titleBlocks) ? card.titleBlocks : [];
    const normalized = this.getTitleBlocks(card);
    let needsNormalize = !rawBlocks.length || rawBlocks.some((block) => {
      if (!block || typeof block !== 'object') return true;
      if (!block.id) return true;
      if (block.text === undefined) return true;
      if (!block.position || typeof block.position.x !== 'number' || typeof block.position.y !== 'number') return true;
      return false;
    });
    if (!needsNormalize && rawBlocks.length === 1) {
      const onlyBlock = rawBlocks[0] || {};
      const blockText = String(onlyBlock.text || '').trim();
      const cardText = String(card.name || '').trim();
      const isPlaceholder = blockText.toLowerCase() === 'title';
      if ((isPlaceholder && cardText && cardText !== blockText) || (!blockText && cardText)) {
        needsNormalize = true;
      }
    }
    const updates = {};
    if (needsNormalize) {
      updates.titleBlocks = normalized;
    }
    const activeId = card.activeTitleId;
    const resolvedActiveId = activeId && normalized.some((block) => block.id === activeId)
      ? activeId
      : (normalized[0] ? normalized[0].id : null);
    if (resolvedActiveId && resolvedActiveId !== card.activeTitleId) {
      updates.activeTitleId = resolvedActiveId;
    }
    const activeBlock = resolvedActiveId
      ? normalized.find((block) => block.id === resolvedActiveId)
      : null;
    if (activeBlock) {
      if (card.name !== activeBlock.text) updates.name = activeBlock.text;
      const pos = activeBlock.position || { x: 0, y: 0 };
      if (!card.titlePosition || card.titlePosition.x !== pos.x || card.titlePosition.y !== pos.y) {
        updates.titlePosition = pos;
      }
    }
    if (Object.keys(updates).length > 0) {
      gameState.updateProperties(updates);
      return gameState.getCard();
    }
    return card;
  }

  getActiveTitleId(card, blocks) {
    const list = blocks && blocks.length ? blocks : this.getTitleBlocks(card);
    const activeId = card.activeTitleId;
    if (activeId && list.some((block) => block.id === activeId)) return activeId;
    return list[0] ? list[0].id : null;
  }

  getActiveTitleBlock(card, blocks) {
    const list = blocks && blocks.length ? blocks : this.getTitleBlocks(card);
    const activeId = this.getActiveTitleId(card, list);
    return list.find((block) => block.id === activeId) || list[0] || null;
  }

  getTitleLayerElements() {
    return Array.from(document.querySelectorAll('.card-title-image'));
  }

  updateTitleLayerActiveState(activeId) {
    const layers = this.getTitleLayerElements();
    layers.forEach((layer) => {
      const isActive = !!activeId && layer.dataset.titleId === activeId;
      layer.classList.toggle('active', isActive);
    });
  }

  setActiveTitleBlock(id, options = {}) {
    let card = gameState.getCard();
    card = this.ensureTitleBlocks(card);
    const blocks = this.getTitleBlocks(card);
    if (!blocks.length) return;
    const targetId = id && blocks.some((block) => block.id === id) ? id : blocks[0].id;
    const activeBlock = blocks.find((block) => block.id === targetId) || blocks[0];
    if (!activeBlock) return;

    if (card.activeTitleId !== targetId) {
      gameState.updateProperties({
        activeTitleId: targetId,
        name: activeBlock.text || '',
        titlePosition: activeBlock.position || { x: 0, y: 0 }
      });
      card = gameState.getCard();
    }
    this.activeTitleId = targetId;
    this.updateTitleLayerActiveState(targetId);
    if (options.syncInput !== false && this.cardNameInput) {
      this.cardNameInput.value = String(activeBlock.text || '');
    }
  }

  addTitleBox() {
    let card = gameState.getCard();
    card = this.ensureTitleBlocks(card);
    const blocks = this.getTitleBlocks(card);
    const newId = this.createTitleId();
    const newBlock = {
      id: newId,
      text: '',
      position: { x: 1.4874028450301893, y: -1.2779890290537477 }
    };
    const updatedBlocks = [...blocks, newBlock];
    gameState.updateProperties({
      titleBlocks: updatedBlocks,
      activeTitleId: newId,
      name: '',
      titlePosition: { x: 1.4874028450301893, y: -1.2779890290537477 }
    });
    const updatedCard = gameState.getCard();
    this.activeTitleId = newId;
    this.updateTitleLayerActiveState(newId);
    if (this.cardNameInput) this.cardNameInput.value = '';
    renderer.updateTitleImage(updatedCard);
    if (this.cardNameInput) this.cardNameInput.focus();
  }

  removeActiveTitleBox() {
    let card = gameState.getCard();
    card = this.ensureTitleBlocks(card);
    const blocks = this.getTitleBlocks(card);
    if (!blocks.length) return;
    if (blocks.length === 1) {
      const onlyBlock = blocks[0];
      const clearedBlock = { ...onlyBlock, text: '' };
      gameState.updateProperties({
        titleBlocks: [clearedBlock],
        activeTitleId: clearedBlock.id,
        name: '',
        titlePosition: clearedBlock.position || { x: 0, y: 0 }
      });
      const updatedCard = gameState.getCard();
      this.activeTitleId = clearedBlock.id;
      this.updateTitleLayerActiveState(clearedBlock.id);
      if (this.cardNameInput) this.cardNameInput.value = '';
      renderer.updateTitleImage(updatedCard);
      return;
    }

    const activeId = this.getActiveTitleId(card, blocks);
    const activeIndex = blocks.findIndex((block) => block.id === activeId);
    const remainingBlocks = blocks.filter((block) => block.id !== activeId);
    const nextIndex = Math.min(
      activeIndex >= 0 ? activeIndex : 0,
      remainingBlocks.length - 1
    );
    const nextBlock = remainingBlocks[nextIndex] || remainingBlocks[0];
    if (!nextBlock) return;

    gameState.updateProperties({
      titleBlocks: remainingBlocks,
      activeTitleId: nextBlock.id,
      name: nextBlock.text || '',
      titlePosition: nextBlock.position || { x: 0, y: 0 }
    });
    const updatedCard = gameState.getCard();
    this.activeTitleId = nextBlock.id;
    this.updateTitleLayerActiveState(nextBlock.id);
    if (this.cardNameInput) this.cardNameInput.value = String(nextBlock.text || '');
    renderer.updateTitleImage(updatedCard);
  }

  createDescriptionId() {
    this.descriptionIdCounter += 1;
    const seed = Date.now().toString(36);
    const counter = this.descriptionIdCounter.toString(36);
    const rand = Math.random().toString(36).slice(2, 6);
    return `desc-${seed}-${counter}-${rand}`;
  }

  normalizeDescriptionBlock(block, fallback, fallbackId, options = {}) {
    const safeBlock = (block && typeof block === 'object') ? block : {};
    const safeFallback = (fallback && typeof fallback === 'object') ? fallback : {};
    const fallbackFontSize = this.clampDescriptionFontSize(
      options.defaultFontSize,
      this.defaultDescriptionFontSize
    );
    const id = String(safeBlock.id || fallbackId || '').trim() || String(fallbackId || 'desc-1');
    const description = safeBlock.description !== undefined
      ? String(safeBlock.description)
      : String(safeFallback.description || '');
    const descriptionRich = Array.isArray(safeBlock.descriptionRich)
      ? safeBlock.descriptionRich
      : (Array.isArray(safeFallback.descriptionRich) ? safeFallback.descriptionRich : []);
    const descriptionHtml = safeBlock.descriptionHtml !== undefined
      ? String(safeBlock.descriptionHtml || '')
      : String(safeFallback.descriptionHtml || '');
    const rawPos = safeBlock.position || safeFallback.position || {};
    const position = {
      x: Number(rawPos.x) || 0,
      y: Number(rawPos.y) || 0
    };
    const rawScale = safeBlock.scale !== undefined ? safeBlock.scale : safeFallback.scale;
    const scale = Number.isFinite(Number(rawScale)) ? Number(rawScale) : this.defaultDescriptionBoxScale;
    const rawFontSize = safeBlock.fontSize !== undefined ? safeBlock.fontSize : safeFallback.fontSize;
    const fontSize = this.clampDescriptionFontSize(rawFontSize, fallbackFontSize);
    const color = this.normalizeDescriptionColor(
      safeBlock.color !== undefined ? safeBlock.color : safeFallback.color,
      this.defaultDescriptionColor
    );
    return {
      id,
      description,
      descriptionRich,
      descriptionHtml,
      position,
      scale,
      fontSize,
      color
    };
  }

  getDescriptionBlocks(card, mode = this.workspaceMode) {
    const context = this.getDescriptionContext(mode);
    const rawBlocks = Array.isArray(card?.[context.blocksKey]) ? card[context.blocksKey] : [];
    const fallback = {
      description: card.description || '',
      descriptionRich: Array.isArray(card.descriptionRich) ? card.descriptionRich : [],
      descriptionHtml: card.descriptionHtml || '',
      position: card.descriptionPosition || { x: 0, y: 0 },
      scale: this.defaultDescriptionBoxScale,
      fontSize: context.isLeaflet
        ? context.defaultFontSize
        : this.clampDescriptionFontSize(card.descriptionFontSize, context.defaultFontSize),
      color: this.normalizeDescriptionColor(card.descriptionColor, this.defaultDescriptionColor)
    };
    if (rawBlocks.length) {
      return rawBlocks.map((block, idx) => (
        this.normalizeDescriptionBlock(block, fallback, `desc-${idx + 1}`, { defaultFontSize: context.defaultFontSize })
      ));
    }
    const fallbackId = context.isLeaflet ? 'leaflet-desc-1' : 'desc-1';
    return [this.normalizeDescriptionBlock({}, fallback, fallbackId, { defaultFontSize: context.defaultFontSize })];
  }

  ensureDescriptionBlocks(card, mode = this.workspaceMode) {
    const context = this.getDescriptionContext(mode);
    const rawBlocks = Array.isArray(card?.[context.blocksKey]) ? card[context.blocksKey] : [];
    const normalized = this.getDescriptionBlocks(card, mode);
    let needsNormalize = !rawBlocks.length || rawBlocks.some((block) => {
      if (!block || typeof block !== 'object') return true;
      if (!block.id) return true;
      if (!block.position || typeof block.position.x !== 'number' || typeof block.position.y !== 'number') return true;
      if (block.description === undefined) return true;
      if (!Array.isArray(block.descriptionRich)) return true;
      if (block.descriptionHtml === undefined) return true;
      if (block.scale === undefined || !Number.isFinite(Number(block.scale))) return true;
      if (block.fontSize === undefined || !Number.isFinite(Number(block.fontSize))) return true;
      if (block.color === undefined) return true;
      const blockColor = String(block.color || '').trim();
      if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(blockColor)) return true;
      return false;
    });
    if (!needsNormalize && rawBlocks.length === 1 && !context.isLeaflet) {
      const onlyBlock = rawBlocks[0] || {};
      const blockText = String(onlyBlock.description || '').trim();
      const cardText = String(card.description || '').trim();
      const isPlaceholder = blockText.toLowerCase() === 'place holder';
      if ((isPlaceholder && cardText && cardText !== blockText) || (!blockText && cardText)) {
        needsNormalize = true;
      }
      if (!needsNormalize) {
        const blockRich = Array.isArray(onlyBlock.descriptionRich) ? onlyBlock.descriptionRich : [];
        const cardRich = Array.isArray(card.descriptionRich) ? card.descriptionRich : [];
        if (!blockRich.length && cardRich.length) needsNormalize = true;
      }
      if (!needsNormalize) {
        const blockHtml = String(onlyBlock.descriptionHtml || '');
        const cardHtml = String(card.descriptionHtml || '');
        if (!blockHtml && cardHtml) needsNormalize = true;
      }
    }
    const updates = {};
    if (needsNormalize) {
      updates[context.blocksKey] = normalized;
    }
    const activeId = card[context.activeIdKey];
    const resolvedActiveId = activeId && normalized.some((block) => block.id === activeId)
      ? activeId
      : (normalized[0] ? normalized[0].id : null);
    if (resolvedActiveId && resolvedActiveId !== card[context.activeIdKey]) {
      updates[context.activeIdKey] = resolvedActiveId;
    }
    if (Object.keys(updates).length > 0) {
      gameState.updateProperties(updates);
      return gameState.getCard();
    }
    return card;
  }

  getActiveDescriptionId(card, blocks, mode = this.workspaceMode) {
    const context = this.getDescriptionContext(mode);
    const list = blocks && blocks.length ? blocks : this.getDescriptionBlocks(card, mode);
    const activeId = card[context.activeIdKey];
    if (activeId && list.some((block) => block.id === activeId)) return activeId;
    return list[0] ? list[0].id : null;
  }

  getActiveDescriptionBlock(card, blocks, mode = this.workspaceMode) {
    const list = blocks && blocks.length ? blocks : this.getDescriptionBlocks(card, mode);
    const activeId = this.getActiveDescriptionId(card, list, mode);
    return list.find((block) => block.id === activeId) || list[0] || null;
  }

  getDescriptionLayerElements() {
    return Array.from(document.querySelectorAll('.card-description-image'));
  }

  updateDescriptionLayerActiveState(activeId) {
    const layers = this.getDescriptionLayerElements();
    layers.forEach((layer) => {
      const isActive = !!activeId && layer.dataset.descriptionId === activeId;
      layer.classList.toggle('active', isActive);
    });
  }

  setActiveDescriptionBlock(id, options = {}) {
    const context = this.getDescriptionContext();
    let card = gameState.getCard();
    card = this.ensureDescriptionBlocks(card);
    const blocks = this.getDescriptionBlocks(card);
    if (!blocks.length) return;
    const targetId = id && blocks.some((block) => block.id === id) ? id : blocks[0].id;
    const activeBlock = blocks.find((block) => block.id === targetId) || blocks[0];
    if (!activeBlock) return;

    if (card[context.activeIdKey] !== targetId) {
      const updates = {
        [context.activeIdKey]: targetId
      };
      if (!context.isLeaflet) {
        updates.description = activeBlock.description || '';
        updates.descriptionRich = Array.isArray(activeBlock.descriptionRich) ? activeBlock.descriptionRich : [];
        updates.descriptionHtml = activeBlock.descriptionHtml || '';
        updates.descriptionPosition = activeBlock.position || { x: 0, y: 0 };
        updates.descriptionFontSize = this.clampDescriptionFontSize(activeBlock.fontSize ?? card.descriptionFontSize);
        updates.descriptionColor = this.normalizeDescriptionColor(
          activeBlock.color,
          this.normalizeDescriptionColor(card.descriptionColor, this.defaultDescriptionColor)
        );
      }
      gameState.updateProperties(updates);
      card = gameState.getCard();
    }
    this.activeDescriptionId = targetId;
    this.updateDescriptionLayerActiveState(targetId);
    if (this.descriptionBoxScaleInput) {
      const scale = this.clampDescriptionBoxScale(activeBlock.scale ?? this.defaultDescriptionBoxScale);
      this.descriptionBoxScaleInput.value = scale;
      if (this.descriptionBoxScaleValue) this.descriptionBoxScaleValue.textContent = scale.toFixed(2);
    }
    if (this.descriptionFontSizeInput) {
      const fontSize = this.clampDescriptionFontSize(
        activeBlock.fontSize ?? card.descriptionFontSize,
        context.defaultFontSize
      );
      this.descriptionFontSizeInput.value = fontSize;
    }
    this.syncDescriptionColorControls(this.normalizeDescriptionColor(
      activeBlock.color,
      this.normalizeDescriptionColor(card.descriptionColor, this.defaultDescriptionColor)
    ));
    if (options.syncEditor !== false) {
      this.syncDescriptionEditor(card);
    }
  }

  addDescriptionBox() {
    const context = this.getDescriptionContext();
    let card = gameState.getCard();
    card = this.ensureDescriptionBlocks(card);
    const blocks = this.getDescriptionBlocks(card);
    const activeBlock = this.getActiveDescriptionBlock(card, blocks);
    const nextFontSize = this.clampDescriptionFontSize(
      activeBlock?.fontSize ?? card.descriptionFontSize,
      context.defaultFontSize
    );
    const nextColor = this.normalizeDescriptionColor(
      activeBlock?.color,
      this.normalizeDescriptionColor(card.descriptionColor, this.defaultDescriptionColor)
    );
    const newId = this.createDescriptionId();
    const newBlock = {
      id: newId,
      description: '',
      descriptionRich: [],
      descriptionHtml: '',
      position: { x: 0, y: 0 },
      scale: this.defaultDescriptionBoxScale,
      fontSize: nextFontSize,
      color: nextColor
    };
    const updatedBlocks = [...blocks, newBlock];
    const updates = {
      [context.blocksKey]: updatedBlocks,
      [context.activeIdKey]: newId
    };
    if (!context.isLeaflet) {
      updates.description = '';
      updates.descriptionRich = [];
      updates.descriptionHtml = '';
      updates.descriptionPosition = { x: 0, y: 0 };
      updates.descriptionFontSize = nextFontSize;
      updates.descriptionColor = nextColor;
    }
    gameState.updateProperties(updates);
    const updatedCard = gameState.getCard();
    this.activeDescriptionId = newId;
    this.updateDescriptionLayerActiveState(newId);
    this.syncDescriptionEditor(updatedCard);
    renderer.updateDescriptionImage(updatedCard);
    this.updateDescriptionLayerActiveState(newId);
    if (this.descriptionQuill) this.descriptionQuill.focus();
  }

  removeActiveDescriptionBox() {
    const context = this.getDescriptionContext();
    let card = gameState.getCard();
    card = this.ensureDescriptionBlocks(card);
    const blocks = this.getDescriptionBlocks(card);
    if (!blocks.length) return;
    if (blocks.length === 1) {
      const onlyBlock = blocks[0];
      const clearedBlock = {
        ...onlyBlock,
        description: '',
        descriptionRich: [],
        descriptionHtml: ''
      };
      const updates = {
        [context.blocksKey]: [clearedBlock],
        [context.activeIdKey]: clearedBlock.id
      };
      if (!context.isLeaflet) {
        updates.description = '';
        updates.descriptionRich = [];
        updates.descriptionHtml = '';
        updates.descriptionPosition = clearedBlock.position || { x: 0, y: 0 };
        updates.descriptionFontSize = this.clampDescriptionFontSize(clearedBlock.fontSize ?? card.descriptionFontSize);
        updates.descriptionColor = this.normalizeDescriptionColor(
          clearedBlock.color,
          this.normalizeDescriptionColor(card.descriptionColor, this.defaultDescriptionColor)
        );
      }
      gameState.updateProperties(updates);
      const updatedCard = gameState.getCard();
      this.activeDescriptionId = clearedBlock.id;
      this.updateDescriptionLayerActiveState(clearedBlock.id);
      this.syncDescriptionEditor(updatedCard);
      renderer.updateDescriptionImage(updatedCard);
      return;
    }

    const activeId = this.getActiveDescriptionId(card, blocks);
    const activeIndex = blocks.findIndex((block) => block.id === activeId);
    const remainingBlocks = blocks.filter((block) => block.id !== activeId);
    const nextIndex = Math.min(
      activeIndex >= 0 ? activeIndex : 0,
      remainingBlocks.length - 1
    );
    const nextBlock = remainingBlocks[nextIndex] || remainingBlocks[0];
    if (!nextBlock) return;

    const updates = {
      [context.blocksKey]: remainingBlocks,
      [context.activeIdKey]: nextBlock.id
    };
    if (!context.isLeaflet) {
      updates.description = nextBlock.description || '';
      updates.descriptionRich = Array.isArray(nextBlock.descriptionRich) ? nextBlock.descriptionRich : [];
      updates.descriptionHtml = nextBlock.descriptionHtml || '';
      updates.descriptionPosition = nextBlock.position || { x: 0, y: 0 };
      updates.descriptionFontSize = this.clampDescriptionFontSize(nextBlock.fontSize ?? card.descriptionFontSize);
      updates.descriptionColor = this.normalizeDescriptionColor(
        nextBlock.color,
        this.normalizeDescriptionColor(card.descriptionColor, this.defaultDescriptionColor)
      );
    }
    gameState.updateProperties(updates);

    const updatedCard = gameState.getCard();
    this.activeDescriptionId = nextBlock.id;
    this.updateDescriptionLayerActiveState(nextBlock.id);
    this.syncDescriptionEditor(updatedCard);
    renderer.updateDescriptionImage(updatedCard);
  }

  syncDescriptionEditor(card) {
    if (!this.descriptionQuill) return;
    if (this.descriptionEditor && this.descriptionEditor.contains(document.activeElement)) return;
    const context = this.getDescriptionContext();
    const synced = this.ensureDescriptionBlocks(card);
    const blocks = this.getDescriptionBlocks(synced);
    const activeBlock = this.getActiveDescriptionBlock(synced, blocks);
    const defaultFont = synced.descriptionFont || this.defaultDescriptionFont;

    this.suppressDescriptionUpdate = true;
    if (activeBlock && activeBlock.descriptionHtml) {
      this.descriptionQuill.clipboard.dangerouslyPasteHTML(activeBlock.descriptionHtml);
    } else if (activeBlock && Array.isArray(activeBlock.descriptionRich) && activeBlock.descriptionRich.length) {
      const html = this.runsToQuillHtml(activeBlock.descriptionRich);
      this.descriptionQuill.clipboard.dangerouslyPasteHTML(html);
    } else {
      this.descriptionQuill.setText(activeBlock ? (activeBlock.description || '') : '');
    }
    this.descriptionQuill.root.style.fontFamily = defaultFont;
    this.descriptionQuill.format('font', this.buildFontId(defaultFont));
    this.suppressDescriptionUpdate = false;
    if (this.descriptionFontSizeInput) {
      this.descriptionFontSizeInput.value = this.clampDescriptionFontSize(
        activeBlock?.fontSize ?? synced.descriptionFontSize,
        context.defaultFontSize
      );
    }
    this.syncDescriptionColorControls(this.normalizeDescriptionColor(
      activeBlock?.color,
      this.normalizeDescriptionColor(synced.descriptionColor, this.defaultDescriptionColor)
    ));
    if (activeBlock && activeBlock.id) {
      this.activeDescriptionId = activeBlock.id;
      this.updateDescriptionLayerActiveState(activeBlock.id);
    }
  }

  runsToQuillHtml(runs) {
    const escapeHtml = (value) => String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const lines = [];
    runs.forEach((run) => {
      const font = run.font || this.defaultDescriptionFont;
      const fontId = this.buildFontId(font);
      const color = this.normalizeDescriptionColor(run.color, '');
      const styleAttr = color ? ` style="color:${escapeHtml(color)}"` : '';
      const text = String(run.text || '');
      const parts = text.split('\n');
      parts.forEach((part, idx) => {
        if (part.length > 0) {
          lines.push(
            `<span class="ql-font-${escapeHtml(fontId)}"${styleAttr}>${escapeHtml(part)}</span>`
          );
        }
        if (idx < parts.length - 1) {
          lines.push('<br>');
        }
      });
    });
    return lines.join('');
  }

  applyFontToDescriptionSelection(font) {
    if (!this.descriptionQuill) return false;
    const fontId = this.buildFontId(font);
    const range = this.descriptionQuill.getSelection() || this.lastDescriptionSelection;
    if (!range) return false;
    this.descriptionQuill.setSelection(range);
    this.descriptionQuill.format('font', fontId);
    this.updateQuillFontPickerLabels();
    return true;
  }

  initLayerListDragAndDrop() {
    if (!this.layerList) return;
    let draggingItem = null;

    const onDragStart = (e) => {
      const item = e.target.closest('.layer-item');
      const handle = e.target.closest('.layer-handle');
      const isToggle = e.target.closest('input');
      if (!item || !handle || isToggle) {
        e.preventDefault();
        return;
      }
      draggingItem = item;
      draggingItem.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', item.dataset.layerKey || '');
        } catch (error) {
          // ignore
        }
      }
    };

    const onDragOver = (e) => {
      if (!draggingItem) return;
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
      const afterElement = this.getDragAfterElement(this.layerList, e.clientY);
      if (!afterElement) {
        this.layerList.appendChild(draggingItem);
      } else if (afterElement !== draggingItem) {
        this.layerList.insertBefore(draggingItem, afterElement);
      }
    };

    const onDragEnd = () => {
      if (!draggingItem) return;
      draggingItem.classList.remove('dragging');
      draggingItem = null;
      this.syncLayerOrderFromDom();
    };

    this.layerList.addEventListener('dragstart', onDragStart);
    this.layerList.addEventListener('dragover', onDragOver);
    this.layerList.addEventListener('dragend', onDragEnd);
    this.layerList.addEventListener('drop', (e) => e.preventDefault());
    this.layerList.addEventListener('change', (e) => {
      const toggle = e.target.closest('.layer-hide-toggle');
      if (!toggle) return;
      const item = toggle.closest('.layer-item');
      if (!item) return;
      const key = item.dataset.layerKey;
      if (!key) return;
      this.setLayerHidden(key, toggle.checked);
    });
  }

  getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll('.layer-item:not(.dragging)')]
      .filter((item) => item.offsetParent !== null);
    return items.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
  }

  getLayerOrderFromDom() {
    if (!this.layerList) return [];
    return Array.from(this.layerList.querySelectorAll('.layer-item'))
      .map((item) => item.dataset.layerKey)
      .filter(Boolean);
  }

  normalizeLayerOrder(order) {
    if (typeof renderer !== 'undefined' && renderer && typeof renderer.normalizeLayerOrder === 'function') {
      return renderer.normalizeLayerOrder(order);
    }
    const fallback = this.getLayerOrderFromDom();
    const provided = Array.isArray(order) ? order : [];
    const allowed = new Set(fallback);
    const seen = new Set();
    const normalized = [];
    provided.forEach((key) => {
      if (!allowed.has(key) || seen.has(key)) return;
      seen.add(key);
      normalized.push(key);
    });
    fallback.forEach((key) => {
      if (!seen.has(key)) normalized.push(key);
    });
    return normalized;
  }

  normalizeHiddenLayers(hiddenLayers, order) {
    const safe = Array.isArray(hiddenLayers) ? hiddenLayers : [];
    const allowed = new Set(this.normalizeLayerOrder(order));
    const seen = new Set();
    return safe.filter((key) => {
      if (!allowed.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  getHiddenLayerKeys(card) {
    const baseOrder = this.normalizeLayerOrder(card?.layerOrder);
    return this.normalizeHiddenLayers(card?.hiddenLayers, baseOrder);
  }

  setLayerHidden(key, hidden) {
    const card = gameState.getCard();
    const current = this.getHiddenLayerKeys(card);
    const set = new Set(current);
    if (hidden) {
      set.add(key);
    } else {
      set.delete(key);
    }
    const updated = this.normalizeHiddenLayers(Array.from(set), card.layerOrder);
    gameState.updateProperty('hiddenLayers', updated);
    this.updateLayerListHiddenStates(gameState.getCard());
  }

  updateLayerListHiddenStates(card) {
    if (!this.layerList) return;
    const hidden = new Set(this.getHiddenLayerKeys(card));
    const showHidden = this.showHiddenLayersToggle ? !!this.showHiddenLayersToggle.checked : false;
    this.layerList.querySelectorAll('.layer-item').forEach((item) => {
      const key = item.dataset.layerKey;
      if (!key) return;
      const isHidden = hidden.has(key);
      const toggle = item.querySelector('.layer-hide-toggle');
      if (toggle) toggle.checked = isHidden;
      if (isHidden) {
        item.classList.add('layer-item-hidden');
        item.style.display = showHidden ? '' : 'none';
      } else {
        item.classList.remove('layer-item-hidden');
        item.style.display = '';
      }
    });
  }

  areLayerOrdersEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  syncLayerListToOrder(order) {
    if (!this.layerList) return;
    const normalized = this.normalizeLayerOrder(order);
    const items = new Map();
    this.layerList.querySelectorAll('.layer-item').forEach((item) => {
      const key = item.dataset.layerKey;
      if (key) items.set(key, item);
    });
    normalized.forEach((key) => {
      const item = items.get(key);
      if (item) this.layerList.appendChild(item);
    });
  }

  syncLayerOrderFromDom() {
    const order = this.getLayerOrderFromDom();
    const normalized = this.normalizeLayerOrder(order);
    const card = gameState.getCard();
    if (!this.areLayerOrdersEqual(card.layerOrder, normalized)) {
      gameState.updateProperty('layerOrder', normalized);
    }
    if (typeof renderer !== 'undefined' && renderer && typeof renderer.applyLayerOrder === 'function') {
      renderer.applyLayerOrder(normalized);
    }
  }
  undo() {
    if (gameState.undo()) {
      this.updateUI();
    }
  }

  redo() {
    if (gameState.redo()) {
      this.updateUI();
    }
  }

  initSidebarResize() {
    if (!this.containerEl) return;
    const stored = Number(localStorage.getItem(this.sidebarWidthKey));
    if (Number.isFinite(stored) && stored > 0) {
      this.setSidebarWidth(stored, false);
    }

    if (!this.sidebarResizer) return;
    let dragging = false;
    let startX = 0;
    let startWidth = 0;

    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      this.setSidebarWidth(startWidth + dx, true);
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    this.sidebarResizer.addEventListener('pointerdown', (e) => {
      if (!this.containerEl) return;
      const rect = this.containerEl.getBoundingClientRect();
      startX = e.clientX;
      const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || rect.width;
      startWidth = current;
      dragging = true;
      document.body.style.cursor = 'col-resize';
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  setSidebarWidth(value, persist) {
    const width = Math.max(320, Math.min(640, Number(value) || 0));
    if (!Number.isFinite(width) || width <= 0) return;
    document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
    if (persist) {
      localStorage.setItem(this.sidebarWidthKey, String(width));
    }
  }

  loadDeckStore() {
    try {
      const raw = localStorage.getItem(this.deckStorageKey);
      if (!raw) return { decks: {}, order: [] };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return { decks: {}, order: [] };
      return {
        decks: parsed.decks || {},
        order: Array.isArray(parsed.order) ? parsed.order : []
      };
    } catch (error) {
      console.warn('Failed to load deck storage:', error);
      return { decks: {}, order: [] };
    }
  }

  saveDeckStore(store) {
    try {
      localStorage.setItem(this.deckStorageKey, JSON.stringify(store));
    } catch (error) {
      console.warn('Failed to save deck storage:', error);
    }
  }

  loadBoardAbilityStore() {
    try {
      const raw = localStorage.getItem(this.boardAbilityStorageKey);
      if (!raw) return { abilities: {}, order: [] };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return { abilities: {}, order: [] };
      return {
        abilities: parsed.abilities || {},
        order: Array.isArray(parsed.order) ? parsed.order : []
      };
    } catch (error) {
      console.warn('Failed to load board ability storage:', error);
      return { abilities: {}, order: [] };
    }
  }

  saveBoardAbilityStore(store) {
    try {
      localStorage.setItem(this.boardAbilityStorageKey, JSON.stringify(store));
    } catch (error) {
      console.warn('Failed to save board ability storage:', error);
    }
  }

  getStoredBoardSlotAssignments() {
    const fallback = Array.from({ length: this.boardSlotSelects.length }, () => '');
    try {
      const raw = localStorage.getItem(this.boardSlotStorageKey);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return fallback;
      return fallback.map((_, index) => String(parsed[index] || ''));
    } catch (error) {
      console.warn('Failed to load board slot assignments:', error);
      return fallback;
    }
  }

  saveBoardSlotAssignments(values = []) {
    const normalized = Array.from({ length: this.boardSlotSelects.length }, (_, index) => String(values[index] || ''));
    try {
      localStorage.setItem(this.boardSlotStorageKey, JSON.stringify(normalized));
    } catch (error) {
      console.warn('Failed to save board slot assignments:', error);
    }
  }

  refreshBoardAbilityOptions() {
    if (!this.boardSlotSelects.length) return;
    const store = this.loadBoardAbilityStore();
    const orderedIds = (Array.isArray(store.order) ? store.order : [])
      .filter((id) => id && store.abilities && store.abilities[id]);
    const abilities = orderedIds.map((id) => store.abilities[id]).filter(Boolean);
    const storedSelections = this.getStoredBoardSlotAssignments();

    this.boardSlotSelects.forEach((selectEl, index) => {
      if (!selectEl) return;
      const currentValue = String(selectEl.value || storedSelections[index] || '');
      selectEl.innerHTML = '';

      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = 'Unassigned';
      selectEl.appendChild(emptyOption);

      abilities.forEach((entry) => {
        const option = document.createElement('option');
        option.value = entry.id;
        option.textContent = entry.subType
          ? `${entry.name} (${entry.subType})`
          : entry.name;
        selectEl.appendChild(option);
      });

      const isValid = currentValue && abilities.some((entry) => entry.id === currentValue);
      selectEl.value = isValid ? currentValue : '';
    });

    this.saveBoardSlotAssignments(this.boardSlotSelects.map((selectEl) => (selectEl ? selectEl.value : '')));
    this.renderBoardSlotAssignments();
  }

  setBoardSlotCardContent(slotEl, slotId, entry = null, imageSrc = '') {
    if (!slotEl) return;
    slotEl.replaceChildren();
    slotEl.classList.toggle('is-empty', !imageSrc);
    slotEl.title = entry
      ? `${entry.name}${entry.subType ? ` (${entry.subType})` : ''}`
      : `Slot ${slotId} unassigned`;

    if (imageSrc) {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = entry?.name || `Slot ${slotId}`;
      slotEl.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'board-slot-card__placeholder';
      placeholder.textContent = entry ? `Preview unavailable` : 'Unassigned';
      slotEl.appendChild(placeholder);
    }
  }

  async renderBoardSlotAssignments() {
    if (!this.boardSlotCards.length) return;
    const renderToken = ++this.boardSlotRenderToken;
    const store = this.loadBoardAbilityStore();
    const abilities = store.abilities && typeof store.abilities === 'object' ? store.abilities : {};
    const assignments = this.getStoredBoardSlotAssignments();
    const slotMap = new Map(this.boardSlotCards.map((node) => [String(node.dataset.slotId || ''), node]));

    this.boardSlotCards.forEach((slotEl) => {
      const slotId = String(slotEl.dataset.slotId || '');
      this.setBoardSlotCardContent(slotEl, slotId || '?', null, '');
    });

    await this.ensureDeckDefaultCard();
    if (renderToken !== this.boardSlotRenderToken) return;

    for (let index = 0; index < assignments.length; index += 1) {
      const slotId = String(index + 1);
      const slotEl = slotMap.get(slotId);
      if (!slotEl) continue;
      const entryId = String(assignments[index] || '');
      const entry = entryId ? abilities[entryId] : null;
      if (!entry) {
        this.setBoardSlotCardContent(slotEl, slotId, null, '');
        continue;
      }

      let imageSrc = '';
      try {
        const cardData = this.buildCardFromJson(entry.json);
        if (!cardData.name || cardData.name === 'Title') {
          cardData.name = entry.name || `Slot ${slotId}`;
        }
        imageSrc = await renderer.renderCardToDataUrl(cardData, {
          width: Number(DTC_UI_EXPORT_SIZE.width) || 675,
          height: Number(DTC_UI_EXPORT_SIZE.height) || 1050,
          includeBleed: false,
          usePreviewMetrics: false,
          fitMode: 'contain',
          trimTransparent: true,
          trimAlphaThreshold: 1,
          cropToBleedBounds: true
        });
        if (imageSrc) {
          imageSrc = await this.scaleDeckCardDataUrl(imageSrc, 314, 476, 'cover', 1, true);
        }
      } catch (error) {
        console.warn('Failed to render board slot preview:', slotId, error);
      }

      if (renderToken !== this.boardSlotRenderToken) return;
      this.setBoardSlotCardContent(slotEl, slotId, entry, imageSrc);
    }
  }

  refreshDeckUI() {
    if (!this.deckSelect) return;
    const store = this.loadDeckStore();
    const current = this.deckSelect.value;
    this.deckSelect.innerHTML = '';
    const ids = store.order.length ? store.order : Object.keys(store.decks);
    ids.forEach((id) => {
      const deck = store.decks[id];
      if (!deck) return;
      const option = document.createElement('option');
      option.value = deck.id;
      option.textContent = deck.name;
      this.deckSelect.appendChild(option);
    });
    if (current && ids.includes(current)) {
      this.deckSelect.value = current;
    }
    if (!this.deckSelect.value && ids.length) {
      this.deckSelect.value = ids[0];
    }
    this.refreshDeckCards();
  }

  refreshDeckCards() {
    if (!this.deckCardSelect) return;
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    this.deckCardSelect.innerHTML = '';
    if (!deck || !Array.isArray(deck.cards)) return;
    deck.cards.forEach((card) => {
      const option = document.createElement('option');
      option.value = card.id;
      option.textContent = card.name || `Card ${card.id}`;
      this.deckCardSelect.appendChild(option);
    });
  }

  isDeckViewOpen() {
    return !!(this.deckViewModal && this.deckViewModal.classList.contains('is-open'));
  }

  isPrintSheetOpen() {
    return !!(this.printSheetModal && this.printSheetModal.classList.contains('is-open'));
  }

  updateDeckTemplateScale() {
    if (!this.deckTemplate || !this.deckViewGrid) return;
    const config = this.deckTemplateConfig;
    const templateWidth = config.width;
    const scale = this.deckTemplate.clientWidth / templateWidth;
    this.deckTemplate.style.setProperty('--deck-scale', String(scale));

    const colWidth = config.columnWidth * scale;
    const colGap = config.columnGap * scale;
    const rowHeights = config.rowHeights.map((h) => h * scale);
    const rowGapDefault = config.rowGap * scale;
    const rowGaps = Array.isArray(config.rowGaps) && config.rowGaps.length === config.rows - 1
      ? config.rowGaps.map((g) => g * scale)
      : null;
    const left = config.offsetX * scale;
    const top = config.offsetY * scale;
    const gridWidth = config.columns * colWidth + (config.columns - 1) * colGap;
    const gridHeight = rowHeights.reduce((sum, h) => sum + h, 0)
      + (rowGaps ? rowGaps.reduce((sum, g) => sum + g, 0) : (config.rows - 1) * rowGapDefault);

    this.deckViewGrid.style.left = `${left}px`;
    this.deckViewGrid.style.top = `${top}px`;
    this.deckViewGrid.style.gridTemplateColumns = `repeat(${config.columns}, ${colWidth}px)`;
    if (rowGaps) {
      const tracks = [];
      rowHeights.forEach((h, index) => {
        tracks.push(`${h}px`);
        if (index < rowGaps.length) tracks.push(`${rowGaps[index]}px`);
      });
      this.deckViewGrid.style.gridTemplateRows = tracks.join(' ');
      this.deckViewGrid.style.rowGap = '0px';
    } else {
      this.deckViewGrid.style.gridTemplateRows = rowHeights.map((h) => `${h}px`).join(' ');
      this.deckViewGrid.style.rowGap = `${rowGapDefault}px`;
    }
    this.deckViewGrid.style.columnGap = `${colGap}px`;
    this.deckViewGrid.style.width = `${gridWidth}px`;
    this.deckViewGrid.style.height = `${gridHeight}px`;
  }

  updatePrintTemplateScale() {
    const pages = this.getPrintSheetPageNodes();
    if (!pages.length) return;
    const config = this.printTemplateConfig;
    const templateWidth = config.width;
    pages.forEach((page) => {
      const grid = page.querySelector('.print-card-grid');
      if (!grid) return;
      const scale = page.clientWidth / templateWidth;
      page.style.setProperty('--print-scale', String(scale));

      const colWidth = config.columnWidth * scale;
      const colGap = config.columnGap * scale;
      const rowHeight = config.rowHeight * scale;
      const rowGap = config.rowGap * scale;
      const left = config.offsetX * scale;
      const top = config.offsetY * scale;
      const gridWidth = config.columns * colWidth + (config.columns - 1) * colGap;
      const gridHeight = config.rows * rowHeight + (config.rows - 1) * rowGap;

      grid.style.left = `${left}px`;
      grid.style.top = `${top}px`;
      grid.style.gridTemplateColumns = `repeat(${config.columns}, ${colWidth}px)`;
      grid.style.gridTemplateRows = `repeat(${config.rows}, ${rowHeight}px)`;
      grid.style.columnGap = `${colGap}px`;
      grid.style.rowGap = `${rowGap}px`;
      grid.style.width = `${gridWidth}px`;
      grid.style.height = `${gridHeight}px`;
    });
  }

  openDeckView() {
    if (!this.deckViewModal) return;
    this.deckViewModal.classList.add('is-open');
    requestAnimationFrame(() => {
      this.updateDeckTemplateScale();
      this.renderDeckView();
    });
  }

  closeDeckView() {
    if (!this.deckViewModal) return;
    this.deckViewModal.classList.remove('is-open');
  }

  openPrintSheet() {
    if (!this.printSheetModal) return;
    this.printSheetModal.classList.add('is-open');
    this.printSheetModal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      this.ensurePrintSheetPages();
      this.getPrintSheetPageNodes().forEach((page) => this.applyPrintLayerAssetsToPage(page));
      this.updatePrintTemplateScale();
      this.renderPrintSheet();
      this.applyPrintLayerVisibility();
    });
  }

  closePrintSheet() {
    if (!this.printSheetModal) return;
    this.printSheetModal.classList.remove('is-open');
    this.printSheetModal.setAttribute('aria-hidden', 'true');
    this.printSheetRenderToken += 1;
  }

  getPrintSheetPageNodes() {
    if (this.printSheetPages) {
      return Array.from(this.printSheetPages.querySelectorAll('.print-template'));
    }
    if (this.printSheetTemplate) return [this.printSheetTemplate];
    return [];
  }

  ensurePrintSheetPages() {
    if (!this.printSheetPages) return;
    if (this.printSheetPages.querySelector('.print-template')) return;
    const page = this.createPrintSheetPage();
    this.printSheetPages.appendChild(page);
    this.printSheetTemplate = page;
    this.printSheetGrid = page.querySelector('.print-card-grid');
  }

  createPrintSheetPage() {
    const page = document.createElement('div');
    page.className = 'print-template';
    const bg = document.createElement('div');
    bg.className = 'print-template__layer print-template__bg';
    bg.setAttribute('aria-hidden', 'true');
    const grid = document.createElement('div');
    grid.className = 'print-card-grid';
    const safe = document.createElement('div');
    safe.className = 'print-template__layer print-template__safe';
    safe.setAttribute('aria-hidden', 'true');
    const cut = document.createElement('div');
    cut.className = 'print-template__layer print-template__cut';
    cut.setAttribute('aria-hidden', 'true');
    page.appendChild(bg);
    page.appendChild(grid);
    page.appendChild(safe);
    page.appendChild(cut);
    this.applyPrintLayerAssetsToPage(page);
    return page;
  }

  getPrintLayerState() {
    return {
      safe: this.printLayerSafeToggle ? this.printLayerSafeToggle.checked : true,
      cut: this.printLayerCutToggle ? this.printLayerCutToggle.checked : true
    };
  }

  applyPrintLayerStateToNode(root, state, removeHidden = false) {
    if (!root) return;
    const config = [
      { selector: '.print-template__safe', show: !!state.safe, path: this.printLayerAssets.safe },
      { selector: '.print-template__cut', show: !!state.cut, path: this.printLayerAssets.cut }
    ];

    config.forEach(({ selector, show, path }) => {
      const el = root.querySelector(selector);
      if (!el) return;
      if (!show) {
        if (removeHidden) {
          el.remove();
          return;
        }
        el.style.display = 'none';
        el.style.backgroundImage = 'none';
        return;
      }
      el.style.display = '';
      const bg = this.buildPrintLayerBackgroundUrl(path);
      el.style.backgroundImage = bg || 'none';
      el.style.backgroundSize = '100% 100%';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';
    });
  }

  applyPrintLayerVisibility() {
    const state = this.getPrintLayerState();
    const pages = this.getPrintSheetPageNodes();
    pages.forEach((page) => this.applyPrintLayerStateToNode(page, state, false));
  }

  openStatusEffectsModal() {
    if (!this.statusEffectsModal) return;
    this.statusEffectsModal.classList.add('is-open');
    this.statusEffectsModal.setAttribute('aria-hidden', 'false');
    if (this.statusEffectsToggle) {
      this.statusEffectsToggle.checked = true;
    }
    this.renderStatusEffectsTable();
  }

  closeStatusEffectsModal() {
    if (!this.statusEffectsModal) return;
    this.statusEffectsModal.classList.remove('is-open');
    this.statusEffectsModal.setAttribute('aria-hidden', 'true');
    if (this.statusEffectsToggle) {
      this.statusEffectsToggle.checked = false;
    }
  }

  openOtherCommandsModal() {
    if (!this.otherCommandsModal) return;
    this.otherCommandsModal.classList.add('is-open');
    this.otherCommandsModal.setAttribute('aria-hidden', 'false');
    if (this.otherCommandsToggle) {
      this.otherCommandsToggle.checked = true;
    }
    this.renderOtherCommandsTable();
  }

  closeOtherCommandsModal() {
    if (!this.otherCommandsModal) return;
    this.otherCommandsModal.classList.remove('is-open');
    this.otherCommandsModal.setAttribute('aria-hidden', 'true');
    if (this.otherCommandsToggle) {
      this.otherCommandsToggle.checked = false;
    }
  }

  normalizeStatusEffectKey(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .trim();
  }

  formatStatusEffectLabel(value) {
    const base = String(value || '').replace(/[_-]+/g, ' ').trim();
    if (!base) return '';
    return base.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  async loadStatusEffectsList() {
    if (Array.isArray(this.statusEffectsCache)) {
      return this.statusEffectsCache;
    }
    try {
      const response = await fetch('Assets/Status effects/manifest.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load status effects manifest');
      const manifest = await response.json();
      const files = Array.isArray(manifest.files) ? manifest.files : [];
      const seen = new Set();
      const entries = [];
      files.forEach((file) => {
        const base = String(file || '').replace(/\.[^/.]+$/, '');
        const key = this.normalizeStatusEffectKey(base);
        if (!key || seen.has(key)) return;
        seen.add(key);
        entries.push({
          label: this.formatStatusEffectLabel(base),
          command: `{{${key}}}`,
          iconSrc: `Assets/Status effects/${file}`
        });
      });
      entries.sort((a, b) => a.label.localeCompare(b.label));
      this.statusEffectsCache = entries;
      return entries;
    } catch (error) {
      console.warn('Failed to load status effects list:', error);
      this.statusEffectsCache = [];
      return [];
    }
  }

  async renderStatusEffectsTable() {
    if (!this.statusEffectsTableBody) return;
    this.statusEffectsTableBody.innerHTML = '';
    this.updateStatusEffectsIconSize();
    const entries = await this.loadStatusEffectsList();
    if (!entries.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 3;
      cell.textContent = 'No status effects found.';
      cell.style.color = 'var(--text-secondary)';
      row.appendChild(cell);
      this.statusEffectsTableBody.appendChild(row);
      return;
    }
    entries.forEach((entry) => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      nameCell.textContent = entry.label;
      const commandCell = document.createElement('td');
      const code = document.createElement('code');
      code.textContent = entry.command;
      commandCell.appendChild(code);
      const iconCell = document.createElement('td');
      const iconFrame = document.createElement('div');
      iconFrame.className = 'status-icon-frame';
      if (entry.iconSrc) {
        const img = document.createElement('img');
        img.src = entry.iconSrc;
        img.alt = `${entry.label} icon`;
        img.className = 'status-icon';
        iconFrame.appendChild(img);
      } else {
        iconFrame.textContent = '—';
      }
      iconCell.appendChild(iconFrame);
      row.appendChild(nameCell);
      row.appendChild(commandCell);
      row.appendChild(iconCell);
      this.statusEffectsTableBody.appendChild(row);
    });
  }

  getOtherCommandsList() {
    return [
      { label: 'CP', command: '{{cp,2}}', iconSrc: 'Assets/Icons/CP/cp_blank.png' },
      { label: 'Draw', command: '{{draw,3}}', iconSrc: 'Assets/Icons/Draw/draw_blank.png' },
      { label: 'Damage', command: '{{damage,10}}', iconSrc: 'Assets/Icons/Dmg/dmg_blank.png' },
      { label: 'R Damage', command: '{{rdmg,4}}', iconSrc: 'Assets/Icons/Rdmg/dmg_blank.png' },
      { label: 'Prevent', command: '{{prevent,6}}', iconSrc: 'Assets/Icons/Prevent/prevent_blank.png' },
      { label: 'Prevent (Half)', command: '{{prevent,half}}', iconSrc: 'Assets/Icons/Prevent/prevent_half.png' },
      { label: 'Heal', command: '{{heal,2}}', iconSrc: 'Assets/Icons/Heal/heal_2.png' },
      { label: 'Straight', command: '{{straight,small,#ff3333}}', iconSrc: 'Assets/Icons/Straight/small.png' },
      { label: 'Ability Trigger', command: '{{at,basic_1,#33ccff}}', iconSrc: 'Assets/Ability Trigger/basic_1.png' },
      { label: 'Ability Dice (Count)', command: '{{abilitydice,3,#33ccff}}', iconSrc: 'Assets/Icons/Ability Dice/ability_dice.png' },
      { label: 'Ability Dice (Small)', command: '{{abilitydice,small}}', iconSrc: 'Assets/Icons/Ability Dice/straight/small_straight.png' },
      { label: 'Ability Dice (Large)', command: '{{abilitydice,large}}', iconSrc: 'Assets/Icons/Ability Dice/straight/large_straight.png' },
      { label: 'Basic Dice', command: '{{basicdice,3,#33ccff}}', iconSrc: 'Assets/Icons/Ability Dice/ability_dice.png' },
      { label: 'Text Dice', command: '{{textdice,3,#33ccff}}', iconSrc: 'Assets/Icons/Ability Dice/ability_dice.png' },
      { label: 'Defensive Dice', command: '{{defensivedice}}', iconSrc: 'Assets/Icons/Defensive Dice/ability_dice_w.png' },
      { label: 'Defensive Dice (Count)', command: '{{defensivedice,3}}', iconSrc: 'Assets/Icons/Defensive Dice/ability_dice_w.png' },
      { label: 'Defensive Roll', command: '{{defensive_roll,1}}', iconSrc: 'Assets/Icons/Defensive Dice/defensive_roll.png' },
      { label: 'Defensive Roll (EX)', command: '{{defensive_roll,ex}}', iconSrc: 'Assets/Icons/Defensive Dice/defensive_roll_ex.png' },
      { label: 'Dice', command: '{{dice}}', iconSrc: 'Assets/Icons/Dice/dice.png' },
      { label: 'Half', command: '{{half}}', iconSrc: 'Assets/Icons/Half/half.png' }
    ];
  }

  renderOtherCommandsTable() {
    if (!this.otherCommandsTableBody) return;
    this.otherCommandsTableBody.innerHTML = '';
    const entries = this.getOtherCommandsList();
    entries.forEach((entry) => {
      const row = document.createElement('tr');

      const labelCell = document.createElement('td');
      labelCell.textContent = entry.label;

      const commandCell = document.createElement('td');
      const code = document.createElement('code');
      code.textContent = entry.command;
      commandCell.appendChild(code);

      const iconCell = document.createElement('td');
      const iconFrame = document.createElement('div');
      iconFrame.className = 'status-icon-frame';
      if (entry.iconSrc) {
        const img = document.createElement('img');
        img.src = entry.iconSrc;
        img.alt = `${entry.label} icon`;
        img.className = 'status-icon';
        iconFrame.appendChild(img);
      } else {
        iconFrame.textContent = '-';
      }
      iconCell.appendChild(iconFrame);

      row.appendChild(labelCell);
      row.appendChild(commandCell);
      row.appendChild(iconCell);
      this.otherCommandsTableBody.appendChild(row);
    });
  }

  getAbilityDiceSlots() {
    return ['A', 'B', 'C', 'D', 'E', 'F'];
  }

  getAbilityDiceEntries(card) {
    const rows = Array.isArray(card?.abilityDiceEntries) ? card.abilityDiceEntries : [];
    const slots = new Set(this.getAbilityDiceSlots());
    return rows
      .map((row) => {
        const slot = String(row?.slot || '').toUpperCase();
        if (!slots.has(slot)) return null;
        return {
          slot,
          iconData: row?.iconData || '',
          iconUrl: row?.iconUrl || '',
          fileName: row?.fileName || ''
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.slot.localeCompare(b.slot));
  }

  getNextAbilityDiceSlot(entries) {
    const used = new Set((entries || []).map((entry) => entry.slot));
    return this.getAbilityDiceSlots().find((slot) => !used.has(slot)) || '';
  }

  addAbilityDiceEntry() {
    let card = gameState.getCard();
    const current = this.getAbilityDiceEntries(card);
    const slotFromDropdown = String(this.abilityDiceSelect?.value || '').toUpperCase();
    const nextSlot = slotFromDropdown || this.getNextAbilityDiceSlot(current);
    if (!nextSlot) return;
    if (current.some((entry) => entry.slot === nextSlot)) return;
    const updated = [...current, { slot: nextSlot, iconData: '', iconUrl: '', fileName: '' }]
      .sort((a, b) => a.slot.localeCompare(b.slot));
    gameState.updateProperty('abilityDiceEntries', updated);
    card = gameState.getCard();
    this.renderAbilityDiceControls(card);
  }

  removeAbilityDiceEntry(slot) {
    const safeSlot = String(slot || '').toUpperCase();
    let card = gameState.getCard();
    const current = this.getAbilityDiceEntries(card);
    const updated = current.filter((entry) => entry.slot !== safeSlot);
    gameState.updateProperty('abilityDiceEntries', updated);
    card = gameState.getCard();
    this.renderAbilityDiceControls(card);
    renderer.render(card);
  }

  async handleAbilityDiceUpload(slot, file) {
    if (!slot || !file) return;
    const safeSlot = String(slot).toUpperCase();
    if (!this.validateImageFile(file, { label: 'ability icon' })) return;
    const dataUrl = await this.readFileAsDataUrl(file, 'Failed to read ability dice icon.').catch((error) => {
      console.warn('Failed to upload ability dice icon:', error);
      alert('Failed to read the selected ability icon.');
      return '';
    });
    if (!dataUrl) return;

    let card = gameState.getCard();
    const entries = this.getAbilityDiceEntries(card);
    const exists = entries.some((entry) => entry.slot === safeSlot);
    const next = exists
      ? entries.map((entry) => (
        entry.slot === safeSlot
          ? { ...entry, iconData: dataUrl, iconUrl: '', fileName: file.name || '' }
          : entry
      ))
      : [...entries, { slot: safeSlot, iconData: dataUrl, iconUrl: '', fileName: file.name || '' }];
    gameState.updateProperty('abilityDiceEntries', next.sort((a, b) => a.slot.localeCompare(b.slot)));
    card = gameState.getCard();
    this.renderAbilityDiceControls(card);
    renderer.render(card);
  }

  renderAbilityDiceControls(card) {
    if (!this.abilityDiceSelect || !this.abilityDiceList) return;
    const entries = this.getAbilityDiceEntries(card);
    const entryMap = new Map(entries.map((entry) => [entry.slot, entry]));
    const slots = this.getAbilityDiceSlots();
    const availableSlots = slots.filter((slot) => !entryMap.has(slot));

    this.abilityDiceSelect.innerHTML = '';
    if (!availableSlots.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No slots left';
      this.abilityDiceSelect.appendChild(opt);
      this.abilityDiceSelect.disabled = true;
      if (this.abilityDiceAddBtn) this.abilityDiceAddBtn.disabled = true;
    } else {
      availableSlots.forEach((slot) => {
        const opt = document.createElement('option');
        opt.value = slot;
        opt.textContent = slot;
        this.abilityDiceSelect.appendChild(opt);
      });
      this.abilityDiceSelect.disabled = false;
      if (this.abilityDiceAddBtn) this.abilityDiceAddBtn.disabled = false;
    }

    this.abilityDiceList.innerHTML = '';
    entries.forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'ability-dice-item';

      const label = document.createElement('div');
      label.className = 'ability-dice-label';
      label.textContent = entry.slot;

      const uploadInput = this.createInlineImageUploadInput(
        `Upload Ability Dice ${entry.slot}`,
        (file) => this.handleAbilityDiceUpload(entry.slot, file)
      );

      const preview = document.createElement('img');
      preview.className = 'ability-dice-preview';
      preview.alt = `Ability Dice ${entry.slot}`;
      const previewSrc = entry.iconData || entry.iconUrl || '';
      preview.src = previewSrc;
      preview.title = entry.fileName || `Ability Dice ${entry.slot}`;
      if (!previewSrc) {
        preview.style.display = 'none';
      }

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger btn-small';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => this.removeAbilityDiceEntry(entry.slot));

      row.appendChild(label);
      row.appendChild(uploadInput);
      row.appendChild(preview);
      row.appendChild(removeBtn);
      this.abilityDiceList.appendChild(row);
    });
  }

  buildLeafletBreakOptions() {
    const options = [
      ['Assets/Leaflet/Front/Break/Small_1.png', 416, 147],
      ['Assets/Leaflet/Front/Break/Small_2.png', 416, 147],
      ['Assets/Leaflet/Front/Break/Small_3.png', 416, 147],
      ['Assets/Leaflet/Front/Break/Medium_1.png', 426, 264],
      ['Assets/Leaflet/Front/Break/Medium_2.png', 426, 264],
      ['Assets/Leaflet/Front/Break/Medium_3.png', 426, 264],
      ['Assets/Leaflet/Front/Break/bottom_1.png', 426, 264],
      ['Assets/Leaflet/Front/Break/bottom_2.png', 426, 309],
      ['Assets/Leaflet/Front/Break/bottom_3.png', 426, 371],
      ['Assets/Leaflet/Front/Break/bottom_4.png', 426, 625]
    ];
    return options.map(([path, width, height]) => ({
      path,
      width,
      height,
      label: this.formatLeafletBreakLabel(path)
    }));
  }

  formatLeafletBreakLabel(path) {
    const fileName = String(path || '').split('/').pop() || '';
    const base = fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').trim();
    if (!base) return 'Break';
    return base.replace(/\b[a-z]/g, (match) => match.toUpperCase());
  }

  isValidLeafletBreakPath(path) {
    const safePath = String(path || '').trim();
    if (!safePath) return false;
    return this.leafletBreakOptions.some((option) => option.path === safePath);
  }

  getLeafletBreakOption(path) {
    const safePath = String(path || '').trim();
    if (!safePath) return null;
    return this.leafletBreakOptions.find((option) => option.path === safePath) || null;
  }

  clampLeafletBreakPercent(value, fallback = 50) {
    const numeric = Number(value);
    const safeValue = Number.isFinite(numeric) ? numeric : fallback;
    return Math.max(-25, Math.min(125, Math.round(safeValue * 10) / 10));
  }

  getLeafletBreakDefaultPositions(paths = []) {
    const validOptions = paths
      .map((path) => this.getLeafletBreakOption(path))
      .filter(Boolean);
    if (!validOptions.length) return [];

    const baseHeight = 1203;
    const gapPx = 12;
    const bottomInsetPx = 36;
    const totalHeight = validOptions.reduce((sum, option) => sum + option.height, 0)
      + Math.max(0, validOptions.length - 1) * gapPx;
    let currentTop = Math.max(0, baseHeight - bottomInsetPx - totalHeight);

    return validOptions.map((option) => {
      const position = {
        x: 50,
        y: this.clampLeafletBreakPercent((currentTop / baseHeight) * 100, 50)
      };
      currentTop += option.height + gapPx;
      return position;
    });
  }

  normalizeLeafletBreakEntries(source) {
    const rawEntries = Array.isArray(source) ? source : [];
    const validPaths = rawEntries
      .map((entry) => {
        const rawPath = entry && typeof entry === 'object' && !Array.isArray(entry)
          ? entry.path
          : entry;
        const safePath = String(rawPath || '').trim();
        return this.isValidLeafletBreakPath(safePath) ? safePath : '';
      })
      .filter(Boolean);
    const defaultPositions = this.getLeafletBreakDefaultPositions(validPaths);
    let validIndex = 0;

    return rawEntries.map((entry) => {
      const rawObject = entry && typeof entry === 'object' && !Array.isArray(entry)
        ? entry
        : null;
      const rawPath = rawObject ? rawObject.path : entry;
      const safePath = String(rawPath || '').trim();
      if (!this.isValidLeafletBreakPath(safePath)) {
        return {
          path: '',
          x: this.clampLeafletBreakPercent(rawObject?.x, 50),
          y: this.clampLeafletBreakPercent(rawObject?.y, 50)
        };
      }

      const fallback = defaultPositions[validIndex] || { x: 50, y: 50 };
      validIndex += 1;
      return {
        path: safePath,
        x: this.clampLeafletBreakPercent(rawObject?.x, fallback.x),
        y: this.clampLeafletBreakPercent(rawObject?.y, fallback.y)
      };
    });
  }

  getLeafletBreakEntries(card) {
    return this.normalizeLeafletBreakEntries(card?.leafletBreaks);
  }

  addLeafletBreakEntry() {
    let card = gameState.getCard();
    const entries = this.getLeafletBreakEntries(card);
    gameState.updateProperty('leafletBreaks', [...entries, { path: '', x: 50, y: 50 }]);
    card = gameState.getCard();
    this.renderLeafletBreakControls(card);
    renderer.render(card);
  }

  updateLeafletBreakEntry(index, value) {
    const safeIndex = Number(index);
    if (!Number.isInteger(safeIndex) || safeIndex < 0) return;
    let card = gameState.getCard();
    const entries = this.getLeafletBreakEntries(card);
    if (safeIndex >= entries.length) return;
    const nextEntries = entries.map((entry) => ({ ...entry }));
    const previousPath = nextEntries[safeIndex].path;
    const nextPath = this.isValidLeafletBreakPath(value) ? String(value).trim() : '';
    nextEntries[safeIndex].path = nextPath;
    if (!this.isValidLeafletBreakPath(previousPath) && nextPath) {
      delete nextEntries[safeIndex].x;
      delete nextEntries[safeIndex].y;
    }
    gameState.updateProperty('leafletBreaks', this.normalizeLeafletBreakEntries(nextEntries));
    card = gameState.getCard();
    this.renderLeafletBreakControls(card);
    renderer.render(card);
  }

  updateLeafletBreakPosition(index, axis, value) {
    const safeIndex = Number(index);
    if (!Number.isInteger(safeIndex) || safeIndex < 0) return;
    if (axis !== 'x' && axis !== 'y') return;
    const entries = this.getLeafletBreakEntries(gameState.getCard());
    if (safeIndex >= entries.length) return;
    const current = entries[safeIndex];
    this.setLeafletBreakPosition(safeIndex, {
      x: axis === 'x' ? value : current.x,
      y: axis === 'y' ? value : current.y
    });
  }

  setLeafletBreakPosition(index, position, options = {}) {
    const safeIndex = Number(index);
    if (!Number.isInteger(safeIndex) || safeIndex < 0) return null;
    const nextPosition = position && typeof position === 'object' ? position : {};
    let card = gameState.getCard();
    const entries = this.getLeafletBreakEntries(card);
    if (safeIndex >= entries.length) return null;
    const nextEntries = entries.map((entry) => ({ ...entry }));
    nextEntries[safeIndex] = {
      ...nextEntries[safeIndex],
      x: this.clampLeafletBreakPercent(nextPosition.x, nextEntries[safeIndex].x),
      y: this.clampLeafletBreakPercent(nextPosition.y, nextEntries[safeIndex].y)
    };
    gameState.updateProperty('leafletBreaks', nextEntries);
    card = gameState.getCard();
    if (options.refreshControls !== false) {
      this.renderLeafletBreakControls(card);
    }
    if (options.renderPreview !== false) {
      renderer.render(card);
    }
    return card;
  }

  removeLeafletBreakEntry(index) {
    const safeIndex = Number(index);
    if (!Number.isInteger(safeIndex) || safeIndex < 0) return;
    let card = gameState.getCard();
    const entries = this.getLeafletBreakEntries(card);
    if (safeIndex >= entries.length) return;
    const next = entries.filter((_, entryIndex) => entryIndex !== safeIndex);
    gameState.updateProperty('leafletBreaks', next);
    card = gameState.getCard();
    this.renderLeafletBreakControls(card);
    renderer.render(card);
  }

  renderLeafletBreakControls(card) {
    if (!this.leafletBreakList) return;
    const entries = this.getLeafletBreakEntries(card);
    const isFront = String(card?.leafletSide || 'front').toLowerCase() !== 'back';

    this.leafletBreakList.innerHTML = '';

    if (this.leafletBreakAddBtn) {
      this.leafletBreakAddBtn.disabled = !isFront;
      this.leafletBreakAddBtn.title = isFront ? '' : 'Break overlays render on the front leaflet side only.';
    }

    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'leaflet-break-empty';
      empty.textContent = isFront ? 'No breaks added yet.' : 'Switch to Front to add break overlays.';
      this.leafletBreakList.appendChild(empty);
      return;
    }

    entries.forEach((entry, index) => {
      const row = document.createElement('div');
      row.className = 'leaflet-break-row';

      const label = document.createElement('div');
      label.className = 'ability-dice-label';
      label.textContent = `Break ${index + 1}`;

      const select = document.createElement('select');
      select.className = 'leaflet-break-select';
      select.disabled = !isFront;

      const blankOption = document.createElement('option');
      blankOption.value = '';
      blankOption.textContent = 'Select a break';
      select.appendChild(blankOption);

      this.leafletBreakOptions.forEach((option) => {
        const optionEl = document.createElement('option');
        optionEl.value = option.path;
        optionEl.textContent = option.label;
        select.appendChild(optionEl);
      });

      select.value = entry.path;
      select.addEventListener('change', (event) => {
        this.updateLeafletBreakEntry(index, event.target.value);
      });

      const xInput = document.createElement('input');
      xInput.type = 'number';
      xInput.className = 'leaflet-break-position';
      xInput.min = '-25';
      xInput.max = '125';
      xInput.step = '0.1';
      xInput.placeholder = 'X %';
      xInput.title = 'Horizontal position (%)';
      xInput.setAttribute('aria-label', `Break ${index + 1} horizontal position`);
      xInput.disabled = !isFront || !entry.path;
      xInput.value = entry.path ? String(entry.x) : '';
      xInput.addEventListener('change', (event) => {
        this.updateLeafletBreakPosition(index, 'x', event.target.value);
      });

      const yInput = document.createElement('input');
      yInput.type = 'number';
      yInput.className = 'leaflet-break-position';
      yInput.min = '-25';
      yInput.max = '125';
      yInput.step = '0.1';
      yInput.placeholder = 'Y %';
      yInput.title = 'Vertical position (%)';
      yInput.setAttribute('aria-label', `Break ${index + 1} vertical position`);
      yInput.disabled = !isFront || !entry.path;
      yInput.value = entry.path ? String(entry.y) : '';
      yInput.addEventListener('change', (event) => {
        this.updateLeafletBreakPosition(index, 'y', event.target.value);
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger btn-small';
      removeBtn.textContent = 'Remove';
      removeBtn.disabled = !isFront;
      removeBtn.addEventListener('click', () => this.removeLeafletBreakEntry(index));

      row.appendChild(label);
      row.appendChild(select);
      row.appendChild(xInput);
      row.appendChild(yInput);
      row.appendChild(removeBtn);
      this.leafletBreakList.appendChild(row);
    });
  }

  slugifyCustomStatusName(name) {
    return String(name || '')
      .trim()
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_');
  }

  getReservedTokenKeys() {
    return new Set([
      'dmg',
      'damage',
      'rdmg',
      'heal',
      'prevent',
      'cp',
      'draw',
      'at',
      'abilitydice',
      'basicdice',
      'textdice',
      'defensivedice',
      'defensive_roll',
      'straight',
      'dice',
      'half'
    ]);
  }

  getCustomStatusEffects(card) {
    const rows = Array.isArray(card?.customStatusEffects) ? card.customStatusEffects : [];
    return rows
      .map((row) => {
        const key = this.slugifyCustomStatusName(row?.key || '');
        if (!key) return null;
        return {
          key,
          name: String(row?.name || key),
          iconData: row?.iconData || '',
          iconUrl: row?.iconUrl || '',
          fileName: row?.fileName || ''
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  addCustomStatusEffectEntry() {
    if (!this.customStatusNameInput) return;
    const rawName = String(this.customStatusNameInput.value || '').trim();
    const key = this.slugifyCustomStatusName(rawName);
    if (!key) return;

    const reserved = this.getReservedTokenKeys();
    if (reserved.has(key)) {
      alert(`"${key}" is reserved. Choose another name.`);
      return;
    }

    let card = gameState.getCard();
    const entries = this.getCustomStatusEffects(card);
    if (entries.some((entry) => entry.key === key)) {
      alert(`Status effect "{{${key}}}" already exists.`);
      return;
    }

    const next = [...entries, {
      key,
      name: rawName,
      iconData: '',
      iconUrl: '',
      fileName: ''
    }];
    gameState.updateProperty('customStatusEffects', next);
    card = gameState.getCard();
    this.customStatusNameInput.value = '';
    this.renderCustomStatusEffectsControls(card);
    renderer.render(card);
  }

  removeCustomStatusEffectEntry(key) {
    const safeKey = this.slugifyCustomStatusName(key);
    let card = gameState.getCard();
    const entries = this.getCustomStatusEffects(card);
    const next = entries.filter((entry) => entry.key !== safeKey);
    gameState.updateProperty('customStatusEffects', next);
    card = gameState.getCard();
    this.renderCustomStatusEffectsControls(card);
    renderer.render(card);
  }

  async handleCustomStatusEffectUpload(key, file) {
    const safeKey = this.slugifyCustomStatusName(key);
    if (!safeKey || !file) return;
    if (!this.validateImageFile(file, { label: 'status icon' })) return;
    const dataUrl = await this.readFileAsDataUrl(file, 'Failed to read status effect icon.').catch((error) => {
      console.warn('Failed to upload status effect icon:', error);
      alert('Failed to read the selected status icon.');
      return '';
    });
    if (!dataUrl) return;

    let card = gameState.getCard();
    const entries = this.getCustomStatusEffects(card);
    const next = entries.map((entry) => (
      entry.key === safeKey
        ? { ...entry, iconData: dataUrl, iconUrl: '', fileName: file.name || '' }
        : entry
    ));
    gameState.updateProperty('customStatusEffects', next);
    card = gameState.getCard();
    this.renderCustomStatusEffectsControls(card);
    renderer.render(card);
  }

  renderCustomStatusEffectsControls(card) {
    if (!this.customStatusList) return;
    const entries = this.getCustomStatusEffects(card);
    this.customStatusList.innerHTML = '';
    entries.forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'ability-dice-item';
      row.classList.add('custom-status-item');

      const label = document.createElement('div');
      label.className = 'ability-dice-label';
      label.textContent = entry.name;

      const command = document.createElement('code');
      command.className = 'custom-status-command';
      command.textContent = `{{${entry.key}}}`;

      const uploadInput = this.createInlineImageUploadInput(
        `Upload ${entry.name} icon`,
        (file) => this.handleCustomStatusEffectUpload(entry.key, file)
      );

      const preview = document.createElement('img');
      preview.className = 'ability-dice-preview';
      preview.alt = `${entry.name} icon`;
      const previewSrc = entry.iconData || entry.iconUrl || '';
      preview.src = previewSrc;
      preview.title = entry.fileName || `${entry.name} icon`;

      if (!previewSrc) {
        preview.style.display = 'none';
      }

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger btn-small';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => this.removeCustomStatusEffectEntry(entry.key));

      row.appendChild(label);
      row.appendChild(command);
      row.appendChild(uploadInput);
      row.appendChild(preview);
      row.appendChild(removeBtn);
      this.customStatusList.appendChild(row);
    });
  }

  setDeckViewScale(value, persist) {
    const next = Number(value);
    const scale = Number.isFinite(next) ? Math.max(0.5, Math.min(2, next)) : 1;
    this.deckViewCardScale = scale;
    if (this.deckViewScaleSlider) {
      this.deckViewScaleSlider.value = scale.toFixed(2);
    }
    if (this.deckViewScaleValue) {
      this.deckViewScaleValue.textContent = `${Math.round(scale * 100)}%`;
    }
    if (persist) {
      localStorage.setItem(this.deckViewScaleKey, String(scale));
    }
    this.applyDeckViewTransform();
  }

  setDeckViewOffsets(x, y, persist) {
    const nextX = Number(x);
    const nextY = Number(y);
    this.deckViewCardOffsetX = Number.isFinite(nextX) ? nextX : 0;
    this.deckViewCardOffsetY = Number.isFinite(nextY) ? nextY : 0;
    if (persist) {
      localStorage.setItem(this.deckViewOffsetXKey, String(this.deckViewCardOffsetX));
      localStorage.setItem(this.deckViewOffsetYKey, String(this.deckViewCardOffsetY));
    }
    this.applyDeckViewTransform();
  }

  applyDeckViewTransform() {
    if (!this.deckViewGrid) return;
    const scale = Number.isFinite(this.deckViewCardScale) ? this.deckViewCardScale : 1;
    const x = Number.isFinite(this.deckViewCardOffsetX) ? this.deckViewCardOffsetX : 0;
    const y = Number.isFinite(this.deckViewCardOffsetY) ? this.deckViewCardOffsetY : 0;
    this.deckViewGrid.style.setProperty('--deck-card-scale', String(scale));
    this.deckViewGrid.style.setProperty('--deck-card-offset-x', `${x}px`);
    this.deckViewGrid.style.setProperty('--deck-card-offset-y', `${y}px`);
  }

  handleDeckViewKeyDown(e) {
    if (!this.isDeckViewOpen()) return;
    const target = e.target;
    const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;
    const key = e.key;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;
    e.preventDefault();
    const step = e.shiftKey ? 5 : 1;
    let x = this.deckViewCardOffsetX;
    let y = this.deckViewCardOffsetY;
    if (key === 'ArrowLeft') x -= step;
    if (key === 'ArrowRight') x += step;
    if (key === 'ArrowUp') y -= step;
    if (key === 'ArrowDown') y += step;
    this.setDeckViewOffsets(x, y, true);
  }

  getStatusEffectPreviewSize() {
    const card = gameState.getCard ? gameState.getCard() : {};
    const activeBlock = this.getActiveDescriptionBlock(card);
    const fontSize = this.clampDescriptionFontSize(
      activeBlock?.fontSize ?? card.descriptionFontSize,
      this.getDescriptionContext().defaultFontSize
    );
    const descriptionIconScale = 1.386;
    const baseSize = Math.round(fontSize * descriptionIconScale);
    const statusScale = Number(renderer?.statusEffectIconScale) || 1;
    const rawScale = Number(activeBlock?.scale);
    const renderScale = Number.isFinite(rawScale) && rawScale > 0 ? rawScale : 1;
    return Math.max(8, Math.round(baseSize * statusScale * renderScale));
  }

  updateStatusEffectsIconSize() {
    if (!this.statusEffectsModal || !this.statusEffectsModal.classList.contains('is-open')) return;
    const size = this.getStatusEffectPreviewSize();
    this.statusEffectsModal.style.setProperty('--status-icon-size', `${size}px`);
  }

  setDeckViewStatus(message) {
    if (this.deckViewStatus) {
      this.deckViewStatus.textContent = message || '';
    }
  }

  setPrintSheetStatus(message) {
    if (this.printSheetStatus) {
      this.printSheetStatus.textContent = message || '';
    }
  }

  buildCardFromJson(source) {
    const base = this.getDeckDefaultCardSnapshot();
    let data = {};
    if (typeof source === 'string') {
      try {
        data = JSON.parse(source);
      } catch (error) {
        console.warn('Failed to parse card JSON for deck view:', error);
        data = {};
      }
    } else if (source && typeof source === 'object') {
      data = source;
    }
    const card = { ...base, ...data };
    const layers = card.layers && typeof card.layers === 'object' ? { ...card.layers } : {};
    card.layers = layers;
    if (!Array.isArray(data.titleBlocks)) card.titleBlocks = [];
    if (!Array.isArray(data.descriptionBlocks)) card.descriptionBlocks = [];
    if (!Array.isArray(data.leafletDescriptionBlocks)) card.leafletDescriptionBlocks = [];
    return card;
  }

  async ensureDeckDefaultCard() {
    if (this.deckDefaultCardLoaded) return;
    this.deckDefaultCardLoaded = true;
    try {
      if (this.deckDefaultCardPath) {
        const response = await fetch(this.deckDefaultCardPath, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data === 'object') {
            this.deckDefaultCard = data;
          }
        }
      }
    } catch (error) {
      this.deckDefaultCard = null;
    }
    if (!this.deckDefaultCard) {
      this.deckDefaultCard = gameState.getDefaultCard ? gameState.getDefaultCard() : {};
    }
  }

  getDeckDefaultCardSnapshot() {
    const base = this.deckDefaultCard || (gameState.getDefaultCard ? gameState.getDefaultCard() : {});
    try {
      return deepCloneUI(base);
    } catch (error) {
      return { ...base };
    }
  }

  async scaleDeckCardDataUrl(src, targetWidth, targetHeight, fitMode = 'cover', extraScale = 1, allowUpscale = true) {
    if (!src) return '';
    const img = await renderer.loadImage(src);
    if (img.width === targetWidth && img.height === targetHeight) {
      return src;
    }
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(targetWidth));
    canvas.height = Math.max(1, Math.round(targetHeight));
    const ctx = canvas.getContext('2d');
    if (!ctx) return src;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const safeMode = String(fitMode || 'cover').toLowerCase();
    let baseScale = safeMode === 'contain'
      ? Math.min(canvas.width / img.width, canvas.height / img.height)
      : Math.max(canvas.width / img.width, canvas.height / img.height);
    if (!allowUpscale) baseScale = Math.min(baseScale, 1);
    const scale = baseScale * (Number.isFinite(extraScale) ? extraScale : 1);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const dx = (canvas.width - drawW) / 2;
    const dy = (canvas.height - drawH) / 2;
    ctx.drawImage(img, dx, dy, drawW, drawH);
    return canvas.toDataURL('image/png');
  }

  async rotateDataUrl(src, degrees = 0) {
    const rotation = Number(degrees) || 0;
    if (!src || rotation % 360 === 0) return src;
    const img = await renderer.loadImage(src);
    const normalized = ((rotation % 360) + 360) % 360;
    const swap = normalized === 90 || normalized === 270;
    const canvas = document.createElement('canvas');
    canvas.width = swap ? img.height : img.width;
    canvas.height = swap ? img.width : img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return src;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    return canvas.toDataURL('image/png');
  }

  async renderDeckCardDataUrl(cardData, rowHeight) {
    const targetWidth = this.deckThumbWidth;
    const targetHeight = rowHeight;
    const renderCard = deepCloneUI(cardData || {});
    renderCard.layers = {
      ...(renderCard.layers || {}),
      cardBleed: false
    };
    const renderWidth = Number(DTC_UI_EXPORT_SIZE.width) || 675;
    const renderHeight = Number(DTC_UI_EXPORT_SIZE.height) || 1050;
    let dataUrl = await renderer.renderCardToDataUrl(renderCard, {
      width: renderWidth,
      height: renderHeight,
      includeBleed: false,
      usePreviewMetrics: false,
      fitMode: 'contain',
      cropToBleedBounds: true
    });
    if (!dataUrl) return '';
    return dataUrl;
  }

  async renderPrintCardDataUrl(cardData, cellWidth, cellHeight) {
    const renderCard = deepCloneUI(cardData || {});
    renderCard.layers = {
      ...(renderCard.layers || {}),
      cardBleed: false
    };
    const renderWidth = Number(DTC_UI_EXPORT_SIZE.width) || 675;
    const renderHeight = Number(DTC_UI_EXPORT_SIZE.height) || 1050;
    let dataUrl = await renderer.renderCardToDataUrl(renderCard, {
      width: renderWidth,
      height: renderHeight,
      includeBleed: false,
      usePreviewMetrics: false,
      fitMode: 'contain',
      trimTransparent: true,
      trimAlphaThreshold: 1,
      cropToBleedBounds: true
    });
    if (!dataUrl) return '';
    const rotation = Number(this.printTemplateConfig?.cardRotation) || 0;
    if (rotation) {
      dataUrl = await this.rotateDataUrl(dataUrl, rotation);
    }
    const extraScale = Number.isFinite(this.printTemplateConfig?.cardScale)
      ? this.printTemplateConfig.cardScale
      : 1;
    // Finalize each print card to the exact grid cell size; keep compact centered in its card template window.
    const fitMode = this.printMode === 'compact' ? 'contain' : 'cover';
    const allowUpscale = this.printMode !== 'compact';
    return this.scaleDeckCardDataUrl(dataUrl, cellWidth, cellHeight, fitMode, extraScale, allowUpscale);
  }

  async loadDefaultDeckCardsForView() {
    const files = await this.loadDefaultDeckManifest();
    if (!files.length) return [];
    const cards = [];
    for (const file of files) {
      const safeFile = String(file || '').trim();
      if (!safeFile) continue;
      try {
        const response = await fetch(`Assets/Deck/default/${safeFile}`, { cache: 'no-store' });
        if (!response.ok) continue;
        const data = await response.json();
        cards.push({
          id: `default:${safeFile}`,
          name: String(data?.name || safeFile).replace(/\.[^/.]+$/, ''),
          json: data,
          sourceFile: safeFile
        });
      } catch (error) {
        console.warn('Failed to load default deck card for view:', file, error);
      }
    }
    return cards;
  }

  normalizePrintEntry(entry, index = 0) {
    const safe = entry && typeof entry === 'object' ? entry : {};
    const rawId = safe.id || safe.cardId || safe.sourceFile || `entry-${index + 1}`;
    const printId = `print:${String(rawId)}`;
    const name = String(safe.name || safe.cardName || `Card ${index + 1}`).trim() || `Card ${index + 1}`;
    return {
      ...safe,
      __printId: printId,
      __printName: name
    };
  }

  async resolvePrintSheetEntries() {
    const deck = this.getSelectedDeck();
    let entries = [];
    let deckLabel = '';
    let sourceKey = '';

    if (deck && Array.isArray(deck.cards) && deck.cards.length) {
      entries = deck.cards;
      deckLabel = deck.name || 'Deck';
      sourceKey = `deck:${deck.id || deck.name || 'selected'}`;
    } else if (!deck) {
      entries = await this.loadDefaultDeckCardsForView();
      deckLabel = 'Default Deck';
      sourceKey = 'deck:default';
    } else {
      sourceKey = `deck:${deck.id || deck.name || 'selected'}`;
    }

    const normalized = entries.map((entry, index) => this.normalizePrintEntry(entry, index));
    return { entries: normalized, deckLabel, sourceKey };
  }

  syncPrintSheetSelection(entries, sourceKey) {
    if (sourceKey !== this.printSheetSourceKey) {
      this.printSheetSourceKey = sourceKey;
      this.printSheetSelectedIds = new Set(entries.map((entry) => entry.__printId));
    }
    const available = new Set(entries.map((entry) => entry.__printId));
    const next = new Set();
    this.printSheetSelectedIds.forEach((id) => {
      if (available.has(id)) next.add(id);
    });
    this.printSheetSelectedIds = next;
    this.printSheetEntries = entries;
  }

  getSelectedPrintEntries(entries) {
    if (!Array.isArray(entries) || !entries.length) return [];
    return entries.filter((entry) => this.printSheetSelectedIds.has(entry.__printId));
  }

  renderPrintSelectionList() {
    if (!this.printSelectionList || !this.printSelectionSummary) return;
    const entries = Array.isArray(this.printSheetEntries) ? this.printSheetEntries : [];
    const selectedCount = entries.filter((entry) => this.printSheetSelectedIds.has(entry.__printId)).length;
    this.printSelectionSummary.textContent = `${selectedCount} selected of ${entries.length}`;
    this.printSelectionList.innerHTML = '';
    entries.forEach((entry) => {
      const label = document.createElement('label');
      label.className = 'print-selection__item';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = this.printSheetSelectedIds.has(entry.__printId);
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.printSheetSelectedIds.add(entry.__printId);
        } else {
          this.printSheetSelectedIds.delete(entry.__printId);
        }
        this.renderPrintSelectionList();
        this.renderPrintSheet();
      });
      const text = document.createElement('span');
      text.textContent = entry.__printName;
      label.appendChild(input);
      label.appendChild(text);
      this.printSelectionList.appendChild(label);
    });
  }

  async renderDeckView() {
    if (!this.deckViewGrid) return;
    const renderToken = ++this.deckViewRenderToken;
    this.deckViewGrid.innerHTML = '';
    this.setDeckViewStatus('Loading deck...');
    this.updateDeckTemplateScale();

    const deck = this.getSelectedDeck();
    let entries = [];
    let deckLabel = '';

    if (deck && Array.isArray(deck.cards) && deck.cards.length) {
      entries = deck.cards;
      deckLabel = deck.name || 'Deck';
    } else if (!deck) {
      entries = await this.loadDefaultDeckCardsForView();
      deckLabel = 'Default Deck';
    } else {
      this.setDeckViewStatus('Selected deck has no cards.');
      if (this.deckViewSummary) this.deckViewSummary.textContent = deck.name ? `${deck.name} • 0 cards` : '0 cards';
      return;
    }

    if (!entries.length) {
      this.setDeckViewStatus('No cards to display.');
      if (this.deckViewSummary) this.deckViewSummary.textContent = deckLabel ? `${deckLabel} • 0 cards` : '0 cards';
      return;
    }
    await this.ensureDeckDefaultCard();
    if (renderToken !== this.deckViewRenderToken) return;

    const maxCards = this.deckTemplateConfig.columns * this.deckTemplateConfig.rows;
    const truncated = entries.length > maxCards;
    if (this.deckViewSummary) {
      const base = deckLabel ? `${deckLabel} • ${entries.length} cards` : `${entries.length} cards`;
      this.deckViewSummary.textContent = truncated ? `${base} (showing ${maxCards})` : base;
    }

    const renderTotal = Math.min(entries.length, maxCards);
    let index = 0;
    for (const entry of entries) {
      if (index >= maxCards) break;
      index += 1;
      if (renderToken !== this.deckViewRenderToken) return;
      this.setDeckViewStatus(`Rendering ${index} of ${renderTotal}...`);
      const cardData = this.buildCardFromJson(entry && entry.json ? entry.json : entry);
      cardData.layers = { ...(cardData.layers || {}), cardBleed: false };
      const name = String(cardData.name || entry?.name || `Card ${index}`).trim() || `Card ${index}`;
      if (!cardData.name || cardData.name === 'Title') {
        cardData.name = name;
      }
      const rowIndex = Math.floor((index - 1) / this.deckTemplateConfig.columns);
      const rowHeights = this.deckTemplateConfig.rowHeights || [];
      const rowHeight = rowHeights[rowIndex] || rowHeights[0] || Math.round(this.deckThumbWidth * (2100 / 1350));
      const dataUrl = await this.renderDeckCardDataUrl(cardData, rowHeight);
      if (renderToken !== this.deckViewRenderToken) return;
      const cardEl = document.createElement('div');
      cardEl.className = 'deck-card';
      cardEl.title = name;
      if (Array.isArray(this.deckTemplateConfig.rowGaps) && this.deckTemplateConfig.rowGaps.length === this.deckTemplateConfig.rows - 1) {
        cardEl.style.gridRowStart = String(rowIndex * 2 + 1);
      }
      if (dataUrl) {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = name;
        cardEl.appendChild(img);
      } else {
        const placeholder = document.createElement('div');
        placeholder.textContent = 'Preview unavailable';
        placeholder.style.fontSize = '11px';
        placeholder.style.color = 'var(--text-secondary)';
        cardEl.appendChild(placeholder);
      }
      this.deckViewGrid.appendChild(cardEl);
    }

    if (renderToken === this.deckViewRenderToken) {
      this.setDeckViewStatus('');
    }
  }

  async renderPrintSheet() {
    const pagesContainer = this.printSheetPages || (this.printSheetTemplate ? this.printSheetTemplate.parentElement : null);
    if (!pagesContainer) return;
    const renderToken = ++this.printSheetRenderToken;
    pagesContainer.innerHTML = '';
    this.setPrintSheetStatus('Loading deck...');
    this.updatePrintTemplateScale();

    const { entries: allEntries, deckLabel, sourceKey } = await this.resolvePrintSheetEntries();
    this.syncPrintSheetSelection(allEntries, sourceKey);
    this.renderPrintSelectionList();

    if (!allEntries.length) {
      this.setPrintSheetStatus('No cards to display.');
      if (this.printSheetSummary) this.printSheetSummary.textContent = deckLabel ? `${deckLabel} • 0 cards` : '0 cards';
      return;
    }

    const entries = this.getSelectedPrintEntries(allEntries);
    if (!entries.length) {
      this.setPrintSheetStatus('No cards selected.');
      if (this.printSheetSummary) this.printSheetSummary.textContent = `${deckLabel || 'Deck'} • 0 selected`;
      return;
    }

    await this.ensureDeckDefaultCard();
    if (renderToken !== this.printSheetRenderToken) return;

    const config = this.printTemplateConfig;
    const maxCards = config.columns * config.rows;
    const pageCount = Math.max(1, Math.ceil(entries.length / maxCards));
    if (this.printSheetSummary) {
      const base = deckLabel
        ? `${deckLabel} • ${entries.length} selected of ${allEntries.length}`
        : `${entries.length} selected of ${allEntries.length}`;
      const withPages = `${base} • ${pageCount} sheet${pageCount === 1 ? '' : 's'}`;
      this.printSheetSummary.textContent = withPages;
    }

    const renderTotal = Math.min(entries.length, maxCards * pageCount);
    const cellWidth = config.columnWidth;
    const cellHeight = config.rowHeight;
    let index = 0;

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      const page = this.createPrintSheetPage();
      const grid = page.querySelector('.print-card-grid');
      pagesContainer.appendChild(page);
      this.printSheetTemplate = page;
      this.printSheetGrid = grid;
      this.applyPrintLayerAssetsToPage(page);

      const start = pageIndex * maxCards;
      const end = Math.min(start + maxCards, entries.length);
      for (let i = start; i < end; i += 1) {
        if (renderToken !== this.printSheetRenderToken) return;
        index += 1;
        this.setPrintSheetStatus(`Rendering ${index} of ${renderTotal}...`);
        const entry = entries[i];
        const cardData = this.buildCardFromJson(entry && entry.json ? entry.json : entry);
        cardData.layers = { ...(cardData.layers || {}), cardBleed: false };
        const name = String(cardData.name || entry?.__printName || entry?.name || `Card ${index}`).trim() || `Card ${index}`;
        if (!cardData.name || cardData.name === 'Title') {
          cardData.name = name;
        }
        const dataUrl = await this.renderPrintCardDataUrl(cardData, cellWidth, cellHeight);
        if (renderToken !== this.printSheetRenderToken) return;
        const cardEl = document.createElement('div');
        cardEl.className = 'print-card';
        cardEl.title = name;
        if (dataUrl) {
          const img = document.createElement('img');
          img.src = dataUrl;
          img.alt = name;
          cardEl.appendChild(img);
        } else {
          const placeholder = document.createElement('div');
          placeholder.textContent = 'Preview unavailable';
          placeholder.style.fontSize = '11px';
          placeholder.style.color = 'var(--text-secondary)';
          cardEl.appendChild(placeholder);
        }
        if (grid) grid.appendChild(cardEl);
      }
    }

    this.updatePrintTemplateScale();
    this.applyPrintLayerVisibility();

    if (renderToken === this.printSheetRenderToken) {
      this.setPrintSheetStatus('');
    }
  }

  async createDeck() {
    if (!this.deckNameInput) return;
    const name = String(this.deckNameInput.value || '').trim();
    if (!name) {
      alert('Please enter a deck name.');
      return;
    }
    const store = this.loadDeckStore();
    const exists = Object.values(store.decks).some((deck) => deck.name === name);
    if (exists) {
      alert('A deck with that name already exists.');
      return;
    }
    const id = `deck_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const deck = { id, name, cards: [] };
    const imported = await this.importDefaultDeckCards(deck);
    if (imported.length) {
      deck.cards = imported;
    }
    store.decks[id] = deck;
    store.order = Array.isArray(store.order) ? store.order : [];
    store.order.push(id);
    this.saveDeckStore(store);
    this.deckNameInput.value = '';
    this.refreshDeckUI();
    if (this.deckSelect) this.deckSelect.value = id;
    this.refreshDeckCards();
    if (this.deckCardSelect && deck.cards && deck.cards.length) {
      this.deckCardSelect.value = deck.cards[0].id;
      this.loadCardFromDeck();
    }
  }

  saveBoardAbility(card = null) {
    const target = card && typeof card === 'object' ? card : gameState.getCard();
    const name = String(target?.name || '').trim();
    if (!name || name === 'Title') {
      alert('Please name the Board Ability before saving it.');
      return;
    }

    const store = this.loadBoardAbilityStore();
    const abilities = store.abilities && typeof store.abilities === 'object' ? store.abilities : {};
    const order = Array.isArray(store.order) ? store.order : [];
    const existingId = order.find((id) => {
      const entry = abilities[id];
      return entry && entry.name === name;
    });

    if (existingId && !confirm(`"${name}" already exists in the board ability library. Overwrite it?`)) {
      return;
    }

    const id = existingId || `board_ability_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    abilities[id] = {
      id,
      name,
      subType: String(target?.cardSubType || ''),
      savedAt: new Date().toISOString(),
      json: gameState.toJSON()
    };
    if (!existingId) {
      order.push(id);
    }

    this.saveBoardAbilityStore({ abilities, order });
    this.refreshBoardAbilityOptions();
    alert('Board Ability saved.');
  }

  saveCardToDeck() {
    const card = gameState.getCard();
    if (this.isBoardAbilityCard(card)) {
      this.saveBoardAbility(card);
      return;
    }
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck) {
      alert('Please select a deck first.');
      return;
    }
    const name = (card.name || 'Untitled').trim();
    const json = gameState.toJSON();
    deck.cards = Array.isArray(deck.cards) ? deck.cards : [];
    const existing = deck.cards.find((entry) => entry.name === name);
    const shouldOverwrite = existing
      ? confirm(`"${name}" already exists in this deck. Overwrite it?`)
      : false;
    if (existing && shouldOverwrite) {
      existing.json = json;
      existing.savedAt = new Date().toISOString();
    } else {
      const id = `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const entry = {
        id,
        name,
        savedAt: new Date().toISOString(),
        json
      };
      deck.cards.push(entry);
      if (this.deckCardSelect) this.deckCardSelect.value = id;
    }
    store.decks[deckId] = deck;
    this.saveDeckStore(store);
    this.refreshDeckCards();
    alert('Card saved to deck.');
  }

  loadCardFromDeck() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck || !Array.isArray(deck.cards)) {
      alert('No cards found in this deck.');
      return;
    }
    const cardId = this.deckCardSelect ? this.deckCardSelect.value : '';
    const entry = deck.cards.find((card) => card.id === cardId);
    if (!entry) {
      alert('Please select a card to load.');
      return;
    }
    if (gameState.fromJSON(entry.json)) {
      this.updateUI();
    } else {
      alert('Failed to load card from deck.');
    }
  }

  deleteCardFromDeck() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
      alert('No cards to delete.');
      return;
    }
    const cardId = this.deckCardSelect ? this.deckCardSelect.value : '';
    if (!cardId) {
      alert('Please select a card to delete.');
      return;
    }
    const index = deck.cards.findIndex((card) => card.id === cardId);
    const entry = index >= 0 ? deck.cards[index] : null;
    const name = entry?.name || 'this card';
    if (!confirm(`Delete "${name}" from this deck?`)) return;
    deck.cards = deck.cards.filter((card) => card.id !== cardId);
    store.decks[deckId] = deck;
    this.saveDeckStore(store);
    this.refreshDeckCards();
    if (!deck.cards.length) {
      gameState.reset();
      this.updateUI();
      return;
    }
    const nextIndex = Math.min(index, deck.cards.length - 1);
    const nextCard = deck.cards[nextIndex];
    if (nextCard && gameState.fromJSON(nextCard.json)) {
      this.updateUI();
      if (this.deckCardSelect) this.deckCardSelect.value = nextCard.id;
    }
  }

  deleteDeck() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    if (!deckId || !store.decks[deckId]) {
      alert('Please select a deck to delete.');
      return;
    }
    const name = store.decks[deckId].name || 'this deck';
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    delete store.decks[deckId];
    if (Array.isArray(store.order)) {
      store.order = store.order.filter((id) => id !== deckId);
    }
    this.saveDeckStore(store);
    this.refreshDeckUI();
  }
}

// Initialize UI
const ui = new UI();
