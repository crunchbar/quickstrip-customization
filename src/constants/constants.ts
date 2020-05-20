export const HOLDING_BOX_ID = 'holdingBoxList';
export const MAKE_YOUR_OWN_ID = 'makeYourOwnBox';
export const INSTRUCTIONS_ID = 'instructionsId';
export const INSTRUCTIONS_ITEM_CLASS = 'instructionsItem';
export const MORE_PANEL_ID = 'morePanel';
export const MORE_PANEL_ITEM_CLASS = 'morePanelItem';
export const QUICK_STRIP_ID = 'quickstripList';
export const QUICK_STRIP_SPACER_LIST_ID = 'quickstripSpacerList';
export const ALL_CHOICES_ID = 'allChoicesList';
export const ALL_CHOICES_SEARCH_FIELD_ID = 'all-choices-search-field';
export const COMMON_ITEM_CLASS = 'commonListItem';
export const IS_DRAGGING_CLASS = 'is-dragging';
export const HOLDING_BOX_ITEM_CLASS = 'holdingBoxListItem';
export const QUICK_STRIP_ITEM_CLASS = 'quickstripListItem';
export const ALL_CHOICES_ITEM_CLASS = 'allChoicesListItem';
export const MAKE_YOUR_OWN_ITEM_CLASS = 'makeYourOwnItem';
export const ASCENDING = 'asc';
export const DESCENDING = 'desc';
export const LABEL = 'label';
export const GRID = 6;
export const CONFIRM_DIALOG_NO_BTN_ID = 'confirm-dialog-no-btn';
export const CONFIRM_DIALOG_YES_BTN_ID = 'confirm-dialog-yes-btn';
export const BUTTON_TYPE_APP = 'APP';
export const BUTTON_TYPE_WEB = 'WEB';
export const BUTTON_TYPE_KEYBOARD = 'KEY';
export const OTHER = 'Other';
export const QUICKSTRIP_SPACER_ID = 'quickStripSpacer';
export const SPACERS_ID = 'spacers';
export const SPACER_ITEM_CLASS = 'spacerItem';
export const VIDEO_ID = 'video';
export const VIDEO_ITEM_CLASS = 'videoItem';
export const SAVE_ID = 'save';
export const SAVE_ITEM_CLASS = 'saveItem';
export const VISIBLE_SPACER_ID = 'separator-visible';
export const SPACER_ID = 'separator';
export const MYOB_DIALOG_CLASS = 'myo-dialog';
export const VISIBLE_GRID_ID = ['grid-visible', 'x'];
export const GRID_ID = ['grid', '-'];
export const ALL_GRID_IDS = [...GRID_ID, ...VISIBLE_GRID_ID];
export const DEFAULT_GRID_ID = GRID_ID[0];
export const KEY_MODIFIERS = [
  'Control',
  'Meta',
  'Alt',
  'Shift',
];
export const KEY_BUTTONS = [
  'Backspace',
  'Tab',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
];
export const MOD_KEY_MAP: {[key: string]: string} = {
  Alt: '!',
  'Alt/Option': '!',
  Shift: '+',
  Control: '^',
  Ctrl:  '^',
  Meta: "'",
  'Win/Cmd': "'",
};
export const KEY_MAP: {[key: string]: string} = {
  ' ': 'Space',
  Backspace: 'BackSpace',
  CapsLock: 'Capital',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  ArrowUp: 'Up',
  ArrowDown: 'Down',
};
export const CHIP_SEPARATOR = '}';
export const BUTTON_LIST = 'buttonList';
export const MORE_PANEL_LIST = 'morePanelList';
export const MY_CHOICES_LIST = 'myChoicesList';
export const COOKIE_OPTIONS = {
  domain: window.location.hostname === 'localhost' ? 'localhost' : '.morphic.org',
  path: '/',
};
