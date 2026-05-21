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
    this.titleBoxControls = document.getElementById('titleBoxControls');
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
    this.cardSubTypeOptions = {
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
        'Defensive ability',
        'Ultimate Ability'
      ]
    };
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
    this.boardAbilityHeroCopyGroup = document.getElementById('boardAbilityHeroCopyGroup');
    this.boardAbilityCopyHeroBtn = document.getElementById('boardAbilityCopyHeroBtn');
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
    this.boardCreatorModeSelect = document.getElementById('boardCreatorMode');
    this.boardCreatorPanels = [...document.querySelectorAll('[data-board-creator-panel]')];
    this.boardLayerWorkingArea = document.getElementById('boardLayerWorkingArea');
    this.boardLayerAbilityPadding = document.getElementById('boardLayerAbilityPadding');
    this.boardLayerAbilityBoundary = document.getElementById('boardLayerAbilityBoundary');
    this.boardAddCurrentAbilityBtn = document.getElementById('boardAddCurrentAbilityBtn');
    this.boardPlacementSelect = document.getElementById('boardPlacementSelect');
    this.boardPlacementAddBtn = document.getElementById('boardPlacementAddBtn');
    this.boardPlacementList = document.getElementById('boardPlacementList');
    this.boardSlotsLayer = document.getElementById('boardSlotsLayer');
    this.boardSlotSelects = Array.from({ length: 8 }, (_, index) => document.getElementById(`boardSlot${index + 1}`));
    this.boardSlotCards = Array.from(document.querySelectorAll('.board-slot-card'));
    this.boardSlotRenderToken = 0;
    this.boardPlacementRenderToken = 0;
    this.boardPreviewElement = document.getElementById('boardPreview');

    this.imageUploadInput = document.getElementById('imageUpload');
    this.artSectionTitle = document.getElementById('artSectionTitle');
    this.imageUploadLabel = document.getElementById('imageUploadLabel');
    this.artUploadHelpText = document.getElementById('artUploadHelpText');
    this.imagePreview = document.getElementById('imagePreview');
    this.btnClearImage = document.getElementById('btn-clear-image');
    this.artSelect = document.getElementById('artSelect');
    this.artSearchInput = document.getElementById('artSearchInput');
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
    this.referenceSearchInput = document.getElementById('referenceSearchInput');
    this.showReferenceCheckbox = document.getElementById('showReference');
    this.showReferenceSideBySideCheckbox = document.getElementById('showReferenceSideBySide');
    this.referenceOverlay = document.getElementById('referenceOverlay');
    this.referenceSide = document.getElementById('referenceSide');
    this.referenceOpacity = document.getElementById('referenceOpacity');
    this.previewZoomInput = document.getElementById('previewZoom');
    this.previewZoomValue = document.getElementById('previewZoomValue');

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
    this.cardDragGuideLayer = document.getElementById('cardDragGuideLayer');
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
    this.boardCreatorModeStorageKey = 'dtc_board_creator_mode_v1';
    this.boardCreatorMode = this.getStoredBoardCreatorMode();
    this.sidebarResizer = document.getElementById('sidebarResizer');
    this.sidebarWidthKey = 'dtc_sidebar_width_v1';
    this.previewZoomStorageKey = 'dtc_preview_zoom_v1';
    this.previewZoom = this.getStoredPreviewZoom();
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
      fitSize: 'cover',
      notify: (message) => this.showToast(message, { force: true, duration: 2800 })
    }) : null;
    this.sharedImagePicker = null;
    this.sharedImagePickerHandler = null;
    this.sharedImagePickerLabel = 'image';

    this.btnNew = document.getElementById('btn-new');
    this.btnSave = document.getElementById('btn-save');
    this.btnLoad = document.getElementById('btn-load');
    this.btnExport = document.getElementById('btn-export');
    this.btnShareLink = document.getElementById('btn-share-link');
    this.btnActions = document.getElementById('btn-actions');
    this.actionsMenu = document.getElementById('actionsMenu');
    this.actionsMenuPanel = document.getElementById('actionsMenuPanel');
    this.exportMenu = document.getElementById('exportMenu');
    this.exportMenuPanel = document.getElementById('exportMenuPanel');
    this.btnResetCanvas = document.getElementById('btn-reset-canvas');
    this.btnQuickStart = document.getElementById('btn-quick-start');
    this.btnHowTo = document.getElementById('btn-how-to');
    this.btnWhatsNew = document.getElementById('btn-whats-new');
    this.btnAppSettings = document.getElementById('btn-app-settings');
    this.btnMobileNew = document.getElementById('btn-mobile-new');
    this.btnMobileExport = document.getElementById('btn-mobile-export');
    this.btnMobilePrint = document.getElementById('btn-mobile-print');
    this.btnMobileHelp = document.getElementById('btn-mobile-help');
    this.fileInput = document.getElementById('fileInput');
    this.deckNameInput = document.getElementById('deckNameInput');
    this.deckCreateBtn = document.getElementById('deckCreateBtn');
    this.deckSelect = document.getElementById('deckSelect');
    this.deckCardSelect = document.getElementById('deckCardSelect');
    this.deckSaveBtn = document.getElementById('deckSaveBtn');
    this.deckLoadBtn = document.getElementById('deckLoadBtn');
    this.deckDuplicateCardBtn = document.getElementById('deckDuplicateCardBtn');
    this.deckBatchImportBtn = document.getElementById('deckBatchImportBtn');
    this.deckDeleteCardBtn = document.getElementById('deckDeleteCardBtn');
    this.deckDeleteBtn = document.getElementById('deckDeleteBtn');
    this.deckStorageKey = 'dtc_decks_v1';
    this.boardAbilityStorageKey = 'dtc_board_abilities_v1';
    this.boardSlotStorageKey = 'dtc_board_slots_v1';
    this.boardPlacementStorageKey = 'dtc_board_placements_v1';
    this.boardPanStorageKey = 'dtc_board_pan_v1';
    this.boardLayerVisibilityStorageKey = 'dtc_board_layers_v1';
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
    this.appToast = document.getElementById('appToast');
    this.appLoadingOverlay = document.getElementById('appLoadingOverlay');
    this.appLoadingText = document.getElementById('appLoadingText');
    this.infoBanner = document.getElementById('infoBanner');
    this.infoBannerDismissBtn = document.getElementById('infoBannerDismiss');
    this.busyDepth = 0;
    this.renderDataUrlCache = new Map();
    this.renderDataUrlCacheLimit = 180;
    this.renderDataUrlCacheBytes = 0;
    this.renderDataUrlCacheByteLimit = 64 * 1024 * 1024;
    this.renderWarmupToken = 0;
    this.renderWarmupTimer = null;
    this.renderWarmupIdleHandle = null;
    this.renderWarmupInFlight = false;
    this.renderWarmupQueued = false;
    this.toastHideTimer = null;
    this.quickStartModal = document.getElementById('quickStartModal');
    this.helpModal = document.getElementById('helpModal');
    this.changelogModal = document.getElementById('changelogModal');
    this.settingsModal = document.getElementById('settingsModal');
    this.privacyModal = document.getElementById('privacyModal');
    this.termsModal = document.getElementById('termsModal');
    this.deckBatchImportModal = document.getElementById('deckBatchImportModal');
    this.deckBatchImportInput = document.getElementById('deckBatchImportInput');
    this.deckBatchImportReplace = document.getElementById('deckBatchImportReplace');
    this.deckBatchImportConfirmBtn = document.getElementById('deckBatchImportConfirmBtn');
    this.confirmActionModal = document.getElementById('confirmActionModal');
    this.confirmActionTitle = document.getElementById('confirmActionTitle');
    this.confirmActionMessage = document.getElementById('confirmActionMessage');
    this.confirmActionCancelBtn = document.getElementById('confirmActionCancelBtn');
    this.confirmActionConfirmBtn = document.getElementById('confirmActionConfirmBtn');
    this.shareLinkModal = document.getElementById('shareLinkModal');
    this.shareLinkInput = document.getElementById('shareLinkInput');
    this.shareLinkCopyBtn = document.getElementById('shareLinkCopyBtn');
    this.quickStartNewCardBtn = document.getElementById('quickStartNewCardBtn');
    this.quickStartLoadJsonBtn = document.getElementById('quickStartLoadJsonBtn');
    this.quickStartHowToBtn = document.getElementById('quickStartHowToBtn');
    this.saveDefaultsBtn = document.getElementById('saveDefaultsBtn');
    this.resetToDefaultsBtn = document.getElementById('resetToDefaultsBtn');
    this.restoreFactoryDefaultsBtn = document.getElementById('restoreFactoryDefaultsBtn');
    this.resetAppDataBtn = document.getElementById('resetAppDataBtn');
    this.showProcessingToasts = document.getElementById('showProcessingToasts');
    this.modalOpenButtons = Array.from(document.querySelectorAll('[data-open-modal]'));
    this.modalCloseButtons = Array.from(document.querySelectorAll('[data-close-modal]'));
    this.userDefaultsKey = 'dtc_user_default_card_v1';
    this.quickStartSeenKey = 'dtc_seen_quick_start_v1';
    this.showToastsKey = 'dtc_show_processing_toasts_v1';
    this.printModeStorageKey = 'dtc_print_mode_v1';
    this.showToasts = this.getStoredShowToasts();
    this.appStorageKeys = [
      'diceThroneSavedCard',
      this.deckStorageKey,
      this.boardAbilityStorageKey,
      this.boardSlotStorageKey,
      this.boardPlacementStorageKey,
      this.boardPanStorageKey,
      this.boardLayerVisibilityStorageKey,
      this.boardCreatorModeStorageKey,
      this.workspaceModeStorageKey,
      this.sidebarWidthKey,
      this.previewZoomStorageKey,
      this.printModeStorageKey,
      this.cropperOnUploadKey,
      this.cropMaskKey,
      this.showHiddenLayersKey,
      this.deckViewScaleKey,
      this.deckViewOffsetXKey,
      this.deckViewOffsetYKey,
      this.userDefaultsKey,
      this.quickStartSeenKey,
      this.showToastsKey
    ];
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
    this.previewZoomPersistTimer = null;
    this.renderQueueFlags = new Set();
    this.renderQueueRaf = null;
    this.renderQueueTimer = null;
    this.coalescedStateTimers = new Map();
    this.coalescedStateOpen = new Set();
    this.renderWorker = null;
    this.renderWorkerRequestId = 0;
    this.renderWorkerRequests = new Map();
    this.renderWorkerUnavailable = false;
    this.boardPan = this.getStoredBoardPan();
    this.boardPanDrag = null;
    this.boardPlacementDrag = null;
    this.boardPanControlsInitialized = false;
    this.boardLayerVisibility = this.getStoredBoardLayerVisibility();
    const savedPrintMode = this.getStoredPrintMode();
    this.setPrintMode(savedPrintMode, { persist: false, rerender: false, refreshAssets: true });
    this.applyWorkspaceMode(this.workspaceMode, { persist: false });

    this.initEventListeners();
    this.initBoardPanControls();
    this.setPreviewZoom(this.previewZoom, { persist: false, rerender: false });
    this.applyBoardLayerVisibility(this.boardLayerVisibility, { persist: false });
    this.setBoardPan(this.boardPan?.x || 0, this.boardPan?.y || 0, { persist: false });
    this.initLayerListDragAndDrop();
    this.loadCardArtOptions();
    this.loadFontOptions();
    if (this.referenceManager) {
      this.referenceManager.init()
        .then(() => {
          this.filterSelectOptions(this.referenceSelect, this.referenceSearchInput ? this.referenceSearchInput.value : '', {
            keepValues: ['', '__upload__']
          });
          this.applyWorkspaceReferenceDefault(this.workspaceMode, { force: true });
        })
        .catch((error) => {
          console.warn('Failed to initialize reference manager:', error);
        });
    }
    this.refreshDeckUI();
    this.refreshBoardAbilityOptions();
    this.updateDeckSaveAvailability(gameState.getCard());
    this.syncProcessingToastSetting();
    this.maybeShowQuickStart();
  }

  getStoredPrintMode() {
    if (typeof localStorage === 'undefined') return 'standard';
    const raw = String(localStorage.getItem(this.printModeStorageKey) || '').trim().toLowerCase();
    return this.printModes?.[raw] ? raw : 'standard';
  }

  getStoredPreviewZoom() {
    if (typeof localStorage === 'undefined') return 1;
    const raw = Number(localStorage.getItem(this.previewZoomStorageKey));
    if (!Number.isFinite(raw)) return 1;
    return Math.max(0.5, Math.min(3, raw));
  }

  getStoredWorkspaceMode() {
    if (typeof localStorage === 'undefined') return 'card';
    const raw = String(localStorage.getItem(this.workspaceModeStorageKey) || '').trim().toLowerCase();
    if (raw === 'leaflet' || raw === 'board') return raw;
    return 'card';
  }

  getStoredBoardCreatorMode() {
    if (typeof localStorage === 'undefined') return 'board';
    const raw = String(localStorage.getItem(this.boardCreatorModeStorageKey) || '').trim().toLowerCase();
    return raw === 'ability' ? 'ability' : 'board';
  }

  setBoardCreatorMode(mode, options = {}) {
    const nextMode = String(mode || '').trim().toLowerCase() === 'ability' ? 'ability' : 'board';
    this.boardCreatorMode = nextMode;
    if (this.boardCreatorModeSelect) {
      this.boardCreatorModeSelect.value = nextMode;
    }
    if (options.persist !== false && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.boardCreatorModeStorageKey, nextMode);
    }
    if (this.workspaceMode === 'board' && options.applyWorkspace !== false) {
      this.applyWorkspaceMode('board', { persist: false });
    }
  }

  syncBoardCreatorPanels() {
    const showBoardPanels = this.boardCreatorMode !== 'ability';
    this.boardCreatorPanels.forEach((panel) => {
      const mode = String(panel.getAttribute('data-board-creator-panel') || '').trim();
      const show = mode === 'board' ? showBoardPanels : mode === this.boardCreatorMode;
      panel.style.display = show ? '' : 'none';
      panel.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
  }

  dismissInfoBanner() {
    if (this.infoBanner) this.infoBanner.hidden = true;
  }

  getStoredBoardPan() {
    const fallback = { x: 0, y: 0 };
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(this.boardPanStorageKey);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const x = Number(parsed?.x);
      const y = Number(parsed?.y);
      return {
        x: Number.isFinite(x) ? x : 0,
        y: Number.isFinite(y) ? y : 0
      };
    } catch (error) {
      console.warn('Failed to load board pan state:', error);
      return fallback;
    }
  }

  getStoredShowToasts() {
    if (typeof localStorage === 'undefined') return true;
    const raw = localStorage.getItem(this.showToastsKey);
    if (raw === null) return true;
    return raw !== 'false';
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

  getTitleContext(mode = this.workspaceMode) {
    const isLeaflet = String(mode || '').toLowerCase() === 'leaflet';
    return {
      isLeaflet,
      blocksKey: isLeaflet ? 'leafletTitleBlocks' : 'titleBlocks',
      activeIdKey: isLeaflet ? 'leafletActiveTitleId' : 'activeTitleId',
      nameKey: isLeaflet ? 'leafletName' : 'name',
      positionKey: isLeaflet ? 'leafletTitlePosition' : 'titlePosition',
      fontKey: isLeaflet ? 'leafletTitleFont' : 'titleFont',
      fontSizeKey: isLeaflet ? 'leafletTitleFontSize' : 'titleFontSize',
      letterSpacingKey: isLeaflet ? 'leafletTitleLetterSpacing' : 'titleLetterSpacing',
      defaultPosition: isLeaflet ? { x: 0, y: 0 } : { x: 1.4874028450301893, y: -1.2779890290537477 }
    };
  }

  getArtContext(mode = this.workspaceMode) {
    const normalizedMode = String(mode || '').toLowerCase();
    const isLeaflet = normalizedMode === 'leaflet';
    const isBoardAbility = normalizedMode === 'board-ability'
      || (normalizedMode === 'board' && this.boardCreatorMode === 'ability');
    const prefix = isLeaflet
      ? 'leafletArt'
      : (isBoardAbility ? 'boardAbilityArt' : 'art');
    return {
      isLeaflet,
      isBoardAbility,
      dataKey: `${prefix}Data`,
      urlKey: `${prefix}Url`,
      sourceDataKey: `${prefix}SourceData`,
      sourceUrlKey: `${prefix}SourceUrl`,
      cropTransformKey: `${prefix}CropTransform`,
      transformKey: `${prefix}Transform`,
      cropToFrameKey: `${prefix}CropToFrame`,
      wasCroppedKey: `${prefix}WasCropped`
    };
  }

  getModeDescriptionFont(card, mode = this.workspaceMode) {
    const isLeaflet = String(mode || '').toLowerCase() === 'leaflet';
    return (isLeaflet ? card?.leafletDescriptionFont : card?.descriptionFont) || this.defaultDescriptionFont;
  }

  getModeDescriptionColor(card, mode = this.workspaceMode) {
    const isLeaflet = String(mode || '').toLowerCase() === 'leaflet';
    return this.normalizeDescriptionColor(
      isLeaflet ? card?.leafletDescriptionColor : card?.descriptionColor,
      this.defaultDescriptionColor
    );
  }

  getModeArtSource(card, mode = this.workspaceMode) {
    const context = this.getArtContext(mode);
    return card?.[context.dataKey] || card?.[context.urlKey] || '';
  }

  getModeArtTransform(card, mode = this.workspaceMode) {
    const context = this.getArtContext(mode);
    const transform = card?.[context.transformKey];
    return transform && typeof transform === 'object'
      ? transform
      : { x: 0, y: 0, scale: 1 };
  }

  isBoardAbilityCreatorActive() {
    return this.workspaceMode === 'board' && this.boardCreatorMode === 'ability';
  }

  isCardPreviewGuidesActive() {
    return this.workspaceMode === 'card' || this.isBoardAbilityCreatorActive();
  }

  getGuideTargetElement(target, id = null) {
    if (target === 'title') {
      const layers = this.getTitleLayerElements();
      return layers.find((layer) => !id || layer.dataset.titleId === id) || null;
    }
    if (target === 'description') {
      const layers = this.getDescriptionLayerElements();
      return layers.find((layer) => !id || layer.dataset.descriptionId === id) || null;
    }
    return null;
  }

  setCardDragGuideLine(orientation, value, colorClass) {
    if (!this.cardDragGuideLayer || !Number.isFinite(value)) return;
    const line = document.createElement('div');
    line.className = `card-drag-guide card-drag-guide--${orientation} ${colorClass}`;
    if (orientation === 'vertical') {
      line.style.left = `${value}px`;
    } else {
      line.style.top = `${value}px`;
    }
    this.cardDragGuideLayer.appendChild(line);
  }

  isNearCardRenderCenter(positions = [], center = 0) {
    const threshold = 12;
    return (Array.isArray(positions) ? positions : []).some((position) => (
      Number.isFinite(position) && Math.abs(position - center) <= threshold
    ));
  }

  addNearbyCardRenderGuides(axis, positions = [], size = 0) {
    const safeSize = Number(size);
    if (!Number.isFinite(safeSize) || safeSize <= 0) return;
    const orientation = axis === 'x' ? 'vertical' : 'horizontal';
    [0.25, 0.5, 0.75].forEach((ratio) => {
      const value = safeSize * ratio;
      if (this.isNearCardRenderCenter(positions, value)) {
        this.setCardDragGuideLine(orientation, value, 'card-drag-guide--render-center');
      }
    });
  }

  showCardDragGuides(target, id = null) {
    if (!this.cardDragGuideLayer || !this.previewElement) return;
    this.cardDragGuideLayer.replaceChildren();
    if (!this.isCardPreviewGuidesActive() || (target !== 'title' && target !== 'description')) {
      this.hideCardDragGuides();
      return;
    }

    const element = this.getGuideTargetElement(target, id);
    if (!element) {
      this.hideCardDragGuides();
      return;
    }
    const previewRect = this.previewElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    if (!previewRect.width || !previewRect.height || !elementRect.width || !elementRect.height) {
      this.hideCardDragGuides();
      return;
    }

    const left = elementRect.left - previewRect.left;
    const right = elementRect.right - previewRect.left;
    const centerX = left + elementRect.width / 2;
    const top = elementRect.top - previewRect.top;
    const bottom = elementRect.bottom - previewRect.top;
    const centerY = top + elementRect.height / 2;

    this.setCardDragGuideLine('vertical', left, 'card-drag-guide--edge');
    this.setCardDragGuideLine('vertical', centerX, 'card-drag-guide--center');
    this.setCardDragGuideLine('vertical', right, 'card-drag-guide--edge-alt');
    this.setCardDragGuideLine('horizontal', top, 'card-drag-guide--edge-alt');
    this.setCardDragGuideLine('horizontal', centerY, 'card-drag-guide--center');
    this.setCardDragGuideLine('horizontal', bottom, 'card-drag-guide--edge');
    this.addNearbyCardRenderGuides('x', [left, centerX, right], previewRect.width);
    this.addNearbyCardRenderGuides('y', [top, centerY, bottom], previewRect.height);
    this.cardDragGuideLayer.classList.add('is-visible');
  }

  showCardDragGuidesFromRect(rect = null) {
    if (!this.cardDragGuideLayer || !this.previewElement || !rect) return;
    const left = Number(rect.left);
    const top = Number(rect.top);
    const width = Number(rect.width);
    const height = Number(rect.height);
    if (![left, top, width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
      this.hideCardDragGuides();
      return;
    }
    const right = left + width;
    const bottom = top + height;
    const previewRect = this.previewElement.getBoundingClientRect();
    this.cardDragGuideLayer.replaceChildren();
    this.setCardDragGuideLine('vertical', left, 'card-drag-guide--edge');
    this.setCardDragGuideLine('vertical', left + width / 2, 'card-drag-guide--center');
    this.setCardDragGuideLine('vertical', right, 'card-drag-guide--edge-alt');
    this.setCardDragGuideLine('horizontal', top, 'card-drag-guide--edge-alt');
    this.setCardDragGuideLine('horizontal', top + height / 2, 'card-drag-guide--center');
    this.setCardDragGuideLine('horizontal', bottom, 'card-drag-guide--edge');
    this.addNearbyCardRenderGuides('x', [left, left + width / 2, right], previewRect.width);
    this.addNearbyCardRenderGuides('y', [top, top + height / 2, bottom], previewRect.height);
    this.cardDragGuideLayer.classList.add('is-visible');
  }

  hideCardDragGuides() {
    if (!this.cardDragGuideLayer) return;
    this.cardDragGuideLayer.classList.remove('is-visible');
    this.cardDragGuideLayer.replaceChildren();
  }

  buildArtUpdates(values = {}, mode = this.workspaceMode) {
    const context = this.getArtContext(mode);
    const map = {
      data: context.dataKey,
      url: context.urlKey,
      sourceData: context.sourceDataKey,
      sourceUrl: context.sourceUrlKey,
      cropTransform: context.cropTransformKey,
      transform: context.transformKey,
      cropToFrame: context.cropToFrameKey,
      wasCropped: context.wasCroppedKey
    };
    return Object.entries(values).reduce((updates, [key, value]) => {
      const target = map[key];
      if (target) updates[target] = value;
      return updates;
    }, {});
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

    if (nextMode !== 'board' && this.isBoardAbilityCard()) {
      gameState.updateProperties({
        cardType: 'Action Cards',
        cardSubType: 'Main Phase'
      });
      if (this.cardTypeSelect) this.cardTypeSelect.value = 'Action Cards';
      this.updateSubTypeLabel('Action Cards');
      this.updateSubTypeOptions('Action Cards', 'Main Phase', false);
      renderer.applyAssetsForCardType('Action Cards', 'Main Phase');
    }

    const showBoard = nextMode === 'board';
    const showBoardAbilityCreator = showBoard && this.boardCreatorMode === 'ability';
    const showBoardLayout = showBoard && !showBoardAbilityCreator;
    const showShared = nextMode === 'card' || nextMode === 'leaflet' || showBoardAbilityCreator;
    (this.workspacePanels.shared || []).forEach((panel) => {
      const panelName = panel.getAttribute('data-tool-panel') || '';
      const showPanel = panelName === 'card-settings'
        ? showShared
        : (nextMode === 'card' || nextMode === 'leaflet' || showBoardAbilityCreator);
      panel.classList.toggle('is-active', showPanel);
      panel.setAttribute('aria-hidden', showPanel ? 'false' : 'true');
    });
    const showLeaflet = nextMode === 'leaflet';
    (this.workspacePanels.leaflet || []).forEach((panel) => {
      panel.classList.toggle('is-active', showLeaflet);
      panel.setAttribute('aria-hidden', showLeaflet ? 'false' : 'true');
    });
    (this.workspacePanels.board || []).forEach((panel) => {
      const panelName = panel.getAttribute('data-tool-panel') || '';
      const showPanel = panelName === 'board-render' ? showBoardLayout : showBoard;
      panel.classList.toggle('is-active', showPanel);
      panel.setAttribute('aria-hidden', showPanel ? 'false' : 'true');
    });
    if (showBoard) {
      if (this.boardCreatorModeSelect) this.boardCreatorModeSelect.value = this.boardCreatorMode;
      this.syncBoardCreatorPanels();
      if (showBoardAbilityCreator) {
        this.activateBoardAbilityCreator();
      }
      this.setBoardPan(this.boardPan?.x || 0, this.boardPan?.y || 0, { persist: false });
      this.renderBoardAbilityPlacements();
    }

    // Leaflet mode reuses title/description controls but hides card-only fields.
    const hideForLeaflet = showLeaflet;
    const hideForBoardAbility = showBoardAbilityCreator;
    [
      this.cardTypeGroup,
      this.costBadgeGroup,
      this.cardIdSection,
      this.cardLayersSection,
      this.descriptionLineHeightGroup,
      this.descriptionLetterSpacingGroup,
      this.descriptionBaselineOffsetGroup
    ].forEach((el) => {
      if (!el) return;
      el.style.display = (hideForLeaflet || hideForBoardAbility) ? 'none' : '';
    });
    if (this.cardSubTypeGroup) {
      this.cardSubTypeGroup.style.display = hideForLeaflet ? 'none' : '';
    }
    if (this.abilityDiceSection) {
      this.abilityDiceSection.style.display = hideForLeaflet ? 'none' : '';
    }
    if (this.titleBoxControls) {
      this.titleBoxControls.style.display = hideForLeaflet ? 'none' : '';
      this.titleBoxControls.setAttribute('aria-hidden', hideForLeaflet ? 'true' : 'false');
    }

    if (this.artSectionTitle) {
      this.artSectionTitle.textContent = hideForLeaflet
        ? 'Leaflet Art'
        : (showBoardAbilityCreator ? 'Board Ability Art' : 'Card Art');
    }
    if (this.cardPropertiesSummary) {
      this.cardPropertiesSummary.textContent = hideForLeaflet
        ? 'Leaflet Properties'
        : (showBoardAbilityCreator ? 'Board Ability Creator' : 'Card Properties');
    }
    if (this.boardAbilityHeroCopyGroup) {
      this.boardAbilityHeroCopyGroup.hidden = !showBoardAbilityCreator;
      this.boardAbilityHeroCopyGroup.style.display = showBoardAbilityCreator ? '' : 'none';
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
    this.syncArtControls(gameState.getCard());
    const renderWorkspaceMode = showBoardAbilityCreator ? 'card' : nextMode;
    if (this.referenceManager && this.referenceSelect && previousMode !== nextMode) {
      this.applyWorkspaceReferenceDefault(renderWorkspaceMode, { force: true });
    }

    if (options.persist !== false && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.workspaceModeStorageKey, nextMode);
    }

    if (typeof renderer?.setWorkspaceMode === 'function') {
      try {
        renderer.setWorkspaceMode(renderWorkspaceMode);
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
      this.showToast(`Please select a valid ${safeLabel} file.`, { force: true, duration: 2600 });
      return false;
    }
    if (file.size > maxBytes) {
      const maxMb = Math.max(1, Math.round(maxBytes / (1024 * 1024)));
      this.showToast(`${title} file is too large. Maximum size is ${maxMb}MB.`, { force: true, duration: 3200 });
      return false;
    }
    return true;
  }

  getSubtypeOptionsForCardType(cardType = 'Action Cards') {
    const key = String(cardType || '').trim();
    const options = this.cardSubTypeOptions && this.cardSubTypeOptions[key];
    return Array.isArray(options) ? [...options] : [];
  }

  normalizeCardTypeAndSubtypeState(options = {}) {
    const card = gameState.getCard();
    const rawType = String(card?.cardType || '').trim();
    const validTypes = (this.cardSubTypeOptions ? Object.keys(this.cardSubTypeOptions) : [])
      .filter((type) => this.workspaceMode === 'board' || type !== 'Board Abilities');
    const fallbackType = validTypes.includes('Action Cards')
      ? 'Action Cards'
      : (validTypes[0] || rawType || 'Action Cards');
    const cardType = validTypes.includes(rawType) ? rawType : fallbackType;
    const subtypeOptions = this.getSubtypeOptionsForCardType(cardType);
    const rawSubType = String(card?.cardSubType || '').trim();
    const fallbackSubType = subtypeOptions[0] || '';
    const cardSubType = subtypeOptions.includes(rawSubType) ? rawSubType : fallbackSubType;

    const updates = {};
    if (cardType && cardType !== card.cardType) updates.cardType = cardType;
    if (cardSubType && cardSubType !== card.cardSubType) updates.cardSubType = cardSubType;
    if (!Object.keys(updates).length) return false;
    gameState.updateProperties(updates);
    if (options.notify) {
      this.showToast('Invalid card template detected. Restored a supported template.', { force: true, duration: 3000 });
    }
    return true;
  }

  ensureRenderableCardLayerState(options = {}) {
    const card = gameState.getCard();
    if (String(this.workspaceMode || '').toLowerCase() === 'leaflet') {
      const leaflet = card?.leafletLayers || {};
      const hasVisibleLeafletLayer = [
        leaflet.background !== false,
        leaflet.art !== false,
        leaflet.title !== false,
        leaflet.text !== false
      ].some(Boolean);
      if (hasVisibleLeafletLayer) return false;
      gameState.updateProperty('leafletLayers', {
        background: true,
        art: true,
        title: true,
        text: true
      });
      if (options.notify) {
        this.showToast('At least one leaflet layer must remain visible. Restored defaults.', { force: true, duration: 3000 });
      }
      return true;
    }
    if (String(this.workspaceMode || '').toLowerCase() === 'board') {
      return false;
    }

    const layers = card?.layers && typeof card.layers === 'object' ? card.layers : {};
    const panelUpperVisible = layers.panelUpper ?? layers.titleBar;
    const panelLowerVisible = layers.panelLower ?? layers.bottomText;
    const hasVisibleLayer = [
      layers.backgroundLower !== false,
      layers.backgroundUpper !== false,
      layers.artwork !== false,
      layers.imageFrame !== false,
      layers.frameShading !== false,
      layers.border !== false,
      layers.cardId !== false,
      layers.panelBleed !== false,
      panelLowerVisible !== false,
      layers.secondAbilityFrame !== false,
      panelUpperVisible !== false,
      layers.topNameGradient !== false,
      layers.bottomNameGradient !== false,
      layers.costBadge !== false,
      (card?.cardSubType === 'Roll Phase' && layers.attackModifier !== false),
      layers.titleText !== false,
      layers.cardText !== false
    ].some(Boolean);

    if (hasVisibleLayer) return false;

    const updates = {
      'layers.backgroundLower': true,
      'layers.border': true,
      'layers.panelUpper': true,
      'layers.panelLower': true,
      'layers.titleText': true,
      'layers.cardText': true
    };
    if (layers.titleBar !== undefined) updates['layers.titleBar'] = true;
    if (layers.bottomText !== undefined) updates['layers.bottomText'] = true;
    gameState.updateProperties(updates);
    if (options.notify) {
      this.showToast('At least one card layer must remain visible. Restored base layers.', { force: true, duration: 3000 });
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

  filterSelectOptions(select, query = '', options = {}) {
    if (!select) return;
    const normalizedQuery = String(query || '').trim().toLowerCase();
    const keepValues = new Set(
      (Array.isArray(options.keepValues) ? options.keepValues : [])
        .map((value) => String(value || ''))
    );
    const alwaysVisibleFirst = options.alwaysVisibleFirst !== false;
    const optionNodes = Array.from(select.options || []);
    optionNodes.forEach((option, index) => {
      const text = String(option.textContent || '').toLowerCase();
      const value = String(option.value || '');
      const keep = keepValues.has(value);
      const visibleByIndex = alwaysVisibleFirst && index === 0;
      const visibleByQuery = !normalizedQuery || text.includes(normalizedQuery);
      option.hidden = !(keep || visibleByIndex || visibleByQuery);
    });
  }

  parseBatchDeckNames(rawText) {
    const lines = String(rawText || '')
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter(Boolean);
    const names = [];

    const pushName = (name, count = 1) => {
      const safeName = String(name || '').trim();
      if (!safeName) return;
      const safeCount = Math.max(1, Math.min(100, Number(count) || 1));
      for (let i = 0; i < safeCount; i += 1) {
        names.push(safeName);
      }
    };

    lines.forEach((line) => {
      const countPrefix = line.match(/^(\d+)\s*[xX]\s+(.+)$/);
      if (countPrefix) {
        pushName(countPrefix[2], Number(countPrefix[1]));
        return;
      }
      const countSuffix = line.match(/^(.+?)\s*[xX]\s*(\d+)$/);
      if (countSuffix) {
        pushName(countSuffix[1], Number(countSuffix[2]));
        return;
      }
      pushName(line, 1);
    });

    return names;
  }

  buildUniqueDeckCardName(existingCards, baseName) {
    const safeBase = String(baseName || 'Untitled').trim() || 'Untitled';
    const existing = new Set(
      (Array.isArray(existingCards) ? existingCards : [])
        .map((entry) => String(entry?.name || '').trim().toLowerCase())
        .filter(Boolean)
    );
    if (!existing.has(safeBase.toLowerCase())) return safeBase;
    let copyIndex = 2;
    while (copyIndex <= 9999) {
      const candidate = `${safeBase} (${copyIndex})`;
      if (!existing.has(candidate.toLowerCase())) return candidate;
      copyIndex += 1;
    }
    return `${safeBase} (${Date.now()})`;
  }

  buildShareCardPayload() {
    try {
      const json = gameState.toJSON();
      return btoa(unescape(encodeURIComponent(json)));
    } catch (error) {
      console.warn('Failed to build share payload:', error);
      return '';
    }
  }

  decodeShareCardPayload(payload) {
    try {
      const raw = decodeURIComponent(escape(atob(String(payload || ''))));
      return raw;
    } catch (error) {
      console.warn('Failed to decode share payload:', error);
      return '';
    }
  }

  async shareCardLink() {
    this.closeActionsMenu();
    const payload = this.buildShareCardPayload();
    if (!payload) {
      this.showToast('Unable to generate share link right now.', { force: true });
      return;
    }

    const url = new URL(window.location.href);
    url.hash = `card=${encodeURIComponent(payload)}`;
    const shareUrl = url.toString();
    if (shareUrl.length > 7900) {
      this.showToast('This card is too large for URL sharing. Save/export JSON instead.', { force: true, duration: 3200 });
      return;
    }

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(shareUrl);
        this.showToast('Share link copied to clipboard.', { force: true });
        return;
      }
    } catch (error) {
      console.warn('Clipboard copy failed:', error);
    }

    this.openShareLinkModal(shareUrl);
  }

  tryLoadCardFromUrlHash(options = {}) {
    if (typeof window === 'undefined') return false;
    const hash = String(window.location.hash || '').trim();
    if (!hash) return false;

    const normalized = hash.startsWith('#') ? hash.slice(1) : hash;
    let encodedPayload = '';
    if (normalized.startsWith('card=')) {
      encodedPayload = normalized.slice('card='.length);
    } else {
      const params = new URLSearchParams(normalized);
      encodedPayload = params.get('card') || '';
    }
    if (!encodedPayload) return false;

    const payload = decodeURIComponent(encodedPayload);
    const json = this.decodeShareCardPayload(payload);
    if (!json) return false;
    const loaded = gameState.fromJSON(json);
    if (!loaded) return false;

    this.updateUI();
    if (options.clearHash === true) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    return true;
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

    if (this.infoBannerDismissBtn) {
      this.infoBannerDismissBtn.addEventListener('click', () => this.dismissInfoBanner());
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
        const context = this.getTitleContext();
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
          [context.blocksKey]: updatedBlocks,
          [context.activeIdKey]: activeId,
          [context.nameKey]: rawTitle,
          [context.positionKey]: activeBlock ? activeBlock.position : (card[context.positionKey] || context.defaultPosition)
        });
        this.activeTitleId = activeId;
        this.queueRendererWork('title');
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
        this.queueRendererWork('full');
      });
    }

    if (this.leafletLayerBackground) {
      this.leafletLayerBackground.addEventListener('change', (e) => {
        gameState.updateProperty('leafletLayers.background', !!e.target.checked);
        this.queueRendererWork('full');
      });
    }
    if (this.leafletLayerTitle) {
      this.leafletLayerTitle.addEventListener('change', (e) => {
        gameState.updateProperty('leafletLayers.title', !!e.target.checked);
        this.queueRendererWork('full');
      });
    }
    if (this.leafletLayerArt) {
      this.leafletLayerArt.addEventListener('change', (e) => {
        gameState.updateProperty('leafletLayers.art', !!e.target.checked);
        this.queueRendererWork('full');
      });
    }
    if (this.leafletLayerText) {
      this.leafletLayerText.addEventListener('change', (e) => {
        gameState.updateProperty('leafletLayers.text', !!e.target.checked);
        this.queueRendererWork('full');
      });
    }
    if (this.boardLayerWorkingArea) {
      this.boardLayerWorkingArea.addEventListener('change', (e) => {
        this.applyBoardLayerVisibility({
          ...this.boardLayerVisibility,
          workingArea: !!e.target.checked
        });
      });
    }
    if (this.boardLayerAbilityPadding) {
      this.boardLayerAbilityPadding.addEventListener('change', (e) => {
        this.applyBoardLayerVisibility({
          ...this.boardLayerVisibility,
          abilityPadding: !!e.target.checked
        });
      });
    }
    if (this.boardLayerAbilityBoundary) {
      this.boardLayerAbilityBoundary.addEventListener('change', (e) => {
        this.applyBoardLayerVisibility({
          ...this.boardLayerVisibility,
          abilityBoundary: !!e.target.checked
        });
      });
    }
    if (this.boardCreatorModeSelect) {
      this.boardCreatorModeSelect.addEventListener('change', (e) => {
        this.setBoardCreatorMode(e.target.value || 'board');
      });
    }
    this.boardSlotSelects.forEach((selectEl) => {
      if (!selectEl) return;
      selectEl.addEventListener('change', () => {
        this.saveBoardSlotAssignments(this.boardSlotSelects.map((node) => (node ? node.value : '')));
        this.renderBoardSlotAssignments();
      });
    });
    if (this.boardAddCurrentAbilityBtn) {
      this.boardAddCurrentAbilityBtn.addEventListener('click', () => {
        this.addCurrentBoardAbilityToBoard();
      });
    }
    if (this.boardPlacementAddBtn) {
      this.boardPlacementAddBtn.addEventListener('click', () => {
        const abilityId = String(this.boardPlacementSelect?.value || '').trim();
        this.addBoardAbilityPlacement(abilityId);
      });
    }
    if (this.boardAbilityCopyHeroBtn) {
      this.boardAbilityCopyHeroBtn.addEventListener('click', () => this.copyBoardAbilityToHeroCard());
    }

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
        this.queueRendererWork('full');
      });
      this.defaultDiceColorPicker.addEventListener('change', (e) => {
        const color = this.syncDefaultDiceColorControls(e.target.value);
        gameState.updateProperty('defaultDiceColor', color);
        this.queueRendererWork('full');
      });
    }
    if (this.defaultDiceColorInput) {
      const applyDefaultDiceColorFromHexInput = () => {
        const color = this.normalizeDiceColor(this.defaultDiceColorInput.value, this.defaultDiceColor);
        this.syncDefaultDiceColorControls(color);
        gameState.updateProperty('defaultDiceColor', color);
        this.queueRendererWork('full');
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
        this.queueRendererWork('cardId');
      });
    }

    if (this.cardIdFontSizeInput) {
      this.cardIdFontSizeInput.addEventListener('input', (e) => {
        const size = this.clampCardIdFontSize(e.target.value);
        e.target.value = size;
        if (this.cardIdFontSizeValue) this.cardIdFontSizeValue.textContent = size;
        gameState.updateProperty('cardIdFontSize', size);
        this.queueRendererWork('cardId');
      });
    }

    if (this.cardIdPositionXInput) {
      this.cardIdPositionXInput.addEventListener('input', (e) => {
        const offset = this.clampCardIdOffset(e.target.value);
        e.target.value = offset;
        if (this.cardIdPositionXValue) this.cardIdPositionXValue.textContent = offset.toFixed(1);
        gameState.updateProperty('cardIdOffsetX', offset);
        this.queueRendererWork('cardId');
      });
    }

    if (this.cardIdPositionYInput) {
      this.cardIdPositionYInput.addEventListener('input', (e) => {
        const offset = this.clampCardIdOffset(e.target.value);
        e.target.value = offset;
        if (this.cardIdPositionYValue) this.cardIdPositionYValue.textContent = offset.toFixed(1);
        gameState.updateProperty('cardIdOffset', offset);
        this.queueRendererWork('cardId');
      });
    }

    if (this.titleFontSelect) {
      this.titleFontSelect.addEventListener('change', (e) => {
        gameState.updateProperty(this.getTitleContext().fontKey, e.target.value || this.defaultTitleFont);
        this.queueRendererWork('title');
      });
    }

    if (this.titleFontSizeInput) {
      this.titleFontSizeInput.addEventListener('change', (e) => {
        const value = Number(e.target.value);
        const size = Number.isFinite(value) ? Math.max(8, Math.min(96, value)) : this.defaultTitleFontSize;
        e.target.value = size;
        gameState.updateProperty(this.getTitleContext().fontSizeKey, size);
        this.queueRendererWork('title');
      });
    }

    if (this.titleLetterSpacingInput) {
      this.titleLetterSpacingInput.addEventListener('input', (e) => {
        const spacing = this.clampLetterSpacing(e.target.value);
        e.target.value = spacing;
        if (this.titleLetterSpacingValue) this.titleLetterSpacingValue.textContent = spacing;
        gameState.updateProperty(this.getTitleContext().letterSpacingKey, spacing);
        this.queueRendererWork('title');
      });
    }

    if (this.descriptionFontSelect) {
      this.descriptionFontSelect.addEventListener('change', (e) => {
        const font = e.target.value || this.defaultDescriptionFont;
        const key = this.getDescriptionContext().isLeaflet ? 'leafletDescriptionFont' : 'descriptionFont';
        gameState.updateProperty(key, font);
        this.applyFontToDescriptionSelection(font);
        this.updateDescriptionStateFromEditor(true);
        this.queueRendererWork('cardId');
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
        this.queueRendererWork('description');
        this.updateStatusEffectsIconSize();
      });
    }

    if (this.descriptionLineHeightInput) {
      this.descriptionLineHeightInput.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        const spacing = this.clampLineHeightScale(value);
        e.target.value = spacing;
        if (this.descriptionLineHeightValue) this.descriptionLineHeightValue.textContent = spacing.toFixed(2);
        const key = this.getDescriptionContext().isLeaflet ? 'leafletDescriptionLineHeightScale' : 'descriptionLineHeightScale';
        gameState.updateProperty(key, spacing);
        this.queueRendererWork('description');
      });
    }

    if (this.descriptionLetterSpacingInput) {
      this.descriptionLetterSpacingInput.addEventListener('input', (e) => {
        const spacing = this.clampLetterSpacing(e.target.value);
        e.target.value = spacing;
        if (this.descriptionLetterSpacingValue) this.descriptionLetterSpacingValue.textContent = spacing;
        const key = this.getDescriptionContext().isLeaflet ? 'leafletDescriptionLetterSpacing' : 'descriptionLetterSpacing';
        gameState.updateProperty(key, spacing);
        this.queueRendererWork('description');
      });
    }

    if (this.descriptionBaselineOffsetInput) {
      this.descriptionBaselineOffsetInput.addEventListener('input', (e) => {
        const value = Number(e.target.value);
        const offset = Number.isFinite(value) ? Math.max(-5, Math.min(5, value)) : this.defaultDescriptionBaselineOffset;
        e.target.value = offset;
        if (this.descriptionBaselineOffsetValue) this.descriptionBaselineOffsetValue.textContent = offset.toFixed(1);
        const key = this.getDescriptionContext().isLeaflet ? 'leafletDescriptionBaselineOffset' : 'descriptionBaselineOffset';
        gameState.updateProperty(key, offset);
        this.queueRendererWork('description');
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
        this.queueRendererWork('description');
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
      this.queueRendererWork('cardId');
    });

    this.cardSubTypeSelect.addEventListener('change', (e) => {
      gameState.updateProperty('cardSubType', e.target.value);
      renderer.applyAssetsForCardType(this.cardTypeSelect.value, e.target.value);
      this.applyLayerPresetForCard(this.cardTypeSelect.value, e.target.value);
      this.queueRendererWork('cardId');
    });

    if (this.costInput) {
      this.costInput.addEventListener('input', (e) => {
        const value = String(e.target.value || '').trim();
        gameState.updateProperty('costBadge.value', value);
        this.queueRendererWork('costBadge');
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
    if (this.btnActions) {
      this.btnActions.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleActionsMenu();
      });
    }
    if (this.btnResetCanvas) {
      this.btnResetCanvas.addEventListener('click', () => this.resetCanvas());
    }
    if (this.btnQuickStart) {
      this.btnQuickStart.addEventListener('click', () => this.openModal('quickStartModal'));
    }
    if (this.btnHowTo) {
      this.btnHowTo.addEventListener('click', () => this.openModal('helpModal'));
    }
    if (this.btnWhatsNew) {
      this.btnWhatsNew.addEventListener('click', () => this.openModal('changelogModal'));
    }
    if (this.btnAppSettings) {
      this.btnAppSettings.addEventListener('click', () => this.openModal('settingsModal'));
    }
    if (this.btnMobileNew) {
      this.btnMobileNew.addEventListener('click', () => this.newCard());
    }
    if (this.btnMobileExport) {
      this.btnMobileExport.addEventListener('click', () => this.toggleExportMenu());
    }
    if (this.btnMobilePrint) {
      this.btnMobilePrint.addEventListener('click', () => this.openPrintSheet());
    }
    if (this.btnMobileHelp) {
      this.btnMobileHelp.addEventListener('click', () => this.openModal('helpModal'));
    }
    if (this.quickStartNewCardBtn) {
      this.quickStartNewCardBtn.addEventListener('click', () => {
        this.closeModal('quickStartModal');
        this.newCard();
      });
    }
    if (this.quickStartLoadJsonBtn) {
      this.quickStartLoadJsonBtn.addEventListener('click', () => {
        this.closeModal('quickStartModal');
        this.loadCard();
      });
    }
    if (this.quickStartHowToBtn) {
      this.quickStartHowToBtn.addEventListener('click', () => {
        this.closeModal('quickStartModal');
        this.openModal('helpModal');
      });
    }
    if (this.showProcessingToasts) {
      this.showProcessingToasts.addEventListener('change', (e) => {
        this.showToasts = !!e.target.checked;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.showToastsKey, String(this.showToasts));
        }
      });
    }
    if (this.saveDefaultsBtn) {
      this.saveDefaultsBtn.addEventListener('click', () => this.saveCurrentAsDefaults());
    }
    if (this.resetToDefaultsBtn) {
      this.resetToDefaultsBtn.addEventListener('click', () => this.resetToSavedDefaults());
    }
    if (this.restoreFactoryDefaultsBtn) {
      this.restoreFactoryDefaultsBtn.addEventListener('click', () => this.restoreFactoryDefaults());
    }
    if (this.resetAppDataBtn) {
      this.resetAppDataBtn.addEventListener('click', () => this.resetAppData());
    }
    if (this.modalOpenButtons.length) {
      this.modalOpenButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const modalId = String(button.getAttribute('data-open-modal') || '').trim();
          if (!modalId) return;
          this.openModal(modalId);
        });
      });
    }
    if (this.modalCloseButtons.length) {
      this.modalCloseButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const modalId = String(button.getAttribute('data-close-modal') || '').trim();
          if (!modalId) return;
          this.closeModal(modalId);
        });
      });
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
      this.setBoardPan(this.boardPan?.x || 0, this.boardPan?.y || 0, { persist: false });
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

    if (this.btnShareLink) {
      this.btnShareLink.addEventListener('click', () => this.shareCardLink());
    }
    if (this.shareLinkCopyBtn) {
      this.shareLinkCopyBtn.addEventListener('click', async () => this.copyShareLinkFromModal());
    }

    if (this.previewZoomInput) {
      this.previewZoomInput.addEventListener('input', (e) => {
        this.setPreviewZoom(e?.target?.value, {
          persist: false,
          rerender: false,
          scheduleRerender: true,
          renderDebounceMs: 90
        });
      });
      this.previewZoomInput.addEventListener('change', (e) => {
        this.setPreviewZoom(e?.target?.value, { persist: true, rerender: true });
      });
    }

    if (this.artSearchInput) {
      this.artSearchInput.addEventListener('input', (e) => {
        this.filterSelectOptions(this.artSelect, e?.target?.value || '', { keepValues: [''] });
      });
    }

    if (this.referenceSearchInput) {
      this.referenceSearchInput.addEventListener('input', (e) => {
        this.filterSelectOptions(this.referenceSelect, e?.target?.value || '', {
          keepValues: ['', '__upload__']
        });
      });
    }

    document.addEventListener('click', (e) => {
      if (this.exportMenu && this.exportMenuPanel && !this.exportMenu.contains(e.target)) {
        this.closeExportMenu();
      }
      if (this.actionsMenu && this.actionsMenuPanel && !this.actionsMenu.contains(e.target)) {
        this.closeActionsMenu();
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
    if (this.deckDuplicateCardBtn) {
      this.deckDuplicateCardBtn.addEventListener('click', () => this.duplicateCardInDeck());
    }
    if (this.deckBatchImportBtn) {
      this.deckBatchImportBtn.addEventListener('click', () => this.openDeckBatchImportModal());
    }
    if (this.deckBatchImportConfirmBtn) {
      this.deckBatchImportConfirmBtn.addEventListener('click', () => this.submitDeckBatchImport());
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
        this.updateDeckSaveAvailability(gameState.getCard());
        this.scheduleRenderWarmup({ immediate: true });
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
          this.applyCropMask(this.getSelectedCropMaskPath(), null, false);
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

    const refreshLayerVisibilityAfterToggle = () => {
      const repaired = this.ensureRenderableCardLayerState({ notify: true });
      const currentCard = gameState.getCard();
      renderer.updateVisibility(currentCard);
      if (repaired) {
        this.updateUI();
      }
    };

    // Layer toggles for individual card elements
    if (this.toggleCardBleed) {
      this.toggleCardBleed.addEventListener('change', (e) => {
        gameState.updateProperty('layers.cardBleed', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleBackgroundLower) {
      this.toggleBackgroundLower.addEventListener('change', (e) => {
        gameState.updateProperty('layers.backgroundLower', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleBackgroundUpper) {
      this.toggleBackgroundUpper.addEventListener('change', (e) => {
        gameState.updateProperty('layers.backgroundUpper', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleImageFrame) {
      this.toggleImageFrame.addEventListener('change', (e) => {
        gameState.updateProperty('layers.imageFrame', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleFrameShading) {
      this.toggleFrameShading.addEventListener('change', (e) => {
        gameState.updateProperty('layers.frameShading', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleBorder) {
      this.toggleBorder.addEventListener('change', (e) => {
        gameState.updateProperty('layers.border', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleCardId) {
      this.toggleCardId.addEventListener('change', (e) => {
        gameState.updateProperty('layers.cardId', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleTitleBar) {
      this.toggleTitleBar.addEventListener('change', (e) => {
        gameState.updateProperty('layers.titleBar', e.target.checked);
        gameState.updateProperty('layers.panelUpper', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleTitleText) {
      this.toggleTitleText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.titleText', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }


    if (this.toggleArtwork) {
      this.toggleArtwork.addEventListener('change', (e) => {
        gameState.updateProperty('layers.artwork', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.togglePanelBleed) {
      this.togglePanelBleed.addEventListener('change', (e) => {
        gameState.updateProperty('layers.panelBleed', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleBottomText) {
      this.toggleBottomText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.bottomText', e.target.checked);
        gameState.updateProperty('layers.panelLower', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleSecondAbilityFrame) {
      this.toggleSecondAbilityFrame.addEventListener('change', (e) => {
        gameState.updateProperty('layers.secondAbilityFrame', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleTopNameGradient) {
      this.toggleTopNameGradient.addEventListener('change', (e) => {
        gameState.updateProperty('layers.topNameGradient', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleBottomNameGradient) {
      this.toggleBottomNameGradient.addEventListener('change', (e) => {
        gameState.updateProperty('layers.bottomNameGradient', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleCostBadge) {
      this.toggleCostBadge.addEventListener('change', (e) => {
        gameState.updateProperty('layers.costBadge', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleAttackModifier) {
      this.toggleAttackModifier.addEventListener('change', (e) => {
        gameState.updateProperty('layers.attackModifier', e.target.checked);
        refreshLayerVisibilityAfterToggle();
      });
    }

    if (this.toggleCardText) {
      this.toggleCardText.addEventListener('change', (e) => {
        gameState.updateProperty('layers.cardText', e.target.checked);
        refreshLayerVisibilityAfterToggle();
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
      let dragGuideRect = null;
      let dragScale = 1;
      let dragUsesStateTransaction = false;

      const getRelativePreviewRect = (el) => {
        if (!el || !this.previewElement) return null;
        const previewRect = this.previewElement.getBoundingClientRect();
        const targetRect = el.getBoundingClientRect();
        if (!targetRect.width || !targetRect.height) return null;
        return {
          left: targetRect.left - previewRect.left,
          top: targetRect.top - previewRect.top,
          width: targetRect.width,
          height: targetRect.height
        };
      };

      const beginDragGuides = (target, id) => {
        dragGuideRect = null;
        if (!this.isCardPreviewGuidesActive()) return;
        const element = this.getGuideTargetElement(target, id);
        dragGuideRect = getRelativePreviewRect(element);
        if (dragGuideRect) {
          this.showCardDragGuidesFromRect(dragGuideRect);
        }
      };

      const updateDragGuides = (dx, dy) => {
        if (!dragGuideRect) return;
        this.showCardDragGuidesFromRect({
          ...dragGuideRect,
          left: dragGuideRect.left + dx,
          top: dragGuideRect.top + dy
        });
      };

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
          this.queueRendererWork('description');
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
          this.queueRendererWork('title');
        } else if (activeTarget === 'costBadge') {
          gameState.updateProperty('costBadgePosition', { x: newX, y: newY });
          this.queueRendererWork('costBadgePosition');
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
        if (activeTarget === 'description' || activeTarget === 'title') {
          updateDragGuides(dx, dy);
        }
      };

      const onUp = () => {
        if (!isDragging) return;
        if (activeTarget === 'leafletBreak' && activeLeafletBreakIndex !== null && pendingLeafletBreakPosition) {
          this.setLeafletBreakPosition(activeLeafletBreakIndex, pendingLeafletBreakPosition);
        }
        if (dragUsesStateTransaction && typeof gameState.commitTransaction === 'function') {
          gameState.commitTransaction();
        }
        isDragging = false;
        dragUsesStateTransaction = false;
        activeTitleDragId = null;
        activeDescriptionDragId = null;
        activeLeafletBreakIndex = null;
        pendingLeafletBreakPosition = null;
        dragBounds = null;
        dragGuideRect = null;
        this.hideCardDragGuides();
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
        if (typeof gameState.beginTransaction === 'function') {
          gameState.beginTransaction();
          dragUsesStateTransaction = true;
        }
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
        if (typeof gameState.beginTransaction === 'function') {
          gameState.beginTransaction();
          dragUsesStateTransaction = true;
        }
        dragScale = this.getPreviewScale();
        startX = e.clientX;
        startY = e.clientY;
        const current = block.position || { x: 0, y: 0 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        beginDragGuides('title', titleId);
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
        if (typeof gameState.beginTransaction === 'function') {
          gameState.beginTransaction();
          dragUsesStateTransaction = true;
        }
        dragScale = this.getPreviewScale();
        startX = e.clientX;
        startY = e.clientY;
        const current = block.position || { x: 0, y: 0 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        beginDragGuides('description', descriptionId);
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
          this.hideCardDragGuides();
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
      let altDragUsesStateTransaction = false;

      const onAltMove = (e) => {
        if (!isAltDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newX = startPos.x + dx;
        const newY = startPos.y + dy;
        const context = this.getArtContext();
        const currentCard = gameState.getCard();
        gameState.updateProperty(context.transformKey, {
          ...(currentCard[context.transformKey] || { x: 0, y: 0, scale: 1 }),
          x: newX,
          y: newY
        });
        this.queueRendererWork('artTransform');
      };

      const onAltUp = () => {
        if (!isAltDragging) return;
        if (altDragUsesStateTransaction && typeof gameState.commitTransaction === 'function') {
          gameState.commitTransaction();
        }
        isAltDragging = false;
        altDragUsesStateTransaction = false;
        window.removeEventListener('mousemove', onAltMove);
        window.removeEventListener('mouseup', onAltUp);
      };

      this.previewElement.addEventListener('mousedown', (e) => {
        if (!e.altKey) return;
        const card = gameState.getCard();
        const context = this.getArtContext();
        if (!(card?.[context.dataKey] || card?.[context.urlKey])) return;
        isAltDragging = true;
        if (typeof gameState.beginTransaction === 'function') {
          gameState.beginTransaction();
          altDragUsesStateTransaction = true;
        }
        startX = e.clientX;
        startY = e.clientY;
        const current = gameState.getCard()[context.transformKey] || { x: 0, y: 0, scale: 1 };
        startPos = { x: current.x || 0, y: current.y || 0 };
        window.addEventListener('mousemove', onAltMove);
        window.addEventListener('mouseup', onAltUp);
      });

      this.previewElement.addEventListener('wheel', (e) => {
        const isZoomGesture = e.ctrlKey || e.metaKey;
        if (isZoomGesture) return;

        if (e.altKey) {
          const card = gameState.getCard();
          const context = this.getArtContext();
          if (!(card?.[context.dataKey] || card?.[context.urlKey])) return;
          e.preventDefault();
          const current = gameState.getCard()[context.transformKey] || { x: 0, y: 0, scale: 1 };
          const delta = e.deltaY > 0 ? -0.05 : 0.05;
          const nextScale = Math.max(0.5, Math.min(3, (current.scale || 1) + delta));
          gameState.updateProperty(context.transformKey, {
            ...current,
            scale: nextScale
          });
          this.queueRendererWork('artTransform');
          return;
        }

        // Wheel over renderer surface controls preview zoom.
        const isRendererMode = this.workspaceMode === 'card' || this.workspaceMode === 'leaflet' || this.workspaceMode === 'board';
        if (!isRendererMode) return;
        e.preventDefault();

        const rawDelta = Number(e.deltaY) || 0;
        if (!rawDelta) return;
        const deltaInPixels = e.deltaMode === 1
          ? rawDelta * 16
          : e.deltaMode === 2
            ? rawDelta * 160
            : rawDelta;
        const direction = deltaInPixels > 0 ? -1 : 1;
        const intensity = Math.max(0.5, Math.min(2.5, Math.abs(deltaInPixels) / 100));
        const step = 0.04 * intensity;
        const nextZoom = (Number(this.previewZoom) || 1) + (direction * step);
        this.setPreviewZoom(nextZoom, {
          persist: false,
          rerender: false,
          scheduleRerender: true,
          renderDebounceMs: 90
        });
        this.schedulePreviewZoomPersist();
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
      if (e.key === 'Escape') {
        this.closeExportMenu();
        this.closeActionsMenu();
        const openModalId = this.getOpenSiteModalId();
        if (openModalId) {
          this.closeModal(openModalId);
          e.preventDefault();
          return;
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

  async newCard() {
    this.closeActionsMenu();
    const shouldCreate = await this.confirmAction({
      title: 'Create New Card',
      message: 'Create a new card? This will clear the current card.',
      confirmLabel: 'Create Card',
      cancelLabel: 'Keep Editing'
    });
    if (!shouldCreate) return;

    const loadedDefaults = this.applySavedDefaultsToState({ silent: true });
    if (!loadedDefaults) {
      gameState.reset();
    }
    this.applyDefaultCardIdFromDeck(true);
    this.updateUI();
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast(loadedDefaults ? 'New card created from your defaults.' : 'New card created.', { force: true });
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
    this.closeActionsMenu();
    this.showToast('Card JSON downloaded.', { force: true });
  }

  loadCard() {
    this.closeActionsMenu();
    this.openFilePicker(this.fileInput);
  }

  exportCard(type = 'png') {
    if (type === 'json') {
      this.saveCard();
      return;
    }
    const match = String(type || '').match(/^png-(\d+)$/i);
    const dpi = match ? Number(match[1]) : 300;
    renderer.exportAsImage({ dpi });
  }

  supportsRenderWorker() {
    return typeof Worker !== 'undefined'
      && typeof OffscreenCanvas !== 'undefined'
      && typeof createImageBitmap !== 'undefined'
      && !this.renderWorkerUnavailable;
  }

  getRenderWorker() {
    if (!this.supportsRenderWorker()) return null;
    if (this.renderWorker) return this.renderWorker;
    try {
      this.renderWorker = new Worker('js/renderWorker.js');
      this.renderWorker.addEventListener('message', (event) => this.handleRenderWorkerMessage(event));
      this.renderWorker.addEventListener('error', (event) => {
        console.warn('Render worker failed:', event.message || event);
        this.renderWorkerUnavailable = true;
        this.rejectRenderWorkerRequests(new Error('Render worker failed'));
        this.closeRenderWorker();
      });
      return this.renderWorker;
    } catch (error) {
      console.warn('Could not start render worker:', error);
      this.renderWorkerUnavailable = true;
      return null;
    }
  }

  closeRenderWorker() {
    if (!this.renderWorker) return;
    try {
      this.renderWorker.terminate();
    } catch (error) {
      // Ignore worker shutdown errors.
    }
    this.renderWorker = null;
  }

  handleRenderWorkerMessage(event) {
    const message = event.data || {};
    const request = this.renderWorkerRequests.get(message.id);
    if (!request) return;
    this.renderWorkerRequests.delete(message.id);
    if (message.ok) {
      request.resolve(message);
    } else {
      request.reject(new Error(message.error || 'Render worker request failed'));
    }
  }

  rejectRenderWorkerRequests(error) {
    for (const request of this.renderWorkerRequests.values()) {
      request.reject(error);
    }
    this.renderWorkerRequests.clear();
  }

  runRenderWorker(type, payload, transfer = []) {
    const worker = this.getRenderWorker();
    if (!worker) return Promise.reject(new Error('Render worker is unavailable'));
    const id = ++this.renderWorkerRequestId;
    return new Promise((resolve, reject) => {
      this.renderWorkerRequests.set(id, { resolve, reject });
      try {
        worker.postMessage({ id, type, payload }, transfer);
      } catch (error) {
        this.renderWorkerRequests.delete(id);
        reject(error);
      }
    });
  }

  absoluteAssetUrl(path) {
    const raw = String(path || '').trim();
    if (!raw) return '';
    try {
      return new URL(raw, document.baseURI).href;
    } catch (error) {
      return raw;
    }
  }

  async downloadBlob(blob, filename) {
    if (!blob) return false;
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = String(filename || 'export.png');
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    return true;
  }

  blobToDataUrl(blob) {
    if (!blob) return Promise.resolve('');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
  }

  async getImageBlobSize(blob) {
    if (!blob || typeof createImageBitmap !== 'function') return null;
    const bitmap = await createImageBitmap(blob);
    try {
      return { width: bitmap.width, height: bitmap.height };
    } finally {
      if (typeof bitmap.close === 'function') bitmap.close();
    }
  }

  buildDeckViewFilename() {
    const deck = this.getSelectedDeck();
    const name = deck?.name ? String(deck.name) : 'deck-view';
    const safe = name.replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '');
    return safe ? `${safe}.png` : 'deck-view.png';
  }

  buildDeckViewComposition(scale = 1) {
    const cfg = this.deckTemplateConfig || {};
    const renderScale = Number.isFinite(Number(scale)) ? Math.max(1, Number(scale)) : 1;
    const outW = Math.max(1, Math.round((Number(cfg.width) || 3766) * renderScale));
    const outH = Math.max(1, Math.round((Number(cfg.height) || 4094) * renderScale));
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

    const images = this.deckViewGrid ? Array.from(this.deckViewGrid.querySelectorAll('img')) : [];
    const items = images.map((imgEl, index) => {
      const src = imgEl.currentSrc || imgEl.src;
      const col = index % columns;
      const row = Math.floor(index / columns);
      const cellX = offsetX + (col * (colWidth + colGap));
      const cellH = rowHeights[row] ?? rowHeights[rowHeights.length - 1] ?? rowHeights[0] ?? 0;
      const cellY = rowTop(row);
      const drawW = colWidth * cardScale;
      const drawH = cellH * cardScale;
      return {
        src,
        x: cellX + ((colWidth - drawW) / 2) + cardOffsetX,
        y: cellY + ((cellH - drawH) / 2) + cardOffsetY,
        width: drawW,
        height: drawH
      };
    }).filter((item) => item.src);

    return {
      width: outW,
      height: outH,
      background: '#000000',
      baseLayer: this.absoluteAssetUrl(this.deckLayerAssets?.base),
      overlayLayer: this.absoluteAssetUrl(this.deckLayerAssets?.overlay),
      items
    };
  }

  async captureDeckViewBlob(scale = 1) {
    if (!this.supportsRenderWorker()) return null;
    const payload = this.buildDeckViewComposition(scale);
    if (!payload.items.length) return null;
    const result = await this.runRenderWorker('compose-deck', payload);
    return result.blob || null;
  }

  async exportDeckView() {
    if (!this.deckTemplate) return;
    this.beginBusy('Exporting deck preview image...');
    try {
      const wasOpen = this.isDeckViewOpen();
      if (!wasOpen) {
        this.openDeckView();
        await this.yieldToBrowser(2);
      }
      await this.renderDeckView();
      const blob = await this.captureDeckViewBlob(1);
      const didExport = blob ? await this.downloadBlob(blob, this.buildDeckViewFilename()) : false;

      if (!didExport) {
        this.showToast('Deck export requires a modern browser with worker canvas support.', { force: true, duration: 3600 });
        return;
      }
      this.showToast('Deck view exported as PNG.', { force: true });
    } catch (error) {
      console.error('Deck view export failed:', error);
      this.showToast('Deck view export failed. Please try again.', { force: true, duration: 3200 });
    } finally {
      this.endBusy();
    }
  }

  buildPrintSheetBaseFilename() {
    const deck = this.getSelectedDeck();
    const name = deck?.name ? String(deck.name) : 'print-sheet';
    const safe = name.replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '');
    return safe || 'print-sheet';
  }

  buildPrintPageCompositions(scale = 1) {
    const pages = this.getPrintSheetPageNodes();
    if (!pages.length) return [];
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

    const layers = [];
    if (this.printLayerAssets.base) {
      layers.push({ src: this.absoluteAssetUrl(this.printLayerAssets.base) });
    }
    if (layerState.safe && this.printLayerAssets.safe) {
      layers.push({ src: this.absoluteAssetUrl(this.printLayerAssets.safe) });
    }
    if (layerState.cut && this.printLayerAssets.cut) {
      layers.push({ src: this.absoluteAssetUrl(this.printLayerAssets.cut) });
    }

    return pages.map((page) => {
      const imgs = Array.from(page.querySelectorAll('.print-card img'));
      const items = imgs.map((imgEl, index) => {
        const src = imgEl.currentSrc || imgEl.src;
        const col = index % columns;
        const row = Math.floor(index / columns);
        return {
          src,
          x: offsetX + (col * (colWidth + colGap)),
          y: offsetY + (row * (rowHeight + rowGap)),
          width: colWidth,
          height: rowHeight
        };
      }).filter((item) => item.src);

      return {
        width: outW,
        height: outH,
        background: '#ffffff',
        layers,
        items
      };
    });
  }

  async capturePrintPageBlobs(scale = 1) {
    if (!this.supportsRenderWorker()) return [];
    const pages = this.buildPrintPageCompositions(scale);
    if (!pages.length) return [];
    const result = await this.runRenderWorker('compose-print-pages', { pages });
    return Array.isArray(result.blobs) ? result.blobs : [];
  }

  async stackImageBlobsAsPng(blobs) {
    const safeBlobs = Array.isArray(blobs) ? blobs.filter(Boolean) : [];
    if (!safeBlobs.length) return null;
    if (safeBlobs.length === 1) return safeBlobs[0];

    const bitmaps = [];
    try {
      for (const blob of safeBlobs) {
        bitmaps.push(await createImageBitmap(blob));
      }
      const width = Math.max(...bitmaps.map((bitmap) => bitmap.width));
      const height = bitmaps.reduce((sum, bitmap) => sum + bitmap.height, 0);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      let y = 0;
      bitmaps.forEach((bitmap) => {
        ctx.drawImage(bitmap, 0, y);
        y += bitmap.height;
      });
      if (renderer && typeof renderer.canvasToPngBlob === 'function') {
        return renderer.canvasToPngBlob(canvas);
      }
      return await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob || null), 'image/png'));
    } finally {
      bitmaps.forEach((bitmap) => {
        if (bitmap && typeof bitmap.close === 'function') bitmap.close();
      });
    }
  }

  async exportPrintSheetAsPng() {
    this.beginBusy('Building print sheet PNG...');
    try {
      if (!this.isPrintSheetOpen()) this.openPrintSheet();
      await this.renderPrintSheet();
      const blobs = await this.capturePrintPageBlobs();
      const outputBlob = await this.stackImageBlobsAsPng(blobs);
      const didExport = outputBlob
        ? await this.downloadBlob(outputBlob, `${this.buildPrintSheetBaseFilename()}_print_sheet.png`)
        : false;

      if (!didExport) {
        this.showToast('Print PNG export requires a modern browser with worker canvas support.', { force: true, duration: 3600 });
        return;
      }
      this.showToast('Print sheet PNG exported.', { force: true });
    } catch (error) {
      console.error('Print PNG export failed:', error);
      this.showToast('Print sheet PNG export failed. Please try again.', { force: true, duration: 3200 });
    } finally {
      this.endBusy();
    }
  }

  async exportPrintSheetAsPdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      this.showToast('PDF export is unavailable right now. Reload and try again.', { force: true, duration: 3200 });
      return;
    }
    this.beginBusy('Generating print-ready PDF...');
    try {
      if (!this.isPrintSheetOpen()) this.openPrintSheet();
      await this.renderPrintSheet();
      const blobs = await this.capturePrintPageBlobs(2);
      const pageImages = await Promise.all(blobs.map(async (blob) => {
        const size = await this.getImageBlobSize(blob);
        const dataUrl = await this.blobToDataUrl(blob);
        return {
          dataUrl,
          width: size?.width || 1,
          height: size?.height || 1
        };
      }));

      if (!pageImages.length) {
        this.showToast('Print PDF export requires a modern browser with worker canvas support.', { force: true, duration: 3600 });
        return;
      }

      const { jsPDF } = window.jspdf;
      const first = pageImages[0];
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [first.width, first.height]
      });

      pageImages.forEach((pageImage, index) => {
        if (index > 0) {
          pdf.addPage([pageImage.width, pageImage.height], 'portrait');
        }
        pdf.addImage(pageImage.dataUrl, 'PNG', 0, 0, pageImage.width, pageImage.height, undefined, 'FAST');
      });

      pdf.save(`${this.buildPrintSheetBaseFilename()}_print_sheet.pdf`);
      this.showToast('Print sheet PDF exported.', { force: true });
    } catch (error) {
      console.error('Print PDF export failed:', error);
      this.showToast('Print sheet PDF export failed. Please try again.', { force: true, duration: 3200 });
    } finally {
      this.endBusy();
    }
  }

  async printPrintSheet() {
    this.beginBusy('Preparing print pages...');
    try {
      if (!this.isPrintSheetOpen()) this.openPrintSheet();
      await this.renderPrintSheet();
      const blobs = await this.capturePrintPageBlobs(2);
      const imageUrls = blobs.map((blob) => URL.createObjectURL(blob));

      if (!imageUrls.length) {
        this.showToast('Printing requires a modern browser with worker canvas support.', { force: true, duration: 3600 });
        return;
      }

      const win = window.open('', '_blank');
      if (!win) {
        this.showToast('Unable to open print window. Please allow popups for this site.', { force: true, duration: 3400 });
        return;
      }
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
  ${imageUrls.map((src) => `<img src="${src}" alt="Print sheet page" />`).join('')}
</body>
</html>`;
      win.document.open();
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
      if (imageUrls.some((src) => src.startsWith('blob:'))) {
        window.setTimeout(() => {
          imageUrls.forEach((src) => {
            if (src.startsWith('blob:')) URL.revokeObjectURL(src);
          });
        }, 60000);
      }
      this.showToast('Print window opened.', { force: true });
    } catch (error) {
      console.error('Print preparation failed:', error);
      this.showToast('Print preparation failed. Please try again.', { force: true, duration: 3200 });
    } finally {
      this.endBusy();
    }
  }

  toggleExportMenu(force) {
    if (!this.exportMenuPanel || !this.btnExport) return;
    const isOpen = this.exportMenuPanel.classList.contains('is-open');
    const next = typeof force === 'boolean' ? force : !isOpen;
    if (next) this.closeActionsMenu();
    this.exportMenuPanel.classList.toggle('is-open', next);
    this.exportMenuPanel.setAttribute('aria-hidden', next ? 'false' : 'true');
    this.btnExport.setAttribute('aria-expanded', next ? 'true' : 'false');
  }

  closeExportMenu() {
    this.toggleExportMenu(false);
  }

  toggleActionsMenu(force) {
    if (!this.actionsMenuPanel || !this.btnActions) return;
    const isOpen = this.actionsMenuPanel.classList.contains('is-open');
    const next = typeof force === 'boolean' ? force : !isOpen;
    if (next) this.closeExportMenu();
    this.actionsMenuPanel.classList.toggle('is-open', next);
    this.actionsMenuPanel.setAttribute('aria-hidden', next ? 'false' : 'true');
    this.btnActions.setAttribute('aria-expanded', next ? 'true' : 'false');
  }

  closeActionsMenu() {
    this.toggleActionsMenu(false);
  }

  getSiteModalById(modalId) {
    if (!modalId || typeof document === 'undefined') return null;
    return document.getElementById(modalId);
  }

  getOpenSiteModalId() {
    if (typeof document === 'undefined') return '';
    const node = document.querySelector('.site-modal.is-open');
    return node ? String(node.id || '') : '';
  }

  openModal(modalId) {
    const modal = this.getSiteModalById(modalId);
    if (!modal) return;
    this.closeExportMenu();
    this.closeActionsMenu();
    const currentlyOpen = this.getOpenSiteModalId();
    if (currentlyOpen && currentlyOpen !== modalId) {
      this.closeModal(currentlyOpen);
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    if (modalId === 'quickStartModal' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.quickStartSeenKey, 'true');
    }
  }

  closeModal(modalId) {
    const modal = this.getSiteModalById(modalId);
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  async confirmAction(options = {}) {
    const title = String(options.title || 'Confirm Action').trim() || 'Confirm Action';
    const message = String(options.message || 'Are you sure you want to continue?').trim() || 'Are you sure you want to continue?';
    const confirmLabel = String(options.confirmLabel || 'Confirm').trim() || 'Confirm';
    const cancelLabel = String(options.cancelLabel || 'Cancel').trim() || 'Cancel';
    const danger = options.danger === true;

    if (
      !this.confirmActionModal
      || !this.confirmActionTitle
      || !this.confirmActionMessage
      || !this.confirmActionCancelBtn
      || !this.confirmActionConfirmBtn
    ) {
      this.showToast('Confirmation dialog is unavailable right now. Please reload and try again.', { force: true, duration: 3200 });
      return false;
    }

    this.confirmActionTitle.textContent = title;
    this.confirmActionMessage.textContent = message;
    this.confirmActionCancelBtn.textContent = cancelLabel;
    this.confirmActionConfirmBtn.textContent = confirmLabel;
    this.confirmActionConfirmBtn.classList.toggle('btn-danger', danger);
    this.confirmActionConfirmBtn.classList.toggle('btn-primary', !danger);

    this.openModal('confirmActionModal');
    this.confirmActionConfirmBtn.focus();

    return new Promise((resolve) => {
      let settled = false;
      const finalize = (value) => {
        if (settled) return;
        settled = true;
        this.confirmActionCancelBtn.removeEventListener('click', onCancel);
        this.confirmActionConfirmBtn.removeEventListener('click', onConfirm);
        this.confirmActionModal.removeEventListener('click', onBackdropClick);
        document.removeEventListener('keydown', onKeyDown);
        this.closeModal('confirmActionModal');
        resolve(value);
      };
      const onCancel = () => finalize(false);
      const onConfirm = () => finalize(true);
      const onBackdropClick = (event) => {
        if (!event?.target || !this.confirmActionModal) return;
        if (event.target.classList && event.target.classList.contains('site-modal__backdrop')) {
          finalize(false);
        }
      };
      const onKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          finalize(false);
        }
      };
      this.confirmActionCancelBtn.addEventListener('click', onCancel);
      this.confirmActionConfirmBtn.addEventListener('click', onConfirm);
      this.confirmActionModal.addEventListener('click', onBackdropClick);
      document.addEventListener('keydown', onKeyDown);
    });
  }

  openShareLinkModal(shareUrl) {
    const safeUrl = String(shareUrl || '').trim();
    if (!safeUrl || !this.shareLinkModal || !this.shareLinkInput) return;
    this.shareLinkInput.value = safeUrl;
    this.openModal('shareLinkModal');
    this.shareLinkInput.focus();
    this.shareLinkInput.select();
  }

  async copyShareLinkFromModal() {
    const shareUrl = String(this.shareLinkInput?.value || '').trim();
    if (!shareUrl) return;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(shareUrl);
        this.showToast('Share link copied to clipboard.', { force: true });
        return;
      }
    } catch (error) {
      console.warn('Clipboard copy from modal failed:', error);
    }
    if (this.shareLinkInput) {
      this.shareLinkInput.focus();
      this.shareLinkInput.select();
    }
    this.showToast('Clipboard unavailable. Copy the highlighted link manually.', { force: true, duration: 3200 });
  }

  syncProcessingToastSetting() {
    if (!this.showProcessingToasts) return;
    this.showProcessingToasts.checked = !!this.showToasts;
  }

  showToast(message, options = {}) {
    const force = options.force === true;
    if (!this.appToast) return;
    if (!force && !this.showToasts) return;
    const safeMessage = String(message || '').trim();
    if (!safeMessage) return;
    this.appToast.textContent = safeMessage;
    this.appToast.classList.add('is-visible');
    if (this.toastHideTimer) {
      clearTimeout(this.toastHideTimer);
    }
    const duration = Number.isFinite(Number(options.duration)) ? Number(options.duration) : 2200;
    this.toastHideTimer = setTimeout(() => {
      this.appToast.classList.remove('is-visible');
    }, Math.max(900, duration));
  }

  setBusyMessage(message) {
    if (!this.appLoadingText) return;
    const safe = String(message || '').trim() || 'Processing...';
    this.appLoadingText.textContent = safe;
  }

  beginBusy(message) {
    this.busyDepth = Math.max(0, Number(this.busyDepth) || 0) + 1;
    this.setBusyMessage(message);
    if (!this.appLoadingOverlay) return;
    this.appLoadingOverlay.classList.add('is-visible');
    this.appLoadingOverlay.setAttribute('aria-hidden', 'false');
  }

  endBusy() {
    this.busyDepth = Math.max(0, (Number(this.busyDepth) || 0) - 1);
    if (this.busyDepth > 0) return;
    if (!this.appLoadingOverlay) return;
    this.appLoadingOverlay.classList.remove('is-visible');
    this.appLoadingOverlay.setAttribute('aria-hidden', 'true');
  }

  async yieldToBrowser(turn = 1) {
    const count = Math.max(1, Number(turn) || 1);
    for (let i = 0; i < count; i += 1) {
      await new Promise((resolve) => {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(() => resolve());
          return;
        }
        setTimeout(resolve, 0);
      });
    }
  }

  async waitForIdle(timeout = 1200) {
    if (typeof requestIdleCallback === 'function') {
      await new Promise((resolve) => {
        requestIdleCallback(() => resolve(), { timeout });
      });
      return;
    }
    await this.yieldToBrowser(2);
  }

  estimateRenderCacheValueSize(value) {
    return String(value || '').length * 2;
  }

  revokeObjectUrl(value) {
    const url = String(value || '');
    if (!url.startsWith('blob:') || typeof URL === 'undefined') return;
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      // Ignore revoke failures.
    }
  }

  releaseRenderCacheEntry(entry) {
    if (!entry) return 0;
    if (typeof entry === 'string') return this.estimateRenderCacheValueSize(entry);
    if (entry.objectUrl) this.revokeObjectUrl(entry.value);
    return Number(entry.size) || this.estimateRenderCacheValueSize(entry.value);
  }

  async canvasToImageUrl(canvas, preferObjectUrl = true) {
    if (!canvas) return { value: '', size: 0, objectUrl: false };
    if (
      preferObjectUrl
      &&
      renderer
      && typeof renderer.canvasToPngBlob === 'function'
      && typeof URL !== 'undefined'
      && typeof URL.createObjectURL === 'function'
    ) {
      const blob = await renderer.canvasToPngBlob(canvas);
      if (blob) {
        return {
          value: URL.createObjectURL(blob),
          size: Number(blob.size) || this.estimateRenderCacheValueSize(''),
          objectUrl: true
        };
      }
    }
    const value = canvas.toDataURL('image/png');
    return {
      value,
      size: this.estimateRenderCacheValueSize(value),
      objectUrl: false
    };
  }

  getRenderCacheValue(key) {
    const safeKey = String(key || '');
    if (!safeKey || !this.renderDataUrlCache) return '';
    const entry = this.renderDataUrlCache.get(safeKey);
    if (!entry) return '';
    const value = typeof entry === 'string' ? entry : entry.value;
    if (!value) {
      this.renderDataUrlCache.delete(safeKey);
      return '';
    }
    // Touch to keep recently-used keys alive.
    this.renderDataUrlCache.delete(safeKey);
    this.renderDataUrlCache.set(safeKey, typeof entry === 'string'
      ? { value, size: this.estimateRenderCacheValueSize(value) }
      : entry);
    return value;
  }

  setRenderCacheValue(key, value, options = {}) {
    const safeKey = String(key || '');
    const safeValue = String(value || '');
    if (!safeKey || !safeValue || !this.renderDataUrlCache) return;
    const existing = this.renderDataUrlCache.get(safeKey);
    if (existing) {
      this.renderDataUrlCacheBytes = Math.max(
        0,
        this.renderDataUrlCacheBytes - this.releaseRenderCacheEntry(existing)
      );
      this.renderDataUrlCache.delete(safeKey);
    }
    const size = Number(options.size) || this.estimateRenderCacheValueSize(safeValue);
    this.renderDataUrlCache.set(safeKey, {
      value: safeValue,
      size,
      objectUrl: options.objectUrl === true
    });
    this.renderDataUrlCacheBytes += size;
    while (
      this.renderDataUrlCache.size > this.renderDataUrlCacheLimit
      || this.renderDataUrlCacheBytes > this.renderDataUrlCacheByteLimit
    ) {
      const oldestKey = this.renderDataUrlCache.keys().next().value;
      if (!oldestKey) break;
      if (oldestKey === safeKey && this.renderDataUrlCache.size === 1) break;
      const oldest = this.renderDataUrlCache.get(oldestKey);
      this.renderDataUrlCacheBytes = Math.max(0, this.renderDataUrlCacheBytes - this.releaseRenderCacheEntry(oldest));
      this.renderDataUrlCache.delete(oldestKey);
    }
  }

  clearRenderCache() {
    if (!this.renderDataUrlCache) return;
    for (const entry of this.renderDataUrlCache.values()) {
      this.releaseRenderCacheEntry(entry);
    }
    this.renderDataUrlCache.clear();
    this.renderDataUrlCacheBytes = 0;
  }

  scheduleRenderWarmup(options = {}) {
    const immediate = options.immediate === true;
    const delayMs = Number.isFinite(Number(options.delayMs))
      ? Math.max(0, Number(options.delayMs))
      : (immediate ? 120 : 900);

    this.renderWarmupToken += 1;
    const token = this.renderWarmupToken;
    if (this.renderWarmupTimer) {
      clearTimeout(this.renderWarmupTimer);
      this.renderWarmupTimer = null;
    }
    if (this.renderWarmupIdleHandle !== null && typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(this.renderWarmupIdleHandle);
      this.renderWarmupIdleHandle = null;
    }
    this.renderWarmupTimer = setTimeout(() => {
      this.renderWarmupTimer = null;
      this.startRenderWarmup(token);
    }, delayMs);
  }

  startRenderWarmup(token) {
    const run = () => {
      this.renderWarmupIdleHandle = null;
      this.runRenderWarmup(token).catch((error) => {
        console.warn('Render warmup failed:', error);
      });
    };
    if (typeof requestIdleCallback === 'function') {
      this.renderWarmupIdleHandle = requestIdleCallback(run, { timeout: 4500 });
      return;
    }
    run();
  }

  async runRenderWarmup(token) {
    const runToken = Number.isFinite(Number(token)) ? Number(token) : this.renderWarmupToken;
    if (this.renderWarmupInFlight) {
      this.renderWarmupQueued = true;
      return;
    }
    if (this.busyDepth > 0) {
      this.scheduleRenderWarmup({ immediate: false, delayMs: 1200 });
      return;
    }

    this.renderWarmupInFlight = true;
    this.renderWarmupQueued = false;
    try {
      const deck = this.getSelectedDeck();
      let entries = [];
      if (deck && Array.isArray(deck.cards) && deck.cards.length) {
        entries = deck.cards;
      } else if (!deck) {
        entries = await this.loadDefaultDeckCardsForView();
      }
      if (runToken !== this.renderWarmupToken) return;
      if (!entries.length) return;

      await this.ensureDeckDefaultCard();
      if (runToken !== this.renderWarmupToken) return;

      const printColumns = Math.max(1, Number(this.printTemplateConfig?.columns) || 2);
      const printRows = Math.max(1, Number(this.printTemplateConfig?.rows) || 4);
      const warmLimit = Math.min(entries.length, Math.max(printColumns * printRows, 12));
      const printWidth = Number(this.printTemplateConfig?.columnWidth) || 1004;
      const printHeight = Number(this.printTemplateConfig?.rowHeight) || 626;

      for (let index = 0; index < warmLimit; index += 1) {
        if (runToken !== this.renderWarmupToken) return;
        if (this.busyDepth > 0) {
          this.renderWarmupQueued = true;
          return;
        }
        if (index > 0) {
          await this.waitForIdle(1400);
        }

        const entry = entries[index];
        const entryJson = (entry && typeof entry.json === 'string')
          ? entry.json
          : JSON.stringify(entry || {});
        const cardData = this.buildCardFromJson(entryJson);
        cardData.layers = { ...(cardData.layers || {}), cardBleed: false };
        const name = String(cardData.name || entry?.__printName || entry?.name || `Card ${index + 1}`).trim() || `Card ${index + 1}`;
        if (!cardData.name || cardData.name === 'Title') {
          cardData.name = name;
        }

        const deckCacheToken = `${entryJson}|name:${name}`;
        await this.renderDeckCardDataUrl(cardData, deckCacheToken);

        const printCacheToken = `${entryJson}|printMode:${this.printMode}|name:${name}`;
        await this.renderPrintCardDataUrl(cardData, printWidth, printHeight, printCacheToken);
      }
    } finally {
      this.renderWarmupInFlight = false;
      if (this.renderWarmupQueued || runToken !== this.renderWarmupToken) {
        this.renderWarmupQueued = false;
        this.scheduleRenderWarmup({ immediate: false, delayMs: 120 });
      }
    }
  }

  maybeShowQuickStart() {
    if (typeof localStorage === 'undefined' || !this.quickStartModal) return;
    if (typeof navigator !== 'undefined' && navigator.webdriver) return;
    const seen = localStorage.getItem(this.quickStartSeenKey) === 'true';
    if (seen) return;
    this.openModal('quickStartModal');
  }

  loadSavedDefaultsCard() {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(this.userDefaultsKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
      console.warn('Failed to parse saved defaults:', error);
      return null;
    }
  }

  applySavedDefaultsToState(options = {}) {
    const defaultsCard = this.loadSavedDefaultsCard();
    if (!defaultsCard) return false;
    const loaded = gameState.fromJSON(JSON.stringify(defaultsCard));
    if (!loaded) return false;
    this.applyDefaultCardIdFromDeck(true);
    this.updateUI();
    if (!options.silent) {
      this.showToast('Loaded your saved defaults.');
    }
    return true;
  }

  saveCurrentAsDefaults() {
    if (typeof localStorage === 'undefined') return;
    const card = gameState.getCard();
    localStorage.setItem(this.userDefaultsKey, JSON.stringify(card));
    this.showToast('Saved current card as your defaults.');
  }

  resetToSavedDefaults() {
    const loaded = this.applySavedDefaultsToState({ silent: true });
    if (!loaded) {
      this.showToast('No saved defaults found. Save defaults first.', { force: true, duration: 2800 });
      return;
    }
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast('Reset to your saved defaults.');
  }

  async restoreFactoryDefaults() {
    const shouldRestore = await this.confirmAction({
      title: 'Restore Factory Settings',
      message: 'Restore factory settings and clear your saved defaults?',
      confirmLabel: 'Restore Settings',
      cancelLabel: 'Cancel',
      danger: true
    });
    if (!shouldRestore) return;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.userDefaultsKey);
    }
    this.clearRenderCache();
    gameState.reset();
    this.applyDefaultCardIdFromDeck(true);
    this.updateUI();
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast('Factory settings restored.', { force: true });
  }

  async resetAppData() {
    if (typeof localStorage === 'undefined') return;
    const shouldReset = await this.confirmAction({
      title: 'Reset App Data',
      message: 'Reset all local app data? This clears decks, autosave, and preferences.',
      confirmLabel: 'Reset Data',
      cancelLabel: 'Cancel',
      danger: true
    });
    if (!shouldReset) return;
    this.appStorageKeys.forEach((key) => {
      if (!key) return;
      localStorage.removeItem(key);
    });
    this.showToasts = true;
    this.syncProcessingToastSetting();
    this.clearRenderCache();
    this.boardPan = { x: 0, y: 0 };
    this.setBoardPan(0, 0, { persist: false });
    gameState.reset();
    this.applyDefaultCardIdFromDeck(true);
    this.updateUI();
    this.refreshDeckUI();
    this.refreshBoardAbilityOptions();
    this.renderBoardSlotAssignments();
    this.scheduleRenderWarmup({ immediate: true });
    this.closeModal('settingsModal');
    this.showToast('App data reset complete.', { force: true, duration: 2600 });
  }

  handleFileInput(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      if (gameState.fromJSON(json)) {
        this.updateUI();
        this.scheduleRenderWarmup({ immediate: true });
        this.showToast('Card loaded successfully.', { force: true });
      } else {
        this.showToast('Failed to load card. Invalid JSON format.', { force: true, duration: 3000 });
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
      this.showToast('Failed to read the selected image.', { force: true, duration: 2800 });
      return false;
    }

    if (!imageData) return false;

    const openCropperOnUpload = !!(this.toggleCropperOnUpload && this.toggleCropperOnUpload.checked);
    const defaultTransform = { x: 0, y: 0, scale: 1 };

    gameState.updateProperties(this.buildArtUpdates({
      data: openCropperOnUpload ? null : imageData,
      url: null,
      sourceData: openCropperOnUpload ? imageData : null,
      sourceUrl: null,
      cropTransform: null,
      transform: defaultTransform,
      cropToFrame: false,
      wasCropped: false
    }));

    this.setImagePreviewSource(imageData);
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
    gameState.updateProperties(this.buildArtUpdates({
      data: null,
      url: null,
      sourceData: null,
      sourceUrl: null,
      cropTransform: null,
      cropToFrame: false,
      wasCropped: false
    }));
    this.imageUploadInput.value = '';
    this.setImagePreviewSource('');
    renderer.setCardArt(null);
  }

  async resetCanvas() {
    this.closeActionsMenu();
    const shouldReset = await this.confirmAction({
      title: 'Reset Canvas',
      message: 'Reset the canvas to defaults? This will reset text, images, and positions.',
      confirmLabel: 'Reset Canvas',
      cancelLabel: 'Keep Editing',
      danger: true
    });
    if (!shouldReset) return;
    gameState.reset();
    this.updateUI();
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast('Canvas reset complete.', { force: true });
  }

  handleArtSelect(event) {
    const value = event.target.value || '';
    gameState.updateProperties(this.buildArtUpdates({
      url: value,
      data: null,
      sourceData: null,
      sourceUrl: null,
      cropTransform: null,
      transform: { x: 0, y: 0, scale: 1 },
      cropToFrame: false,
      wasCropped: false
    }));
    if (value) {
      renderer.setCardArt(value);
      this.setImagePreviewSource(value);
    } else {
      this.setImagePreviewSource('');
      renderer.setCardArt(null);
    }
  }

  setImagePreviewSource(src) {
    if (!this.imagePreview) return;
    const safeSrc = String(src || '');
    this.imagePreview.replaceChildren();
    if (safeSrc) {
      const img = document.createElement('img');
      img.src = safeSrc;
      img.alt = 'Card Art';
      this.imagePreview.appendChild(img);
    }
    if (this.btnClearImage) {
      this.btnClearImage.style.display = safeSrc ? 'inline-block' : 'none';
    }
  }

  syncArtControls(card = gameState.getCard()) {
    const context = this.getArtContext();
    let currentCard = card && typeof card === 'object' ? card : gameState.getCard();
    const updates = {};
    if (!currentCard[context.transformKey]) {
      updates[context.transformKey] = { x: 0, y: 0, scale: 1 };
    }
    if (currentCard[context.sourceDataKey] === undefined) {
      updates[context.sourceDataKey] = null;
    }
    if (currentCard[context.sourceUrlKey] === undefined) {
      updates[context.sourceUrlKey] = null;
    }
    if (currentCard[context.cropTransformKey] === undefined) {
      updates[context.cropTransformKey] = null;
    }
    if (currentCard[context.cropToFrameKey] === undefined) {
      updates[context.cropToFrameKey] = false;
    }
    if (currentCard[context.wasCroppedKey] === undefined) {
      updates[context.wasCroppedKey] = false;
    }
    if (Object.keys(updates).length > 0) {
      gameState.updateProperties(updates);
      currentCard = gameState.getCard();
    }

    const artData = currentCard[context.dataKey] || '';
    const artUrl = currentCard[context.urlKey] || '';
    const artSource = artData || artUrl;
    this.setImagePreviewSource(artSource);
    if (this.artSelect) this.artSelect.value = artUrl || '';
    renderer.setCardArt(artSource || null);
    this.queueRendererWork('artCrop');
    return currentCard;
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
    return this.getSelectedCropMaskConfig().path || fallback;
  }

  getSelectedCropMaskConfig() {
    const fallback = this.defaultCropMask || 'Assets/images/Card Art/Common Loot.png';
    if (!this.cropMaskSelect) return { path: fallback, mode: 'alpha' };
    const option = this.cropMaskSelect.selectedOptions && this.cropMaskSelect.selectedOptions[0]
      ? this.cropMaskSelect.selectedOptions[0]
      : null;
    const rawValue = String(this.cropMaskSelect.value || '').trim();
    let path = rawValue || fallback;
    let mode = String(option?.dataset?.maskMode || '').trim() || 'alpha';
    const encodedModeMatch = path.match(/^([a-z-]+)\|(.*)$/i);
    if (encodedModeMatch) {
      mode = encodedModeMatch[1] || mode;
      path = encodedModeMatch[2] || fallback;
    }
    return {
      path: path || fallback,
      mode: mode || 'alpha'
    };
  }

  buildInsideFrameMask(maskImg) {
    if (!maskImg || !maskImg.width || !maskImg.height) return null;
    const canvas = document.createElement('canvas');
    canvas.width = maskImg.width;
    canvas.height = maskImg.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(maskImg, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;
    const outside = new Uint8Array(w * h);
    const queueX = new Int32Array(w * h);
    const queueY = new Int32Array(w * h);
    let qh = 0;
    let qt = 0;
    const isTransparent = (idx) => data[idx * 4 + 3] === 0;
    const push = (x, y) => {
      const i = y * w + x;
      if (outside[i] || !isTransparent(i)) return;
      outside[i] = 1;
      queueX[qt] = x;
      queueY[qt] = y;
      qt += 1;
    };
    for (let x = 0; x < w; x += 1) {
      push(x, 0);
      push(x, h - 1);
    }
    for (let y = 0; y < h; y += 1) {
      push(0, y);
      push(w - 1, y);
    }
    while (qh < qt) {
      const x = queueX[qh];
      const y = queueY[qh];
      qh += 1;
      if (x > 0) push(x - 1, y);
      if (x < w - 1) push(x + 1, y);
      if (y > 0) push(x, y - 1);
      if (y < h - 1) push(x, y + 1);
    }
    const mask = ctx.createImageData(w, h);
    const output = mask.data;
    let hasInside = false;
    for (let i = 0; i < w * h; i += 1) {
      const inside = isTransparent(i) && outside[i] !== 1;
      if (inside) hasInside = true;
      const idx = i * 4;
      output[idx] = 255;
      output[idx + 1] = 255;
      output[idx + 2] = 255;
      output[idx + 3] = inside ? 255 : 0;
    }
    if (!hasInside) return null;
    ctx.putImageData(mask, 0, 0);
    return canvas;
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
    gameState.updateProperties(this.buildArtUpdates({
      data: cropped,
      url: null,
      sourceData: null,
      sourceUrl: null,
      cropTransform: null,
      transform: { x: 0, y: 0, scale: 1 },
      cropToFrame: false,
      wasCropped: true
    }));
    if (this.artSelect) this.artSelect.value = '';
    this.setImagePreviewSource(cropped);
    renderer.setCardArt(cropped);
    this.queueRendererWork('full');
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
      const maskConfig = this.getSelectedCropMaskConfig();
      const maskPath = maskConfig.path;
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
        const activeMask = maskConfig.mode === 'inside-frame'
          ? (this.buildInsideFrameMask(maskImg) || maskImg)
          : maskImg;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(activeMask, 0, 0, frameW, frameH);
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
    const styles = this.previewContainer ? getComputedStyle(this.previewContainer) : null;
    const baseRaw = styles
      ? (styles.getPropertyValue('--template-card-width') || styles.getPropertyValue('--card-width'))
      : '';
    const baseWidth = parseFloat(baseRaw) || 675;
    const currentWidth = this.previewElement ? this.previewElement.clientWidth : baseWidth;
    if (!baseWidth || !currentWidth) return 1;
    return currentWidth / baseWidth;
  }

  requestPreviewRender() {
    this.queueRendererWork('full');
  }

  schedulePreviewRender(delayMs = 110) {
    this.queueRendererWork('full', { delayMs });
  }

  queueRendererWork(flags, options = {}) {
    const list = Array.isArray(flags) ? flags : [flags];
    list.forEach((flag) => {
      const safeFlag = String(flag || '').trim();
      if (safeFlag) this.renderQueueFlags.add(safeFlag);
    });
    if (!this.renderQueueFlags.size) return;

    const delayMs = Number.isFinite(Number(options.delayMs))
      ? Math.max(0, Number(options.delayMs))
      : 0;
    if (delayMs > 0 && typeof window !== 'undefined') {
      if (this.renderQueueTimer !== null) {
        window.clearTimeout(this.renderQueueTimer);
      }
      this.renderQueueTimer = window.setTimeout(() => {
        this.renderQueueTimer = null;
        this.requestRendererFlush();
      }, delayMs);
      return;
    }

    this.requestRendererFlush();
  }

  requestRendererFlush() {
    if (this.renderQueueRaf !== null) return;
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
      this.flushRendererWork();
      return;
    }
    this.renderQueueRaf = window.requestAnimationFrame(() => {
      this.renderQueueRaf = null;
      this.flushRendererWork();
    });
  }

  flushRendererWork() {
    if (!this.renderQueueFlags.size || !renderer || !gameState) return;
    const flags = new Set(this.renderQueueFlags);
    this.renderQueueFlags.clear();

    const card = gameState.getCard();
    if (flags.has('full')) {
      renderer.render(card);
      return;
    }

    const needsContentNonce = flags.has('title')
      || flags.has('description')
      || flags.has('cardId')
      || flags.has('costBadge');
    const renderNonce = needsContentNonce && typeof renderer.beginContentRender === 'function'
      ? renderer.beginContentRender()
      : renderer.contentRenderNonce;
    renderer.tokenIconCardContext = card;

    if (flags.has('artCrop')) renderer.updateArtCrop(card);
    if (flags.has('artTransform')) renderer.updateArtTransform(card);
    if (flags.has('title')) renderer.updateTitleImage(card, renderNonce);
    if (flags.has('description')) renderer.updateDescriptionImage(card, renderNonce);
    if (flags.has('cardId')) renderer.updateCardIdText(card, renderNonce);
    if (flags.has('costBadge')) {
      renderer.updateCostBadge(card, renderNonce);
    } else if (flags.has('costBadgePosition')) {
      renderer.updateCostBadgePosition(card);
    }
  }

  runCoalescedStateUpdate(key, callback, delayMs = 500) {
    const safeKey = String(key || '').trim();
    if (!safeKey || typeof callback !== 'function') return undefined;

    const canTransact = typeof gameState?.beginTransaction === 'function'
      && typeof gameState?.commitTransaction === 'function';
    if (canTransact && !this.coalescedStateOpen.has(safeKey)) {
      gameState.beginTransaction();
      this.coalescedStateOpen.add(safeKey);
    }

    const result = callback();
    this.scheduleCoalescedStateCommit(safeKey, delayMs);
    return result;
  }

  scheduleCoalescedStateCommit(key, delayMs = 500) {
    const safeKey = String(key || '').trim();
    if (!safeKey || !this.coalescedStateOpen.has(safeKey)) return;

    const existing = this.coalescedStateTimers.get(safeKey);
    if (existing && typeof window !== 'undefined') {
      window.clearTimeout(existing);
    }

    const commit = () => this.commitCoalescedStateUpdate(safeKey);
    if (typeof window === 'undefined') {
      commit();
      return;
    }

    const timer = window.setTimeout(commit, Math.max(0, Number(delayMs) || 0));
    this.coalescedStateTimers.set(safeKey, timer);
  }

  commitCoalescedStateUpdate(key) {
    const safeKey = String(key || '').trim();
    if (!safeKey || !this.coalescedStateOpen.has(safeKey)) return false;

    const timer = this.coalescedStateTimers.get(safeKey);
    if (timer && typeof window !== 'undefined') {
      window.clearTimeout(timer);
    }
    this.coalescedStateTimers.delete(safeKey);
    this.coalescedStateOpen.delete(safeKey);

    if (typeof gameState?.commitTransaction === 'function') {
      return gameState.commitTransaction();
    }
    return false;
  }

  schedulePreviewZoomPersist(delayMs = 140) {
    if (typeof localStorage === 'undefined') return;
    if (this.previewZoomPersistTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.previewZoomPersistTimer);
      this.previewZoomPersistTimer = null;
    }
    if (typeof window === 'undefined') {
      localStorage.setItem(this.previewZoomStorageKey, String(this.previewZoom));
      return;
    }
    this.previewZoomPersistTimer = window.setTimeout(() => {
      this.previewZoomPersistTimer = null;
      localStorage.setItem(this.previewZoomStorageKey, String(this.previewZoom));
    }, Math.max(0, Number(delayMs) || 0));
  }

  clampPreviewZoom(value) {
    const zoom = Number(value);
    if (!Number.isFinite(zoom)) return 1;
    return Math.max(0.5, Math.min(3, zoom));
  }

  setPreviewZoom(value, options = {}) {
    const zoom = this.clampPreviewZoom(value);
    const prevZoom = Number(this.previewZoom);
    const isSameZoom = Number.isFinite(prevZoom) && Math.abs(zoom - prevZoom) < 0.0001;
    this.previewZoom = zoom;
    if (this.previewZoomInput) {
      this.previewZoomInput.value = zoom.toFixed(2);
    }
    if (this.previewZoomValue) {
      this.previewZoomValue.textContent = `${Math.round(zoom * 100)}%`;
    }

    if (renderer && typeof renderer.setPreviewZoom === 'function') {
      renderer.setPreviewZoom(zoom);
      if (typeof renderer.reflowPreviewForZoom === 'function') {
        renderer.reflowPreviewForZoom(gameState.getCard());
      }
    } else if (this.previewContainer) {
      this.previewContainer.style.setProperty('--zoom-scale', String(zoom));
    }

    if (!isSameZoom && options.persist !== false && typeof localStorage !== 'undefined') {
      if (this.previewZoomPersistTimer !== null && typeof window !== 'undefined') {
        window.clearTimeout(this.previewZoomPersistTimer);
        this.previewZoomPersistTimer = null;
      }
      localStorage.setItem(this.previewZoomStorageKey, String(zoom));
    }
    this.setBoardPan(this.boardPan?.x || 0, this.boardPan?.y || 0, { persist: false });

    if (!isSameZoom) {
      if (options.scheduleRerender === true) {
        this.schedulePreviewRender(options.renderDebounceMs);
      } else if (options.rerender !== false) {
        this.queueRendererWork('full');
      }
    }
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
    if (cardType === 'Board Abilities') {
      updates['layers.cardBleed'] = false;
      updates['layers.imageFrame'] = false;
      updates['layers.attackModifier'] = false;
      updates['layers.secondAbilityFrame'] = false;
      updates['layers.topNameGradient'] = true;
      updates['layers.bottomNameGradient'] = false;
      updates['layers.cardId'] = false;
      updates['layers.costBadge'] = false;
      updates['layers.panelBleed'] = false;
      updates['layers.panelLower'] = false;
      updates['layers.panelUpper'] = true;
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
    const hasDeck = !!this.getSelectedDeck();
    if (this.deckSaveBtn) {
      this.deckSaveBtn.disabled = isBoardAbility && !hasDeck;
      this.deckSaveBtn.textContent = isBoardAbility ? 'Save Ability' : 'Save Card';
      this.deckSaveBtn.title = isBoardAbility
        ? (hasDeck
          ? 'Save this Board Ability to the selected deck.'
          : 'Select a deck to save this Board Ability.')
        : '';
    }
    if (this.deckLoadBtn) {
      this.deckLoadBtn.disabled = isBoardAbility;
      this.deckLoadBtn.title = isBoardAbility ? 'Board Abilities are assigned to board slots per selected deck.' : '';
    }
    if (this.deckDeleteCardBtn) {
      this.deckDeleteCardBtn.disabled = isBoardAbility;
      this.deckDeleteCardBtn.title = isBoardAbility ? 'Board Abilities are managed from Board mode for the selected deck.' : '';
    }
    if (this.deckCardSelect) {
      this.deckCardSelect.disabled = isBoardAbility;
      this.deckCardSelect.title = isBoardAbility ? 'Board Abilities are assigned to board slots instead of deck slots.' : '';
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

  getSelectedDeckId() {
    const raw = this.deckSelect ? this.deckSelect.value : '';
    return String(raw || '').trim();
  }

  getSelectedDeck() {
    const store = this.loadDeckStore();
    const deckId = this.getSelectedDeckId();
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
    if (this.normalizeCardTypeAndSubtypeState()) {
      card = gameState.getCard();
    }
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
    if (this.ensureRenderableCardLayerState()) {
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

    // Update image preview for the active creator context.
    card = this.syncArtControls(card);
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
      const renderWorkspaceMode = (this.workspaceMode === 'board' && this.boardCreatorMode === 'ability')
        ? 'card'
        : this.workspaceMode;
      renderer.setWorkspaceMode(renderWorkspaceMode);
    }
    if (typeof renderer?.setLeafletSide === 'function') {
      renderer.setLeafletSide(card.leafletSide);
    }
    renderer.render(card);
    this.queueRendererWork('costBadgePosition');
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
    const options = this.getSubtypeOptionsForCardType(cardType);
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
      this.filterSelectOptions(this.artSelect, this.artSearchInput ? this.artSearchInput.value : '', {
        keepValues: ['']
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
    this.filterSelectOptions(this.referenceSelect, this.referenceSearchInput ? this.referenceSearchInput.value : '', {
      keepValues: ['', '__upload__']
    });
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
    if (force) {
      gameState.updateProperties(updates);
      this.commitCoalescedStateUpdate('description-editor');
    } else {
      this.runCoalescedStateUpdate('description-editor', () => {
        gameState.updateProperties(updates);
      }, 650);
    }
    this.activeDescriptionId = activeId;
    this.queueRendererWork('description');
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
    const context = this.getTitleContext();
    const fallback = {
      text: card[context.nameKey] || '',
      position: card[context.positionKey] || context.defaultPosition
    };
    const rawBlocks = Array.isArray(card[context.blocksKey]) ? card[context.blocksKey] : [];
    if (rawBlocks.length) {
      return rawBlocks.map((block, idx) => (
        this.normalizeTitleBlock(block, idx === 0 ? fallback : null, `${context.isLeaflet ? 'leaflet-title' : 'title'}-${idx + 1}`)
      ));
    }
    return [this.normalizeTitleBlock({}, fallback, context.isLeaflet ? 'leaflet-title-1' : 'title-1')];
  }

  ensureTitleBlocks(card) {
    const context = this.getTitleContext();
    const rawBlocks = Array.isArray(card[context.blocksKey]) ? card[context.blocksKey] : [];
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
      const cardText = String(card[context.nameKey] || '').trim();
      const isPlaceholder = blockText.toLowerCase() === 'title';
      if ((isPlaceholder && cardText && cardText !== blockText) || (!blockText && cardText)) {
        needsNormalize = true;
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
    const activeBlock = resolvedActiveId
      ? normalized.find((block) => block.id === resolvedActiveId)
      : null;
    if (activeBlock) {
      if (card[context.nameKey] !== activeBlock.text) updates[context.nameKey] = activeBlock.text;
      const pos = activeBlock.position || { x: 0, y: 0 };
      if (!card[context.positionKey] || card[context.positionKey].x !== pos.x || card[context.positionKey].y !== pos.y) {
        updates[context.positionKey] = pos;
      }
    }
    if (Object.keys(updates).length > 0) {
      gameState.updateProperties(updates);
      return gameState.getCard();
    }
    return card;
  }

  getActiveTitleId(card, blocks) {
    const context = this.getTitleContext();
    const list = blocks && blocks.length ? blocks : this.getTitleBlocks(card);
    const activeId = card[context.activeIdKey];
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
    const context = this.getTitleContext();
    let card = gameState.getCard();
    card = this.ensureTitleBlocks(card);
    const blocks = this.getTitleBlocks(card);
    if (!blocks.length) return;
    const targetId = id && blocks.some((block) => block.id === id) ? id : blocks[0].id;
    const activeBlock = blocks.find((block) => block.id === targetId) || blocks[0];
    if (!activeBlock) return;

    if (card[context.activeIdKey] !== targetId) {
      gameState.updateProperties({
        [context.activeIdKey]: targetId,
        [context.nameKey]: activeBlock.text || '',
        [context.positionKey]: activeBlock.position || context.defaultPosition
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
    const context = this.getTitleContext();
    let card = gameState.getCard();
    card = this.ensureTitleBlocks(card);
    const blocks = this.getTitleBlocks(card);
    const newId = this.createTitleId();
    const newBlock = {
      id: newId,
      text: '',
      position: context.defaultPosition
    };
    const updatedBlocks = [...blocks, newBlock];
    gameState.updateProperties({
      [context.blocksKey]: updatedBlocks,
      [context.activeIdKey]: newId,
      [context.nameKey]: '',
      [context.positionKey]: context.defaultPosition
    });
    const updatedCard = gameState.getCard();
    this.activeTitleId = newId;
    this.updateTitleLayerActiveState(newId);
    if (this.cardNameInput) this.cardNameInput.value = '';
    this.queueRendererWork('title');
    if (this.cardNameInput) this.cardNameInput.focus();
  }

  removeActiveTitleBox() {
    const context = this.getTitleContext();
    let card = gameState.getCard();
    card = this.ensureTitleBlocks(card);
    const blocks = this.getTitleBlocks(card);
    if (!blocks.length) return;
    if (blocks.length === 1) {
      const onlyBlock = blocks[0];
      const clearedBlock = { ...onlyBlock, text: '' };
      gameState.updateProperties({
        [context.blocksKey]: [clearedBlock],
        [context.activeIdKey]: clearedBlock.id,
        [context.nameKey]: '',
        [context.positionKey]: clearedBlock.position || context.defaultPosition
      });
      const updatedCard = gameState.getCard();
      this.activeTitleId = clearedBlock.id;
      this.updateTitleLayerActiveState(clearedBlock.id);
      if (this.cardNameInput) this.cardNameInput.value = '';
      this.queueRendererWork('title');
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
      [context.blocksKey]: remainingBlocks,
      [context.activeIdKey]: nextBlock.id,
      [context.nameKey]: nextBlock.text || '',
      [context.positionKey]: nextBlock.position || context.defaultPosition
    });
    const updatedCard = gameState.getCard();
    this.activeTitleId = nextBlock.id;
    this.updateTitleLayerActiveState(nextBlock.id);
    if (this.cardNameInput) this.cardNameInput.value = String(nextBlock.text || '');
    this.queueRendererWork('title');
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
    this.queueRendererWork('description');
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
      this.queueRendererWork('description');
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
    this.queueRendererWork('description');
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

  normalizeBoardAbilityBucket(bucket) {
    const rawBucket = bucket && typeof bucket === 'object' ? bucket : {};
    const abilities = rawBucket.abilities && typeof rawBucket.abilities === 'object'
      ? rawBucket.abilities
      : {};
    const order = Array.isArray(rawBucket.order) ? rawBucket.order : [];
    return { abilities, order };
  }

  loadBoardAbilityStoragePayload() {
    try {
      const raw = localStorage.getItem(this.boardAbilityStorageKey);
      if (!raw) return { byDeck: {} };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return { byDeck: {} };
      return parsed;
    } catch (error) {
      console.warn('Failed to load board ability storage:', error);
      return { byDeck: {} };
    }
  }

  loadBoardAbilityStore(deckId = null) {
    const selectedDeckId = String(deckId || this.getSelectedDeckId() || '').trim();
    if (!selectedDeckId) return { abilities: {}, order: [] };
    const payload = this.loadBoardAbilityStoragePayload();
    const byDeck = payload.byDeck && typeof payload.byDeck === 'object' ? payload.byDeck : {};
    const deckBucket = byDeck[selectedDeckId];
    if (deckBucket && typeof deckBucket === 'object') {
      return this.normalizeBoardAbilityBucket(deckBucket);
    }
    return { abilities: {}, order: [] };
  }

  saveBoardAbilityStore(store, deckId = null) {
    const selectedDeckId = String(deckId || this.getSelectedDeckId() || '').trim();
    if (!selectedDeckId) return;
    const payload = this.loadBoardAbilityStoragePayload();
    const byDeck = payload.byDeck && typeof payload.byDeck === 'object' ? payload.byDeck : {};
    byDeck[selectedDeckId] = this.normalizeBoardAbilityBucket(store);
    try {
      localStorage.setItem(this.boardAbilityStorageKey, JSON.stringify({ byDeck }));
    } catch (error) {
      console.warn('Failed to save board ability storage:', error);
    }
  }

  removeBoardAbilityStoreForDeck(deckId = null) {
    const selectedDeckId = String(deckId || '').trim();
    if (!selectedDeckId) return;
    const payload = this.loadBoardAbilityStoragePayload();
    const byDeck = payload.byDeck && typeof payload.byDeck === 'object' ? payload.byDeck : {};
    if (!Object.prototype.hasOwnProperty.call(byDeck, selectedDeckId)) return;
    delete byDeck[selectedDeckId];
    try {
      localStorage.setItem(this.boardAbilityStorageKey, JSON.stringify({ byDeck }));
    } catch (error) {
      console.warn('Failed to update board ability storage:', error);
    }
  }

  getStoredBoardLayerVisibility() {
    const fallback = {
      workingArea: true,
      abilityPadding: true,
      abilityBoundary: true
    };
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(this.boardLayerVisibilityStorageKey);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return fallback;
      return {
        workingArea: parsed.workingArea !== false,
        abilityPadding: parsed.abilityPadding !== false,
        abilityBoundary: parsed.abilityBoundary !== false
      };
    } catch (error) {
      console.warn('Failed to load board layer visibility:', error);
      return fallback;
    }
  }

  saveBoardLayerVisibility(visibility = this.boardLayerVisibility) {
    if (typeof localStorage === 'undefined') return;
    const payload = {
      workingArea: visibility?.workingArea !== false,
      abilityPadding: visibility?.abilityPadding !== false,
      abilityBoundary: visibility?.abilityBoundary !== false
    };
    try {
      localStorage.setItem(this.boardLayerVisibilityStorageKey, JSON.stringify(payload));
    } catch (error) {
      console.warn('Failed to save board layer visibility:', error);
    }
  }

  applyBoardLayerVisibility(visibility = this.boardLayerVisibility, options = {}) {
    this.boardLayerVisibility = {
      workingArea: visibility?.workingArea !== false,
      abilityPadding: visibility?.abilityPadding !== false,
      abilityBoundary: visibility?.abilityBoundary !== false
    };

    if (this.boardLayerWorkingArea) this.boardLayerWorkingArea.checked = this.boardLayerVisibility.workingArea;
    if (this.boardLayerAbilityPadding) this.boardLayerAbilityPadding.checked = this.boardLayerVisibility.abilityPadding;
    if (this.boardLayerAbilityBoundary) this.boardLayerAbilityBoundary.checked = this.boardLayerVisibility.abilityBoundary;

    if (typeof renderer?.updateBoardLayerVisibility === 'function') {
      renderer.updateBoardLayerVisibility(this.boardLayerVisibility);
    }

    if (options.persist !== false) {
      this.saveBoardLayerVisibility(this.boardLayerVisibility);
    }

    return this.boardLayerVisibility;
  }

  clampBoardPanAxis(value, maxAbs = 0) {
    const next = Number(value);
    const limit = Math.max(0, Number(maxAbs) || 0);
    if (!Number.isFinite(next)) return 0;
    if (!limit) return 0;
    return Math.max(-limit, Math.min(limit, next));
  }

  getBoardPanBounds() {
    const fallback = { maxX: 0, maxY: 0 };
    if (!this.boardPreviewElement) return fallback;

    let width = this.boardPreviewElement.clientWidth || 0;
    let height = this.boardPreviewElement.clientHeight || 0;

    if ((!width || !height) && this.previewContainer) {
      const styles = getComputedStyle(this.previewContainer);
      const boardWidth = parseFloat(styles.getPropertyValue('--board-width')) || 0;
      const boardHeight = parseFloat(styles.getPropertyValue('--board-height')) || 0;
      const zoomScale = parseFloat(styles.getPropertyValue('--zoom-scale')) || 1;
      const boardScale = parseFloat(styles.getPropertyValue('--board-scale')) || 1;
      width = boardWidth * zoomScale * boardScale;
      height = boardHeight * zoomScale * boardScale;
    }

    return {
      maxX: Math.max(0, width * 0.45),
      maxY: Math.max(0, height * 0.45)
    };
  }

  saveBoardPan(pan = this.boardPan) {
    if (typeof localStorage === 'undefined') return;
    const x = Number(pan?.x);
    const y = Number(pan?.y);
    const payload = {
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0
    };
    try {
      localStorage.setItem(this.boardPanStorageKey, JSON.stringify(payload));
    } catch (error) {
      console.warn('Failed to save board pan state:', error);
    }
  }

  setBoardPan(x, y, options = {}) {
    const bounds = this.getBoardPanBounds();
    const nextX = this.clampBoardPanAxis(x, bounds.maxX);
    const nextY = this.clampBoardPanAxis(y, bounds.maxY);
    this.boardPan = { x: nextX, y: nextY };

    if (this.boardPreviewElement) {
      this.boardPreviewElement.style.setProperty('--board-pan-x', `${nextX}px`);
      this.boardPreviewElement.style.setProperty('--board-pan-y', `${nextY}px`);
    }

    if (options.persist !== false) {
      this.saveBoardPan(this.boardPan);
    }

    return this.boardPan;
  }

  initBoardPanControls() {
    if (!this.boardPreviewElement || this.boardPanControlsInitialized) return;
    this.boardPanControlsInitialized = true;

    const previewEl = this.boardPreviewElement;
    const finishDrag = (pointerId = null) => {
      const drag = this.boardPanDrag;
      if (!drag) return;
      if (pointerId !== null && pointerId !== undefined && drag.pointerId !== pointerId) return;

      this.boardPanDrag = null;
      previewEl.classList.remove('is-dragging');

      if (typeof previewEl.hasPointerCapture === 'function'
        && typeof previewEl.releasePointerCapture === 'function') {
        try {
          if (previewEl.hasPointerCapture(drag.pointerId)) {
            previewEl.releasePointerCapture(drag.pointerId);
          }
        } catch (error) {
          // Ignore pointer capture release failures.
        }
      }

      if (drag.moved) {
        this.saveBoardPan(this.boardPan);
      }
    };

    previewEl.addEventListener('pointerdown', (event) => {
      if (String(this.workspaceMode || '').toLowerCase() !== 'board') return;
      if (event.button !== 0) return;

      const target = event.target instanceof Element ? event.target : null;
      if (target && target.closest('input, textarea, select, button, a, label')) return;

      this.boardPanDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPan: {
          x: Number(this.boardPan?.x) || 0,
          y: Number(this.boardPan?.y) || 0
        },
        moved: false
      };
      previewEl.classList.add('is-dragging');

      if (typeof previewEl.setPointerCapture === 'function') {
        try {
          previewEl.setPointerCapture(event.pointerId);
        } catch (error) {
          // Ignore pointer capture failures.
        }
      }

      event.preventDefault();
    });

    previewEl.addEventListener('pointermove', (event) => {
      const drag = this.boardPanDrag;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1) {
        drag.moved = true;
      }

      this.setBoardPan(drag.startPan.x + dx, drag.startPan.y + dy, { persist: false });
      event.preventDefault();
    });

    previewEl.addEventListener('pointerup', (event) => finishDrag(event.pointerId));
    previewEl.addEventListener('pointercancel', (event) => finishDrag(event.pointerId));
    previewEl.addEventListener('lostpointercapture', (event) => finishDrag(event.pointerId));
    previewEl.addEventListener('dblclick', (event) => {
      if (String(this.workspaceMode || '').toLowerCase() !== 'board') return;
      this.setBoardPan(0, 0, { persist: true });
      event.preventDefault();
    });
  }

  getBoardPlacementGrid() {
    const boardWidth = Number(renderer?.boardBaseSize?.width) || 4408;
    const boardHeight = Number(renderer?.boardBaseSize?.height) || 2683;
    const cardWidth = 687;
    const cardHeight = 1041;
    const paddingX = 26;
    const paddingY = 541;
    const horizontalGap = 30;
    const verticalGap = 35;
    const standardToUltimateGap = 55;
    const rightPairLeft = boardWidth - paddingX - (cardWidth * 2) - horizontalGap;
    const leftPairRight = paddingX + (cardWidth * 2) + horizontalGap;
    const ultimateWidth = Math.max(1, rightPairLeft - leftPairRight - (standardToUltimateGap * 2));
    const ultimateHeight = Math.round(ultimateWidth * (2116 / 1410));
    const ultimateX = leftPairRight + standardToUltimateGap;
    const ultimateY = Math.max(0, boardHeight - paddingX - ultimateHeight);
    return {
      boardWidth,
      boardHeight,
      cardWidth,
      cardHeight,
      ultimateWidth,
      ultimateHeight,
      ultimateX,
      ultimateY,
      ultimateMinX: 0,
      ultimateMaxX: Math.max(0, boardWidth - ultimateWidth),
      xPositions: [
        paddingX,
        paddingX + cardWidth + horizontalGap,
        rightPairLeft,
        rightPairLeft + cardWidth + horizontalGap
      ],
      yPositions: [
        paddingY,
        paddingY + cardHeight + verticalGap
      ]
    };
  }

  isUltimateBoardAbilityEntry(entry = null) {
    return String(entry?.subType || entry?.cardSubType || '').trim() === 'Ultimate Ability';
  }

  isUltimatePlacement(placement = null, entry = null) {
    return placement?.kind === 'ultimate' || this.isUltimateBoardAbilityEntry(entry);
  }

  clampBoardPlacementX(value, min, max) {
    const raw = Number(value);
    const low = Number.isFinite(Number(min)) ? Number(min) : 0;
    const high = Number.isFinite(Number(max)) ? Math.max(low, Number(max)) : low;
    if (!Number.isFinite(raw)) return low;
    return Math.max(low, Math.min(high, raw));
  }

  normalizeBoardPlacementPosition(x, y, entry = null, placement = null) {
    const grid = this.getBoardPlacementGrid();
    if (this.isUltimatePlacement(placement, entry)) {
      return {
        x: Math.round(this.clampBoardPlacementX(
          Number.isFinite(Number(x)) ? Number(x) : grid.ultimateX,
          grid.ultimateMinX,
          grid.ultimateMaxX
        )),
        y: grid.ultimateY
      };
    }
    const nearest = (value, positions) => positions.reduce((best, current) => (
      Math.abs(current - value) < Math.abs(best - value) ? current : best
    ), positions[0] || 0);
    return {
      x: nearest(Number(x) || 0, grid.xPositions),
      y: nearest(Number(y) || 0, grid.yPositions)
    };
  }

  snapBoardPlacementPosition(x, y) {
    return this.normalizeBoardPlacementPosition(x, y);
  }

  getBoardPlacementMetrics(entry = null) {
    const grid = this.getBoardPlacementGrid();
    if (this.isUltimateBoardAbilityEntry(entry)) {
      return {
        width: grid.ultimateWidth,
        height: grid.ultimateHeight
      };
    }
    return {
      width: grid.cardWidth,
      height: grid.cardHeight
    };
  }

  getBoardPlacementStyle(position = {}, entry = null) {
    const grid = this.getBoardPlacementGrid();
    const snapped = this.normalizeBoardPlacementPosition(position.x, position.y, entry, position);
    const metrics = this.getBoardPlacementMetrics(entry);
    return {
      left: `${(snapped.x / grid.boardWidth) * 100}%`,
      top: `${(snapped.y / grid.boardHeight) * 100}%`,
      width: `${(metrics.width / grid.boardWidth) * 100}%`,
      height: `${(metrics.height / grid.boardHeight) * 100}%`
    };
  }

  getStoredBoardPlacements(deckId = null) {
    const selectedDeckId = String(deckId || this.getSelectedDeckId() || '').trim();
    if (!selectedDeckId || typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.boardPlacementStorageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const byDeck = parsed && typeof parsed === 'object' && parsed.byDeck && typeof parsed.byDeck === 'object'
        ? parsed.byDeck
        : {};
      const placements = byDeck[selectedDeckId];
      if (!Array.isArray(placements)) return [];
      return placements
        .map((placement) => {
          if (!placement || typeof placement !== 'object') return null;
          const id = String(placement.id || '').trim();
          const abilityId = String(placement.abilityId || '').trim();
          if (!id || !abilityId) return null;
          const x = Number(placement.x);
          const y = Number(placement.y);
          const kind = String(placement.kind || '').trim();
          return {
            id,
            abilityId,
            x: Number.isFinite(x) ? x : 0,
            y: Number.isFinite(y) ? y : 0,
            ...(kind ? { kind } : {})
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.warn('Failed to load board placements:', error);
      return [];
    }
  }

  saveBoardPlacements(placements = [], deckId = null) {
    const selectedDeckId = String(deckId || this.getSelectedDeckId() || '').trim();
    if (!selectedDeckId || typeof localStorage === 'undefined') return;
    const normalized = (Array.isArray(placements) ? placements : [])
      .map((placement) => {
        if (!placement || typeof placement !== 'object') return null;
        const id = String(placement.id || '').trim();
        const abilityId = String(placement.abilityId || '').trim();
        if (!id || !abilityId) return null;
        const x = Number(placement.x);
        const y = Number(placement.y);
        const kind = String(placement.kind || '').trim();
        return {
          id,
          abilityId,
          x: Number.isFinite(x) ? x : 0,
          y: Number.isFinite(y) ? y : 0,
          ...(kind ? { kind } : {})
        };
      })
      .filter(Boolean);
    try {
      const raw = localStorage.getItem(this.boardPlacementStorageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      const byDeck = parsed && typeof parsed === 'object' && parsed.byDeck && typeof parsed.byDeck === 'object'
        ? parsed.byDeck
        : {};
      byDeck[selectedDeckId] = normalized;
      localStorage.setItem(this.boardPlacementStorageKey, JSON.stringify({ byDeck }));
    } catch (error) {
      console.warn('Failed to save board placements:', error);
    }
  }

  removeBoardPlacementsForDeck(deckId = null) {
    const selectedDeckId = String(deckId || '').trim();
    if (!selectedDeckId || typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.boardPlacementStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const byDeck = parsed && typeof parsed === 'object' && parsed.byDeck && typeof parsed.byDeck === 'object'
        ? parsed.byDeck
        : {};
      if (!Object.prototype.hasOwnProperty.call(byDeck, selectedDeckId)) return;
      delete byDeck[selectedDeckId];
      localStorage.setItem(this.boardPlacementStorageKey, JSON.stringify({ byDeck }));
    } catch (error) {
      console.warn('Failed to update board placements:', error);
    }
  }

  getBoardAbilityEntries(deckId = null) {
    const selectedDeckId = String(deckId || this.getSelectedDeckId() || '').trim();
    if (!selectedDeckId) return [];
    const store = this.loadBoardAbilityStore(selectedDeckId);
    const abilities = store.abilities && typeof store.abilities === 'object' ? store.abilities : {};
    const order = Array.isArray(store.order) ? store.order : [];
    return order.map((id) => abilities[id]).filter(Boolean);
  }

  getNextBoardPlacementPosition(placements = [], entry = null) {
    const grid = this.getBoardPlacementGrid();
    if (this.isUltimateBoardAbilityEntry(entry)) {
      return { x: grid.ultimateX, y: grid.ultimateY };
    }
    const occupied = new Set((Array.isArray(placements) ? placements : []).map((placement) => (
      `${Number(placement?.x) || 0},${Number(placement?.y) || 0}`
    )));
    for (const y of grid.yPositions) {
      for (const x of grid.xPositions) {
        const key = `${x},${y}`;
        if (!occupied.has(key)) return { x, y };
      }
    }
    return { x: grid.xPositions[0] || 0, y: grid.yPositions[0] || 0 };
  }

  applyBoardPlacementElementPosition(element, placement, entry = null) {
    if (!element) return;
    const style = this.getBoardPlacementStyle(placement, entry);
    element.style.left = style.left;
    element.style.top = style.top;
    element.style.width = style.width;
    element.style.height = style.height;
  }

  async renderBoardAbilityImage(entry) {
    if (!entry) return '';
    try {
      const cardData = this.buildCardFromJson(entry.json);
      if (!cardData.name || cardData.name === 'Title') {
        cardData.name = entry.name || 'Board Ability';
      }
      const metrics = this.getBoardPlacementMetrics(entry);
      const canvas = await renderer.renderCardToCanvas(cardData, {
        width: metrics.width,
        height: metrics.height,
        includeBleed: false,
        usePreviewMetrics: false,
        fitMode: 'contain',
        trimTransparent: true,
        trimAlphaThreshold: 1,
        cropToBleedBounds: true
      });
      if (!canvas) return '';
      const output = renderer.trimTransparentCanvas(canvas, 1) || canvas;
      const imageInfo = await this.canvasToImageUrl(output, false);
      return this.scaleDeckCardDataUrl(imageInfo.value, metrics.width, metrics.height, 'cover', 1, true);
    } catch (error) {
      console.warn('Failed to render board ability preview:', error);
      return '';
    }
  }

  renderBoardPlacementList(placements = [], abilities = {}) {
    if (!this.boardPlacementList) return;
    this.boardPlacementList.replaceChildren();
    const deckId = this.getSelectedDeckId();
    if (!deckId) {
      const empty = document.createElement('div');
      empty.className = 'board-placement-empty';
      empty.textContent = 'Select a deck to place abilities.';
      this.boardPlacementList.appendChild(empty);
      return;
    }
    if (!placements.length) {
      const empty = document.createElement('div');
      empty.className = 'board-placement-empty';
      empty.textContent = 'No abilities placed yet.';
      this.boardPlacementList.appendChild(empty);
      return;
    }
    placements.forEach((placement, index) => {
      const entry = abilities[placement.abilityId] || null;
      const row = document.createElement('div');
      row.className = 'board-placement-row';
      row.dataset.placementId = placement.id;

      const name = document.createElement('span');
      name.className = 'board-placement-row__name';
      name.textContent = entry
        ? `${index + 1}. ${entry.name}${entry.subType ? ` (${entry.subType})` : ''}`
        : `${index + 1}. Missing ability`;
      row.appendChild(name);

      const loadBtn = document.createElement('button');
      loadBtn.type = 'button';
      loadBtn.className = 'btn btn-secondary btn-small';
      loadBtn.textContent = 'Load';
      loadBtn.disabled = !entry;
      loadBtn.addEventListener('click', () => {
        if (!entry) return;
        if (gameState.fromJSON(entry.json)) {
          this.updateUI();
          this.applyWorkspaceMode('board');
          this.queueRendererWork('full');
        }
      });
      row.appendChild(loadBtn);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-secondary btn-small';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => this.removeBoardAbilityPlacement(placement.id));
      row.appendChild(removeBtn);

      this.boardPlacementList.appendChild(row);
    });
  }

  startBoardPlacementDrag(event, placementEl) {
    if (!this.boardSlotsLayer || !placementEl || event.button !== 0) return;
    const deckId = this.getSelectedDeckId();
    if (!deckId) return;
    const placementId = String(placementEl.dataset.placementId || '').trim();
    if (!placementId) return;
    const abilityId = String(placementEl.dataset.abilityId || '').trim();
    const entry = abilityId
      ? this.getBoardAbilityEntries(deckId).find((item) => item.id === abilityId)
      : null;

    const layerRect = this.boardSlotsLayer.getBoundingClientRect();
    const elementRect = placementEl.getBoundingClientRect();
    const grid = this.getBoardPlacementGrid();
    const scaleX = layerRect.width / grid.boardWidth || 1;
    const scaleY = layerRect.height / grid.boardHeight || 1;

    this.boardPlacementDrag = {
      pointerId: event.pointerId,
      placementId,
      abilityId,
      deckId,
      isUltimate: this.isUltimateBoardAbilityEntry(entry),
      offsetX: (event.clientX - elementRect.left) / scaleX,
      offsetY: (event.clientY - elementRect.top) / scaleY,
      moved: false
    };
    placementEl.classList.add('is-dragging');
    if (typeof placementEl.setPointerCapture === 'function') {
      try {
        placementEl.setPointerCapture(event.pointerId);
      } catch (error) {
        // Ignore pointer capture failures.
      }
    }
    event.preventDefault();
    event.stopPropagation();
  }

  updateBoardPlacementDrag(event, placementEl) {
    const drag = this.boardPlacementDrag;
    if (!drag || drag.pointerId !== event.pointerId || !this.boardSlotsLayer || !placementEl) return;

    const layerRect = this.boardSlotsLayer.getBoundingClientRect();
    const grid = this.getBoardPlacementGrid();
    const scaleX = layerRect.width / grid.boardWidth || 1;
    const scaleY = layerRect.height / grid.boardHeight || 1;
    const rawX = ((event.clientX - layerRect.left) / scaleX) - drag.offsetX;
    const rawY = ((event.clientY - layerRect.top) / scaleY) - drag.offsetY;
    const entry = drag.abilityId
      ? this.getBoardAbilityEntries(drag.deckId).find((item) => item.id === drag.abilityId)
      : null;
    const snapped = this.normalizeBoardPlacementPosition(rawX, rawY, entry, drag.isUltimate ? { kind: 'ultimate' } : null);
    this.applyBoardPlacementElementPosition(placementEl, snapped, entry);
    drag.nextPosition = snapped;
    drag.moved = true;
    event.preventDefault();
    event.stopPropagation();
  }

  finishBoardPlacementDrag(event, placementEl) {
    const drag = this.boardPlacementDrag;
    if (!drag || (event && drag.pointerId !== event.pointerId)) return;
    this.boardPlacementDrag = null;
    if (placementEl) {
      placementEl.classList.remove('is-dragging');
      if (typeof placementEl.hasPointerCapture === 'function'
        && typeof placementEl.releasePointerCapture === 'function') {
        try {
          if (placementEl.hasPointerCapture(drag.pointerId)) {
            placementEl.releasePointerCapture(drag.pointerId);
          }
        } catch (error) {
          // Ignore pointer capture release failures.
        }
      }
    }
    if (drag.nextPosition) {
      const placements = this.getStoredBoardPlacements(drag.deckId).map((placement) => (
        placement.id === drag.placementId
          ? {
            ...placement,
            x: drag.nextPosition.x,
            y: drag.nextPosition.y,
            ...(drag.isUltimate ? { kind: 'ultimate' } : {})
          }
          : placement
      ));
      this.saveBoardPlacements(placements, drag.deckId);
      this.renderBoardPlacementList(
        placements,
        this.getBoardAbilityEntries(drag.deckId).reduce((map, entry) => {
          map[entry.id] = entry;
          return map;
        }, {})
      );
    }
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  async renderBoardAbilityPlacements() {
    if (!this.boardSlotsLayer) return;
    const renderToken = ++this.boardPlacementRenderToken;
    const deckId = this.getSelectedDeckId();
    const entries = this.getBoardAbilityEntries(deckId);
    const abilities = entries.reduce((map, entry) => {
      map[entry.id] = entry;
      return map;
    }, {});
    const placements = this.getStoredBoardPlacements(deckId)
      .filter((placement) => abilities[placement.abilityId])
      .map((placement) => {
        const entry = abilities[placement.abilityId];
        const normalized = this.normalizeBoardPlacementPosition(placement.x, placement.y, entry, placement);
        return {
          ...placement,
          ...normalized,
          ...(this.isUltimateBoardAbilityEntry(entry) ? { kind: 'ultimate' } : {})
        };
      });

    if (deckId) this.saveBoardPlacements(placements, deckId);
    this.boardSlotsLayer.replaceChildren();
    this.renderBoardPlacementList(placements, abilities);

    if (!deckId || !placements.length) return;
    await this.ensureDeckDefaultCard();
    if (renderToken !== this.boardPlacementRenderToken) return;

    for (const placement of placements) {
      if (renderToken !== this.boardPlacementRenderToken) return;
      const entry = abilities[placement.abilityId];
      const placementEl = document.createElement('div');
      placementEl.className = 'board-slot-card board-slot-card--placement is-empty';
      placementEl.classList.toggle('board-slot-card--ultimate', this.isUltimateBoardAbilityEntry(entry));
      placementEl.dataset.placementId = placement.id;
      placementEl.dataset.abilityId = placement.abilityId;
      if (this.isUltimateBoardAbilityEntry(entry)) placementEl.dataset.placementKind = 'ultimate';
      this.applyBoardPlacementElementPosition(placementEl, placement, entry);
      this.setBoardSlotCardContent(placementEl, placement.id, entry, '');
      placementEl.addEventListener('pointerdown', (event) => this.startBoardPlacementDrag(event, placementEl));
      placementEl.addEventListener('pointermove', (event) => this.updateBoardPlacementDrag(event, placementEl));
      placementEl.addEventListener('pointerup', (event) => this.finishBoardPlacementDrag(event, placementEl));
      placementEl.addEventListener('pointercancel', (event) => this.finishBoardPlacementDrag(event, placementEl));
      placementEl.addEventListener('lostpointercapture', (event) => this.finishBoardPlacementDrag(event, placementEl));
      this.boardSlotsLayer.appendChild(placementEl);

      const imageSrc = await this.renderBoardAbilityImage(entry);
      if (renderToken !== this.boardPlacementRenderToken) return;
      this.setBoardSlotCardContent(placementEl, placement.id, entry, imageSrc);
    }
  }

  addBoardAbilityPlacement(abilityId = '') {
    const deckId = this.getSelectedDeckId();
    if (!deckId) {
      this.showToast('Select a deck before placing Board Abilities.', { force: true, duration: 2600 });
      return;
    }
    const id = String(abilityId || '').trim();
    if (!id) {
      this.showToast('Select a saved Board Ability to add.', { force: true, duration: 2400 });
      return;
    }
    const entries = this.getBoardAbilityEntries(deckId);
    const entry = entries.find((item) => item.id === id);
    if (!entry) {
      this.showToast('That Board Ability is no longer available.', { force: true, duration: 2600 });
      this.refreshBoardAbilityOptions();
      return;
    }
    let placements = this.getStoredBoardPlacements(deckId);
    if (this.isUltimateBoardAbilityEntry(entry)) {
      const byId = entries.reduce((map, item) => {
        map[item.id] = item;
        return map;
      }, {});
      placements = placements.filter((placement) => !this.isUltimateBoardAbilityEntry(byId[placement.abilityId]));
    }
    const position = this.getNextBoardPlacementPosition(placements, entry);
    placements.push({
      id: `board_place_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      abilityId: id,
      x: position.x,
      y: position.y,
      ...(this.isUltimateBoardAbilityEntry(entry) ? { kind: 'ultimate' } : {})
    });
    this.saveBoardPlacements(placements, deckId);
    this.renderBoardAbilityPlacements();
  }

  async addCurrentBoardAbilityToBoard() {
    this.activateBoardAbilityCreator();
    const entry = await this.saveBoardAbility(gameState.getCard());
    if (!entry || !entry.id) return;
    this.addBoardAbilityPlacement(entry.id);
  }

  removeBoardAbilityPlacement(placementId = '') {
    const deckId = this.getSelectedDeckId();
    const id = String(placementId || '').trim();
    if (!deckId || !id) return;
    const placements = this.getStoredBoardPlacements(deckId).filter((placement) => placement.id !== id);
    this.saveBoardPlacements(placements, deckId);
    this.renderBoardAbilityPlacements();
  }

  activateBoardAbilityCreator() {
    const card = gameState.getCard();
    const subtypeOptions = this.getSubtypeOptionsForCardType('Board Abilities');
    const nextSubtype = subtypeOptions.includes(String(card?.cardSubType || ''))
      ? card.cardSubType
      : (subtypeOptions[0] || 'Offensive ability');
    const updates = {};
    if (card.cardType !== 'Board Abilities') updates.cardType = 'Board Abilities';
    if (card.cardSubType !== nextSubtype) updates.cardSubType = nextSubtype;
    if (Object.keys(updates).length) {
      gameState.updateProperties(updates);
    }
    if (this.cardTypeSelect) this.cardTypeSelect.value = 'Board Abilities';
    this.updateSubTypeLabel('Board Abilities');
    this.updateSubTypeOptions('Board Abilities', nextSubtype, false);
    renderer.applyAssetsForCardType('Board Abilities', nextSubtype);
    this.applyLayerPresetForCard('Board Abilities', nextSubtype);
    this.updateDeckSaveAvailability(gameState.getCard());
  }

  copyBoardAbilityToHeroCard() {
    const source = this.ensureDescriptionBlocks(this.ensureTitleBlocks(gameState.getCard()));
    const heroCard = deepCloneUI(source);
    heroCard.cardType = 'Hero Upgrade';
    heroCard.cardSubType = 'Ability Upgrade';
    heroCard.cardId = '';
    heroCard.artData = source.boardAbilityArtData || null;
    heroCard.artUrl = source.boardAbilityArtUrl || null;
    heroCard.artSourceData = source.boardAbilityArtSourceData || null;
    heroCard.artSourceUrl = source.boardAbilityArtSourceUrl || null;
    heroCard.artCropTransform = source.boardAbilityArtCropTransform || null;
    heroCard.artTransform = source.boardAbilityArtTransform || { x: 0, y: 0, scale: 1 };
    heroCard.artCropToFrame = source.boardAbilityArtCropToFrame === true;
    heroCard.artWasCropped = source.boardAbilityArtWasCropped === true;
    heroCard.export = {
      ...(heroCard.export && typeof heroCard.export === 'object' ? heroCard.export : {}),
      includeBleed: true
    };
    heroCard.layers = {
      ...(heroCard.layers && typeof heroCard.layers === 'object' ? heroCard.layers : {}),
      cardBleed: false,
      imageFrame: false,
      attackModifier: false,
      secondAbilityFrame: true,
      topNameGradient: true,
      bottomNameGradient: true,
      cardId: true,
      costBadge: true,
      panelBleed: true,
      panelLower: true,
      panelUpper: true
    };
    if (gameState.fromJSON(JSON.stringify(heroCard, null, 2))) {
      this.applyWorkspaceMode('card');
      this.applyLayerPresetForCard('Hero Upgrade', 'Ability Upgrade');
      this.updateUI();
      renderer.applyAssetsForCardType('Hero Upgrade', 'Ability Upgrade');
      this.scheduleRenderWarmup({ immediate: true });
      this.showToast('Copied Board Ability into a Hero Ability Upgrade card.', { force: true, duration: 2800 });
    }
  }

  getStoredBoardSlotAssignments(deckId = null) {
    const fallback = Array.from({ length: this.boardSlotSelects.length }, () => '');
    const selectedDeckId = String(deckId || this.getSelectedDeckId() || '').trim();
    if (!selectedDeckId) return fallback;
    try {
      const raw = localStorage.getItem(this.boardSlotStorageKey);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const byDeck = parsed && typeof parsed === 'object' && parsed.byDeck && typeof parsed.byDeck === 'object'
        ? parsed.byDeck
        : {};
      const deckValues = byDeck[selectedDeckId];
      if (!Array.isArray(deckValues)) return fallback;
      return fallback.map((_, index) => String(deckValues[index] || ''));
    } catch (error) {
      console.warn('Failed to load board slot assignments:', error);
      return fallback;
    }
  }

  saveBoardSlotAssignments(values = [], deckId = null) {
    const selectedDeckId = String(deckId || this.getSelectedDeckId() || '').trim();
    if (!selectedDeckId) return;
    const normalized = Array.from({ length: this.boardSlotSelects.length }, (_, index) => String(values[index] || ''));
    try {
      const raw = localStorage.getItem(this.boardSlotStorageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      const byDeck = parsed && typeof parsed === 'object' && parsed.byDeck && typeof parsed.byDeck === 'object'
        ? parsed.byDeck
        : {};
      byDeck[selectedDeckId] = normalized;
      localStorage.setItem(this.boardSlotStorageKey, JSON.stringify({ byDeck }));
    } catch (error) {
      console.warn('Failed to save board slot assignments:', error);
    }
  }

  removeBoardSlotAssignmentsForDeck(deckId = null) {
    const selectedDeckId = String(deckId || '').trim();
    if (!selectedDeckId) return;
    try {
      const raw = localStorage.getItem(this.boardSlotStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const byDeck = parsed && typeof parsed === 'object' && parsed.byDeck && typeof parsed.byDeck === 'object'
        ? parsed.byDeck
        : {};
      if (!Object.prototype.hasOwnProperty.call(byDeck, selectedDeckId)) return;
      delete byDeck[selectedDeckId];
      localStorage.setItem(this.boardSlotStorageKey, JSON.stringify({ byDeck }));
    } catch (error) {
      console.warn('Failed to update board slot assignments:', error);
    }
  }

  refreshBoardAbilityOptions() {
    const deckId = this.getSelectedDeckId();
    const hasDeck = !!deckId;
    const abilities = hasDeck ? this.getBoardAbilityEntries(deckId) : [];
    const storedSelections = this.getStoredBoardSlotAssignments(deckId);

    this.boardSlotSelects.forEach((selectEl, index) => {
      if (!selectEl) return;
      const currentValue = hasDeck ? String(selectEl.value || storedSelections[index] || '') : '';
      selectEl.innerHTML = '';
      selectEl.disabled = !hasDeck;

      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = hasDeck ? 'Unassigned' : 'No deck selected';
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

    if (hasDeck) {
      this.saveBoardSlotAssignments(this.boardSlotSelects.map((selectEl) => (selectEl ? selectEl.value : '')), deckId);
    }

    if (this.boardPlacementSelect) {
      const currentValue = hasDeck ? String(this.boardPlacementSelect.value || '') : '';
      this.boardPlacementSelect.innerHTML = '';
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = hasDeck
        ? (abilities.length ? 'Select saved ability' : 'No saved abilities')
        : 'No deck selected';
      this.boardPlacementSelect.appendChild(emptyOption);
      abilities.forEach((entry) => {
        const option = document.createElement('option');
        option.value = entry.id;
        option.textContent = entry.subType
          ? `${entry.name} (${entry.subType})`
          : entry.name;
        this.boardPlacementSelect.appendChild(option);
      });
      this.boardPlacementSelect.disabled = !hasDeck || !abilities.length;
      this.boardPlacementSelect.value = abilities.some((entry) => entry.id === currentValue) ? currentValue : '';
    }
    if (this.boardPlacementAddBtn) {
      this.boardPlacementAddBtn.disabled = !hasDeck || !abilities.length;
    }
    if (this.boardAddCurrentAbilityBtn) {
      this.boardAddCurrentAbilityBtn.disabled = !hasDeck;
      this.boardAddCurrentAbilityBtn.title = hasDeck
        ? 'Save and place the current Board Ability.'
        : 'Select a deck before placing abilities.';
    }
    this.renderBoardAbilityPlacements();
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
    if (!this.boardSlotCards.length) {
      await this.renderBoardAbilityPlacements();
      return;
    }
    const renderToken = ++this.boardSlotRenderToken;
    const deckId = this.getSelectedDeckId();
    const store = this.loadBoardAbilityStore();
    const abilities = store.abilities && typeof store.abilities === 'object' ? store.abilities : {};
    const assignments = this.getStoredBoardSlotAssignments(deckId);
    const slotMap = new Map(this.boardSlotCards.map((node) => [String(node.dataset.slotId || ''), node]));

    this.boardSlotCards.forEach((slotEl) => {
      const slotId = String(slotEl.dataset.slotId || '');
      this.setBoardSlotCardContent(slotEl, slotId || '?', null, '');
    });
    if (!deckId) return;

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
        const canvas = await renderer.renderCardToCanvas(cardData, {
          width: Number(DTC_UI_EXPORT_SIZE.width) || 675,
          height: Number(DTC_UI_EXPORT_SIZE.height) || 1050,
          includeBleed: false,
          usePreviewMetrics: false,
          fitMode: 'contain',
          trimTransparent: true,
          trimAlphaThreshold: 1,
          cropToBleedBounds: true
        });
        if (canvas) {
          const output = renderer.trimTransparentCanvas(canvas, 1) || canvas;
          const imageInfo = await this.canvasToImageUrl(output, false);
          imageSrc = imageInfo.value;
          imageSrc = await this.scaleDeckCardDataUrl(imageSrc, 687, 1041, 'cover', 1, true);
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
    const deckId = this.getSelectedDeckId();
    const deck = deckId ? store.decks[deckId] : null;
    this.deckCardSelect.innerHTML = '';
    if (!deck || !Array.isArray(deck.cards)) {
      this.refreshBoardAbilityOptions();
      return;
    }
    deck.cards.forEach((card) => {
      const option = document.createElement('option');
      option.value = card.id;
      option.textContent = card.name || `Card ${card.id}`;
      this.deckCardSelect.appendChild(option);
    });
    this.refreshBoardAbilityOptions();
    this.scheduleRenderWarmup({ immediate: false });
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
    this.closeActionsMenu();
    this.deckViewModal.classList.add('is-open');
    this.scheduleRenderWarmup({ immediate: true });
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
    this.closeActionsMenu();
    this.printSheetModal.classList.add('is-open');
    this.printSheetModal.setAttribute('aria-hidden', 'false');
    this.scheduleRenderWarmup({ immediate: true });
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
          leafletCommand: `{{${key},leaflet}}`,
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
    this.queueRendererWork('full');
  }

  removeAbilityDiceEntry(slot) {
    const safeSlot = String(slot || '').toUpperCase();
    let card = gameState.getCard();
    const current = this.getAbilityDiceEntries(card);
    const updated = current.filter((entry) => entry.slot !== safeSlot);
    gameState.updateProperty('abilityDiceEntries', updated);
    card = gameState.getCard();
    this.renderAbilityDiceControls(card);
    this.queueRendererWork('full');
  }

  async handleAbilityDiceUpload(slot, file) {
    if (!slot || !file) return;
    const safeSlot = String(slot).toUpperCase();
    if (!this.validateImageFile(file, { label: 'ability icon' })) return;
    const dataUrl = await this.readFileAsDataUrl(file, 'Failed to read ability dice icon.').catch((error) => {
      console.warn('Failed to upload ability dice icon:', error);
      this.showToast('Failed to read the selected ability icon.', { force: true, duration: 2800 });
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
    this.queueRendererWork('full');
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
    this.queueRendererWork('full');
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
    this.queueRendererWork('full');
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
      this.queueRendererWork('full');
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
    this.queueRendererWork('full');
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
      this.showToast(`"${key}" is reserved. Choose another name.`, { force: true, duration: 2800 });
      return;
    }

    let card = gameState.getCard();
    const entries = this.getCustomStatusEffects(card);
    if (entries.some((entry) => entry.key === key)) {
      this.showToast(`Status effect "{{${key}}}" already exists.`, { force: true, duration: 2800 });
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
    this.queueRendererWork('full');
  }

  removeCustomStatusEffectEntry(key) {
    const safeKey = this.slugifyCustomStatusName(key);
    let card = gameState.getCard();
    const entries = this.getCustomStatusEffects(card);
    const next = entries.filter((entry) => entry.key !== safeKey);
    gameState.updateProperty('customStatusEffects', next);
    card = gameState.getCard();
    this.renderCustomStatusEffectsControls(card);
    this.queueRendererWork('full');
  }

  async handleCustomStatusEffectUpload(key, file) {
    const safeKey = this.slugifyCustomStatusName(key);
    if (!safeKey || !file) return;
    if (!this.validateImageFile(file, { label: 'status icon' })) return;
    const dataUrl = await this.readFileAsDataUrl(file, 'Failed to read status effect icon.').catch((error) => {
      console.warn('Failed to upload status effect icon:', error);
      this.showToast('Failed to read the selected status icon.', { force: true, duration: 2800 });
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
    this.queueRendererWork('full');
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
    const safeMessage = message || '';
    if (this.deckViewStatus) {
      this.deckViewStatus.textContent = safeMessage;
    }
    if (this.busyDepth > 0 && safeMessage) {
      this.setBusyMessage(safeMessage);
    }
  }

  setPrintSheetStatus(message) {
    const safeMessage = message || '';
    if (this.printSheetStatus) {
      this.printSheetStatus.textContent = safeMessage;
    }
    if (this.busyDepth > 0 && safeMessage) {
      this.setBusyMessage(safeMessage);
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

  async scaleDeckCardDataUrl(src, targetWidth, targetHeight, fitMode = 'cover', extraScale = 1, allowUpscale = true, returnInfo = false) {
    if (!src) return returnInfo ? { value: '', size: 0, objectUrl: false } : '';
    const img = await renderer.loadImage(src);
    if (img.width === targetWidth && img.height === targetHeight) {
      const info = {
        value: src,
        size: this.estimateRenderCacheValueSize(src),
        objectUrl: String(src).startsWith('blob:')
      };
      return returnInfo ? info : src;
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
    const info = await this.canvasToImageUrl(canvas, returnInfo);
    return returnInfo ? info : info.value;
  }

  async rotateDataUrl(src, degrees = 0, returnInfo = false) {
    const rotation = Number(degrees) || 0;
    if (!src || rotation % 360 === 0) {
      const info = {
        value: src || '',
        size: this.estimateRenderCacheValueSize(src || ''),
        objectUrl: String(src || '').startsWith('blob:')
      };
      return returnInfo ? info : (src || '');
    }
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
    const info = await this.canvasToImageUrl(canvas, returnInfo);
    return returnInfo ? info : info.value;
  }

  async renderDeckCardDataUrl(cardData, cacheToken = '') {
    const cacheKey = `deck|${String(cacheToken || '')}`;
    const cached = this.getRenderCacheValue(cacheKey);
    if (cached) return cached;
    const renderCard = deepCloneUI(cardData || {});
    renderCard.layers = {
      ...(renderCard.layers || {}),
      cardBleed: false
    };
    const renderWidth = Number(DTC_UI_EXPORT_SIZE.width) || 675;
    const renderHeight = Number(DTC_UI_EXPORT_SIZE.height) || 1050;
    const canvas = await renderer.renderCardToCanvas(renderCard, {
      width: renderWidth,
      height: renderHeight,
      includeBleed: false,
      usePreviewMetrics: false,
      fitMode: 'contain',
      cropToBleedBounds: true
    });
    if (!canvas) return '';
    const info = await this.canvasToImageUrl(canvas, true);
    if (!info.value) return '';
    this.setRenderCacheValue(cacheKey, info.value, info);
    return info.value;
  }

  async renderPrintCardDataUrl(cardData, cellWidth, cellHeight, cacheToken = '') {
    const rotation = Number(this.printTemplateConfig?.cardRotation) || 0;
    const extraScale = Number.isFinite(this.printTemplateConfig?.cardScale)
      ? this.printTemplateConfig.cardScale
      : 1;
    const fitMode = this.printMode === 'compact' ? 'contain' : 'cover';
    const allowUpscale = this.printMode !== 'compact';
    const cacheKey = `print|${Math.round(cellWidth)}|${Math.round(cellHeight)}|${rotation}|${extraScale.toFixed(3)}|${fitMode}|${allowUpscale ? 1 : 0}|${this.printMode}|${String(cacheToken || '')}`;
    const cached = this.getRenderCacheValue(cacheKey);
    if (cached) return cached;
    const renderCard = deepCloneUI(cardData || {});
    renderCard.layers = {
      ...(renderCard.layers || {}),
      cardBleed: false
    };
    const renderWidth = Number(DTC_UI_EXPORT_SIZE.width) || 675;
    const renderHeight = Number(DTC_UI_EXPORT_SIZE.height) || 1050;
    const canvas = await renderer.renderCardToCanvas(renderCard, {
      width: renderWidth,
      height: renderHeight,
      includeBleed: false,
      usePreviewMetrics: false,
      fitMode: 'contain',
      trimTransparent: true,
      trimAlphaThreshold: 1,
      cropToBleedBounds: true
    });
    if (!canvas) return '';
    const transientUrls = [];
    let currentInfo = await this.canvasToImageUrl(canvas, true);
    let dataUrl = currentInfo.value;
    if (!dataUrl) return '';
    if (rotation) {
      const rotatedInfo = await this.rotateDataUrl(dataUrl, rotation, true);
      if (currentInfo.objectUrl) transientUrls.push(currentInfo.value);
      currentInfo = rotatedInfo;
      dataUrl = rotatedInfo.value;
    }
    const scaledInfo = await this.scaleDeckCardDataUrl(dataUrl, cellWidth, cellHeight, fitMode, extraScale, allowUpscale, true);
    if (currentInfo.objectUrl && currentInfo.value !== scaledInfo.value) transientUrls.push(currentInfo.value);
    if (scaledInfo.value) {
      this.setRenderCacheValue(cacheKey, scaledInfo.value, scaledInfo);
    } else if (currentInfo.objectUrl) {
      transientUrls.push(currentInfo.value);
    }
    transientUrls.forEach((url) => this.revokeObjectUrl(url));
    return scaledInfo.value;
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
    const fragment = document.createDocumentFragment();
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
      fragment.appendChild(label);
    });
    this.printSelectionList.appendChild(fragment);
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
    let fragment = document.createDocumentFragment();
    for (const entry of entries) {
      if (index >= maxCards) break;
      index += 1;
      if (index > 1 && index % 2 === 0) {
        await this.waitForIdle(900);
      }
      if (renderToken !== this.deckViewRenderToken) return;
      this.setDeckViewStatus(`Rendering ${index} of ${renderTotal}...`);
      const entryJson = (entry && typeof entry.json === 'string')
        ? entry.json
        : JSON.stringify(entry || {});
      const cardData = this.buildCardFromJson(entryJson);
      cardData.layers = { ...(cardData.layers || {}), cardBleed: false };
      const name = String(cardData.name || entry?.name || `Card ${index}`).trim() || `Card ${index}`;
      if (!cardData.name || cardData.name === 'Title') {
        cardData.name = name;
      }
      const rowIndex = Math.floor((index - 1) / this.deckTemplateConfig.columns);
      const cacheToken = `${entryJson}|name:${name}`;
      const dataUrl = await this.renderDeckCardDataUrl(cardData, cacheToken);
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
      fragment.appendChild(cardEl);
      if (index % 8 === 0) {
        this.deckViewGrid.appendChild(fragment);
        fragment = document.createDocumentFragment();
      }
    }
    if (fragment.childNodes.length) {
      this.deckViewGrid.appendChild(fragment);
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
      let pageFragment = document.createDocumentFragment();
      for (let i = start; i < end; i += 1) {
        if (renderToken !== this.printSheetRenderToken) return;
        index += 1;
        if (index > 1 && index % 2 === 0) {
          await this.waitForIdle(900);
        }
        this.setPrintSheetStatus(`Rendering ${index} of ${renderTotal}...`);
        const entry = entries[i];
        const entryJson = (entry && typeof entry.json === 'string')
          ? entry.json
          : JSON.stringify(entry || {});
        const cardData = this.buildCardFromJson(entryJson);
        cardData.layers = { ...(cardData.layers || {}), cardBleed: false };
        const name = String(cardData.name || entry?.__printName || entry?.name || `Card ${index}`).trim() || `Card ${index}`;
        if (!cardData.name || cardData.name === 'Title') {
          cardData.name = name;
        }
        const cacheToken = `${entryJson}|printMode:${this.printMode}|name:${name}`;
        const dataUrl = await this.renderPrintCardDataUrl(cardData, cellWidth, cellHeight, cacheToken);
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
        pageFragment.appendChild(cardEl);
        if (grid && pageFragment.childNodes.length >= 4) {
          grid.appendChild(pageFragment);
          pageFragment = document.createDocumentFragment();
        }
      }
      if (grid && pageFragment.childNodes.length) {
        grid.appendChild(pageFragment);
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
      this.showToast('Please enter a deck name.', { force: true, duration: 2400 });
      return;
    }
    const store = this.loadDeckStore();
    const exists = Object.values(store.decks).some((deck) => deck.name === name);
    if (exists) {
      this.showToast('A deck with that name already exists.', { force: true, duration: 2800 });
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
    // New decks should start with no board abilities or slot assignments.
    this.saveBoardAbilityStore({ abilities: {}, order: [] }, id);
    this.saveBoardSlotAssignments(Array.from({ length: this.boardSlotSelects.length }, () => ''), id);
    this.saveBoardPlacements([], id);
    this.deckNameInput.value = '';
    this.refreshDeckUI();
    if (this.deckSelect) this.deckSelect.value = id;
    this.refreshDeckCards();
    this.refreshBoardAbilityOptions();
    if (this.deckCardSelect && deck.cards && deck.cards.length) {
      this.deckCardSelect.value = deck.cards[0].id;
      this.loadCardFromDeck();
    }
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast(`Deck "${name}" created.`, { force: true });
  }

  async saveBoardAbility(card = null) {
    const target = card && typeof card === 'object' ? card : gameState.getCard();
    const deckId = this.getSelectedDeckId();
    const deck = this.getSelectedDeck();
    if (!deckId || !deck) {
      this.showToast('Select a deck before saving Board Abilities.', { force: true, duration: 2800 });
      return null;
    }
    const rawName = String(target?.name || '').trim();
    if (!rawName || rawName === 'Title') {
      this.showToast('Please name the Board Ability before saving it.', { force: true, duration: 2800 });
      return null;
    }

    const store = this.loadBoardAbilityStore(deckId);
    const abilities = store.abilities && typeof store.abilities === 'object' ? store.abilities : {};
    const order = Array.isArray(store.order) ? store.order : [];
    const existingId = order.find((id) => {
      const entry = abilities[id];
      return entry && String(entry.name || '').trim().toLowerCase() === rawName.toLowerCase();
    });
    const existingAbilityEntries = order
      .map((id) => abilities[id])
      .filter((entry) => entry && typeof entry === 'object')
      .map((entry) => ({ name: String(entry.name || '').trim() }));

    let shouldOverwrite = false;
    let finalName = rawName;

    if (existingId) {
      shouldOverwrite = await this.confirmAction({
        title: 'Overwrite Board Ability?',
        message: `"${rawName}" already exists in this deck's board abilities. Overwrite it?`,
        confirmLabel: 'Overwrite',
        cancelLabel: 'Save Copy'
      });
      if (!shouldOverwrite) {
        finalName = this.buildUniqueDeckCardName(existingAbilityEntries, rawName);
      }
    }

    const id = (existingId && shouldOverwrite)
      ? existingId
      : `board_ability_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const entry = {
      id,
      name: finalName,
      subType: String(target?.cardSubType || ''),
      savedAt: new Date().toISOString(),
      json: gameState.toJSON()
    };
    abilities[id] = entry;
    if (!(existingId && shouldOverwrite)) {
      order.push(id);
    }

    this.saveBoardAbilityStore({ abilities, order }, deckId);
    this.refreshBoardAbilityOptions();
    this.showToast(`Board Ability "${finalName}" saved to "${deck.name}".`, { force: true });
    return entry;
  }

  async saveCardToDeck() {
    const card = gameState.getCard();
    if (this.isBoardAbilityCard(card)) {
      await this.saveBoardAbility(card);
      return;
    }
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck) {
      this.showToast('Please select a deck first.', { force: true, duration: 2400 });
      return;
    }
    const name = (card.name || 'Untitled').trim();
    const json = gameState.toJSON();
    deck.cards = Array.isArray(deck.cards) ? deck.cards : [];
    const existing = deck.cards.find((entry) => entry.name === name);
    const shouldOverwrite = existing
      ? await this.confirmAction({
        title: 'Overwrite Deck Card?',
        message: `"${name}" already exists in this deck. Overwrite it?`,
        confirmLabel: 'Overwrite',
        cancelLabel: 'Save Copy'
      })
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
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast(existing && shouldOverwrite ? 'Card overwritten in deck.' : 'Card saved to deck.', { force: true });
  }

  duplicateCardInDeck() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
      this.showToast('No cards found in this deck.', { force: true, duration: 2400 });
      return;
    }

    const cardId = this.deckCardSelect ? this.deckCardSelect.value : '';
    const sourceIndex = deck.cards.findIndex((entry) => entry.id === cardId);
    const sourceEntry = sourceIndex >= 0 ? deck.cards[sourceIndex] : null;
    if (!sourceEntry) {
      this.showToast('Please select a card to duplicate.', { force: true, duration: 2400 });
      return;
    }

    const sourceCard = this.buildCardFromJson(sourceEntry.json);
    const sourceName = String(sourceEntry.name || sourceCard.name || 'Card').trim() || 'Card';
    const duplicateName = this.buildUniqueDeckCardName(deck.cards, `${sourceName} Copy`);
    sourceCard.name = duplicateName;
    const duplicateCardId = this.buildDeckCardId(deck, deck.cards.length + 1);
    if (duplicateCardId) {
      sourceCard.cardId = duplicateCardId;
    }
    if (Array.isArray(sourceCard.titleBlocks) && sourceCard.titleBlocks.length) {
      const activeId = sourceCard.activeTitleId;
      let didApply = false;
      sourceCard.titleBlocks = sourceCard.titleBlocks.map((block, index) => {
        if (didApply) return block;
        if ((activeId && block.id === activeId) || (!activeId && index === 0)) {
          didApply = true;
          return { ...block, text: duplicateName };
        }
        return block;
      });
      if (!didApply) {
        sourceCard.titleBlocks[0].text = duplicateName;
      }
    }

    const duplicateEntry = {
      id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: duplicateName,
      savedAt: new Date().toISOString(),
      json: JSON.stringify(sourceCard, null, 2)
    };
    deck.cards.splice(sourceIndex + 1, 0, duplicateEntry);
    store.decks[deckId] = deck;
    this.saveDeckStore(store);
    this.refreshDeckCards();
    if (this.deckCardSelect) this.deckCardSelect.value = duplicateEntry.id;
    if (gameState.fromJSON(duplicateEntry.json)) {
      this.updateUI();
    }
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast('Card duplicated in deck.', { force: true });
  }

  openDeckBatchImportModal() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck) {
      this.showToast('Please select a deck first.', { force: true, duration: 2400 });
      return;
    }
    if (this.deckBatchImportInput) this.deckBatchImportInput.value = '';
    if (this.deckBatchImportReplace) this.deckBatchImportReplace.checked = false;
    this.openModal('deckBatchImportModal');
  }

  async submitDeckBatchImport() {
    const raw = String(this.deckBatchImportInput?.value || '');
    const replaceDeck = !!this.deckBatchImportReplace?.checked;
    const importedCount = await this.batchImportCardsToDeck(raw, {
      replaceDeck,
      requireConfirm: true
    });
    if (!importedCount) return;
    this.closeModal('deckBatchImportModal');
    if (this.deckBatchImportInput) this.deckBatchImportInput.value = '';
    if (this.deckBatchImportReplace) this.deckBatchImportReplace.checked = false;
  }

  async batchImportCardsToDeck(rawInput = '', options = {}) {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck) {
      this.showToast('Please select a deck first.', { force: true, duration: 2400 });
      return 0;
    }
    const safeRaw = String(rawInput || '').trim();
    const names = this.parseBatchDeckNames(safeRaw);
    if (!names.length) {
      this.showToast('No valid card names were found.', { force: true, duration: 2600 });
      return 0;
    }
    if (options.requireConfirm !== false) {
      const shouldImport = await this.confirmAction({
        title: 'Import Deck Cards',
        message: `Import ${names.length} card${names.length === 1 ? '' : 's'} into "${deck.name}"?`,
        confirmLabel: 'Import Cards',
        cancelLabel: 'Cancel'
      });
      if (!shouldImport) return 0;
    }
    const replaceDeck = options.replaceDeck === true;

    await this.ensureDeckDefaultCard();
    deck.cards = Array.isArray(deck.cards) ? deck.cards : [];
    if (replaceDeck) {
      deck.cards = [];
    }
    const existingCards = deck.cards;
    const startNumber = existingCards.length + 1;
    const addedEntries = [];

    names.forEach((rawName, index) => {
      const cardName = this.buildUniqueDeckCardName(existingCards, rawName);
      const cardData = this.getDeckDefaultCardSnapshot();
      cardData.name = cardName;
      if (Array.isArray(cardData.titleBlocks) && cardData.titleBlocks.length) {
        cardData.titleBlocks[0] = { ...cardData.titleBlocks[0], text: cardName };
      }
      const cardId = this.buildDeckCardId(deck, startNumber + index);
      if (cardId) {
        cardData.cardId = cardId;
      }
      const entry = {
        id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: cardName,
        savedAt: new Date().toISOString(),
        json: JSON.stringify(cardData, null, 2)
      };
      existingCards.push(entry);
      addedEntries.push(entry);
    });

    store.decks[deckId] = deck;
    this.saveDeckStore(store);
    this.refreshDeckCards();

    const firstEntry = addedEntries[0];
    if (firstEntry) {
      if (this.deckCardSelect) this.deckCardSelect.value = firstEntry.id;
      if (gameState.fromJSON(firstEntry.json)) {
        this.updateUI();
      }
    }
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast(`Imported ${addedEntries.length} card${addedEntries.length === 1 ? '' : 's'} successfully.`, { force: true });
    return addedEntries.length;
  }

  loadCardFromDeck() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck || !Array.isArray(deck.cards)) {
      this.showToast('No cards found in this deck.', { force: true, duration: 2400 });
      return;
    }
    const cardId = this.deckCardSelect ? this.deckCardSelect.value : '';
    const entry = deck.cards.find((card) => card.id === cardId);
    if (!entry) {
      this.showToast('Please select a card to load.', { force: true, duration: 2400 });
      return;
    }
    if (gameState.fromJSON(entry.json)) {
      this.updateUI();
      this.scheduleRenderWarmup({ immediate: true });
    } else {
      this.showToast('Failed to load card from deck.', { force: true, duration: 3000 });
    }
  }

  async deleteCardFromDeck() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    const deck = deckId ? store.decks[deckId] : null;
    if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
      this.showToast('No cards to delete.', { force: true, duration: 2400 });
      return;
    }
    const cardId = this.deckCardSelect ? this.deckCardSelect.value : '';
    if (!cardId) {
      this.showToast('Please select a card to delete.', { force: true, duration: 2400 });
      return;
    }
    const index = deck.cards.findIndex((card) => card.id === cardId);
    const entry = index >= 0 ? deck.cards[index] : null;
    const name = entry?.name || 'this card';
    const shouldDelete = await this.confirmAction({
      title: 'Delete Deck Card',
      message: `Delete "${name}" from this deck?`,
      confirmLabel: 'Delete Card',
      cancelLabel: 'Cancel',
      danger: true
    });
    if (!shouldDelete) return;
    deck.cards = deck.cards.filter((card) => card.id !== cardId);
    store.decks[deckId] = deck;
    this.saveDeckStore(store);
    this.refreshDeckCards();
    if (!deck.cards.length) {
      gameState.reset();
      this.updateUI();
      this.scheduleRenderWarmup({ immediate: true });
      this.showToast('Card deleted. Deck is now empty.', { force: true });
      return;
    }
    const nextIndex = Math.min(index, deck.cards.length - 1);
    const nextCard = deck.cards[nextIndex];
    if (nextCard && gameState.fromJSON(nextCard.json)) {
      this.updateUI();
      if (this.deckCardSelect) this.deckCardSelect.value = nextCard.id;
    }
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast('Card deleted from deck.', { force: true });
  }

  async deleteDeck() {
    const store = this.loadDeckStore();
    const deckId = this.deckSelect ? this.deckSelect.value : '';
    if (!deckId || !store.decks[deckId]) {
      this.showToast('Please select a deck to delete.', { force: true, duration: 2400 });
      return;
    }
    const name = store.decks[deckId].name || 'this deck';
    const shouldDelete = await this.confirmAction({
      title: 'Delete Deck',
      message: `Delete "${name}"? This cannot be undone.`,
      confirmLabel: 'Delete Deck',
      cancelLabel: 'Cancel',
      danger: true
    });
    if (!shouldDelete) return;
    this.removeBoardAbilityStoreForDeck(deckId);
    this.removeBoardSlotAssignmentsForDeck(deckId);
    this.removeBoardPlacementsForDeck(deckId);
    delete store.decks[deckId];
    if (Array.isArray(store.order)) {
      store.order = store.order.filter((id) => id !== deckId);
    }
    this.saveDeckStore(store);
    this.refreshDeckUI();
    this.scheduleRenderWarmup({ immediate: true });
    this.showToast(`Deck "${name}" deleted.`, { force: true });
  }
}

// Initialize UI
const ui = new UI();
