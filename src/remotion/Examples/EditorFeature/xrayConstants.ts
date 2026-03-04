export const MEDICAL_OPTIONS = [
  "None of the below",
  "Essential hypertension requiring pharmacological intervention",
  "Diagnosed with chronic metabolic disorder (Type A or B)",
  "Chronic localized inflammatory arthropathy",
  "Recurrent benign paroxysmal positional vertigo",
];

export const MAIN_WIDTH = 2700;
export const LEFT_PANE_WIDTH = 1780;
export const RIGHT_PANE_WIDTH = 1060;
export const PANE_GAP = 42;

export const HEADING_TOP = 72;
export const BODY_TOP = 270;
export const SECTION_TOP = BODY_TOP;

export const LEFT_TOP_BAR_HEIGHT = 76;
export const FORM_TOP_GAP = 20;
export const FORM_HEIGHT = 1260;
export const BROWSER_BAR_HEIGHT = 96;

export const XRAY_TOP = 300;
export const XRAY_PADDING_TOP = 16;
export const XRAY_PADDING_X = 10;
export const XRAY_PADDING_BOTTOM = 16;
export const XRAY_HEIGHT = 780;

export const OPTIONS_TOP = 176;
export const OPTION_HEIGHT = 104;
export const OPTION_GAP = 14;

export const JSON_ROWS_TOP = 220;
export const RIGHT_PANE_SHIFT = 124;

export const FORM_ENTRANCE_DURATION = 24;
export const FORM_HOLD_BEFORE_QUESTION = 18;
export const QUESTION_REVEAL_START = FORM_ENTRANCE_DURATION + FORM_HOLD_BEFORE_QUESTION;
export const OPTIONS_REVEAL_START = QUESTION_REVEAL_START + 18;
export const OPTION_REVEAL_STAGGER = 8;
export const FORM_HOLD_BEFORE_SCAN = 30;

export const SCAN_START =
  OPTIONS_REVEAL_START +
  OPTION_REVEAL_STAGGER * (MEDICAL_OPTIONS.length - 1) +
  FORM_HOLD_BEFORE_SCAN;
export const SCAN_DURATION = 110;
export const FILESYSTEM_START = SCAN_START + SCAN_DURATION;
export const FILESYSTEM_SHIFT_DURATION = 32;
export const FILESYSTEM_WIDTH = 1080;
export const FILESYSTEM_GAP = 56;
export const FILESYSTEM_PANEL_DELAY = FILESYSTEM_START + 16;
export const TEXT_TRANSFER_START = FILESYSTEM_PANEL_DELAY + 26;
export const TEXT_TRANSFER_STAGGER = 12;
export const TEXT_TRANSFER_DURATION = 36;
export const TEXT_SQUISH_START =
  TEXT_TRANSFER_START +
  TEXT_TRANSFER_STAGGER * (MEDICAL_OPTIONS.length - 1) +
  TEXT_TRANSFER_DURATION +
  12;
export const TEXT_SQUISH_DURATION = 34;
export const FILESYSTEM_EDITOR_LEFT = 42;

export const FILESYSTEM_TOP_BAR_HEIGHT = 92;
export const FILESYSTEM_CONTENT_PADDING = 20;
export const FILESYSTEM_CODE_PADDING_X = 22;
export const FILESYSTEM_CODE_PADDING_Y = 24;

export const JSON_BASE_FONT_SIZE = 15;
export const JSON_SCALE_MULTIPLIER = 3;
export const JSON_FONT_SIZE = JSON_BASE_FONT_SIZE * JSON_SCALE_MULTIPLIER;
export const JSON_LINE_HEIGHT_MULTIPLIER = 1.2;
export const JSON_OPTIONS_START_LINE_INDEX = 5;

export const DISCOVERY_START = SCAN_START + SCAN_DURATION + 6;
export const DISCOVERY_FADE_DURATION = 12;
export const TAG_POP_START = DISCOVERY_START + 2;

export const RIGHT_PANE_START = 58;
export const MAPPING_START = 62;
export const LINE_DURATION = 15;
export const MAPPING_STAGGER = 6;
