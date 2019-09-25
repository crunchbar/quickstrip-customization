import {
  ASCENDING,
  DESCENDING,
  GRID,
  LABEL,
  HOLDING_BOX_ID,
  MENU_EVENTS,
  QUICKSTRIP_SPACER_ID,
  THIN_SPACER_ID,
  WIDE_SPACER_ID,
} from '../constants';
import {
  HoldingBoxState,
  ListItemInterface,
  MYOButtonInterface,
  Setting,
} from '../interfaces';
import {deburr, includes, orderBy, startCase} from 'lodash/fp';
import json5Writer from 'json5-writer';
import {saveAs} from 'file-saver';
import v4 from 'uuid/v4';

export const orderByAscLabel = (list: ListItemInterface[]) => orderBy([LABEL], [ASCENDING], list);
export const orderByDescLabel = (list: ListItemInterface[]) => orderBy([LABEL], [DESCENDING], list);

export const filterListByValue = (list: ListItemInterface[], value: string) => {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0
    ? list
    : list.filter((listItem) =>
      includes(inputValue, listItem.label.toLowerCase())
    );
}

export const getMenuItems = (menuEvents: {[key:string]: string}) => {
  return Object.entries(menuEvents).map(([key, value]) => value);
}

export const reorderItems = (list: ListItemInterface[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const moveItem = (
  source: ListItemInterface[],
  destination: ListItemInterface[],
  droppableSource: any,
  droppableDestination: any,
): HoldingBoxState => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone,
  };
};

export const getUpdatedHBChunks = (
  chunks: ListItemInterface[][],
  droppableId: string,
  replacementChunk?: ListItemInterface[],
): ListItemInterface[][] => chunks.map((chunk, index) => (
  droppableId === `${HOLDING_BOX_ID}${index}`
  ? (replacementChunk || [])
  : chunk
));

export const filterEventsByState = (
  events: string[],
  listTotal: number,
  listItemIndex: number,
) => events.filter(label => {
  if (listTotal === 1) {
    return label === MENU_EVENTS.QUICK_STRIP.MOVE_LEFT
      || label === MENU_EVENTS.QUICK_STRIP.MOVE_RIGHT
      ? false
      : true;
  }
  if (listItemIndex === 0) {
    return label === MENU_EVENTS.QUICK_STRIP.MOVE_LEFT
      ? false
      : true;
  }
  if (listItemIndex === (listTotal - 1)) {
    return label === MENU_EVENTS.QUICK_STRIP.MOVE_RIGHT
      ? false
      : true;
  }
  return true;
});

export const getListStyle = (isDraggingOver: boolean, bgColor?: string, dragBgColor?: string) => ({
  background: isDraggingOver ? (dragBgColor || 'lightblue') : (bgColor || 'lightgrey'),
  display: 'flex',
  padding: GRID,
  overflow: 'hidden',
  height: GRID * 14,
});

export const settingsToAllChoicesList = (settings: Setting[]): ListItemInterface[] =>
  settings.filter(({id}) => id ? true : false).map(({
    id = '',
    learnMoreLink = 'https://morphic.world/',
  }) => ({
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    label: startCase(id),
    learnMoreLink,
    id,
  }));

export const getUpdatedJSON5SiteConfig = (
  siteConfigString: string,
  siteConfigObj: any,
  buttonList: string[],
): string => {
  const j5WriterInstance = json5Writer.load(siteConfigString);
  j5WriterInstance.write({
    ...siteConfigObj,
    qss: {
      ...siteConfigObj.qss,
      buttonList,
    }
  });
  return j5WriterInstance.toSource();
};

export const downloadSiteConfig = (
  siteConfigString: string,
  siteConfigObj: any,
  buttonList: string[],
) => {
  const siteConfig = getUpdatedJSON5SiteConfig(siteConfigString, siteConfigObj, buttonList);
  const blob = new Blob([siteConfig], {type: 'application/json5;charset=utf-8'});
  saveAs(blob, 'siteconfig.json5');
};

export const mYODataToListItem = ({
  buttonName,
  buttonData = '',
  buttonType,
  description,
  popupText,
}: MYOButtonInterface): ListItemInterface => ({
  description,
  label: buttonName,
  learnMoreLink: buttonType === 'WEB' ? sanitizeUrl(buttonData) : '',
  id: buttonName,
  popupText,
});

export function sanitizeUrl(url: string): string {
  const invalidPrototcolRegex = /^(%20|\s)*(javascript|data)/im;
  const ctrlCharactersRegex = /[^\x20-\x7E]/gmi;
  const urlSchemeRegex = /^([^:]+):/gm;
  const relativeFirstCharacters = ['.', '/'];
  let urlScheme, urlSchemeParseResults, sanitizedUrl;
  if (!url) {
    return 'about:blank';
  }
  sanitizedUrl = url.replace(ctrlCharactersRegex, '').trim();
  if (relativeFirstCharacters.indexOf(sanitizedUrl[0]) > -1) {
    return sanitizedUrl;
  }
  urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
  if (!urlSchemeParseResults) {
    sanitizedUrl = 'https://' + sanitizedUrl;
  } else {
    urlScheme = urlSchemeParseResults[0];
    if (invalidPrototcolRegex.test(urlScheme)) {
      return 'about:blank';
    }
  }
  return sanitizedUrl;
}

export const newWideSpacer = (): ListItemInterface => ({
  description: 'Wide Spacer',
  label: 'Wide Spacer',
  id: `${QUICKSTRIP_SPACER_ID} ${WIDE_SPACER_ID} ${v4()}`,
});

export const newThinSpacer = (): ListItemInterface => ({
  description: 'Narrow Spacer',
  label: 'Narrow Spacer',
  id: `${QUICKSTRIP_SPACER_ID} ${THIN_SPACER_ID} ${v4()}`,
});
