import {
  ASCENDING,
  DESCENDING,
  GRID,
  LABEL,
  HOLDING_BOX_ID,
  QUICKSTRIP_SPACER_ID,
  VISIBLE_SPACER_ID,
  SPACER_ID,
  MORE_PANEL_ID,
} from '../constants';
import {
  HoldingBoxState,
  ListItemInterface,
  MYOButtonInterface,
  Setting,
  Description,
} from '../interfaces';
import {deburr, includes, orderBy, startCase} from 'lodash/fp';
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

export const reorderItems = (
  list: ListItemInterface[],
  startIndex: number,
  endIndex: number,
  addEmpty?: boolean,
) => {
  if (addEmpty) {
    const startItem = {...list[startIndex]};
    const endItem = {...list[endIndex]};
    return list.map((li, i) => {
      if (i === startIndex) {
        return endItem;
      }
      if (i === endIndex) {
        return startItem;
      }
      return li;
    });
  }
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
  const sourceIsMore = droppableSource.droppableId.includes(MORE_PANEL_ID);
  const destIsMore = droppableDestination.droppableId.includes(MORE_PANEL_ID)
  if (sourceIsMore && destIsMore) {
    const sourceItem = {...source[droppableSource.index]};
    const destItem = {...destination[droppableDestination.index]};
    return {
      [droppableSource.droppableId]: source.map((li, i) => {
        if (i === droppableSource.index) {
          return destItem;
        }
        return li;
      }),
      [droppableDestination.droppableId]: destination.map((li, i) => {
        if (i === droppableDestination.index) {
          return sourceItem;
        }
        return li;
      }),
    };
  }
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  let removed;
  if (sourceIsMore) {
    removed = sourceClone.splice(droppableSource.index, 1, {
      description: '',
      label: '',
      id: '',
    })[0];
  } else {
    removed = sourceClone.splice(droppableSource.index, 1)[0];
  }
  destClone.splice(
    droppableDestination.index,
    droppableDestination.droppableId.includes(MORE_PANEL_ID) ? 1 : 0,
    removed
  );
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

export const getUpdatedMorePanelList = (
  rows: ListItemInterface[][],
  rowIndex: number,
  replacementRow?: ListItemInterface[],
): ListItemInterface[][] => rows.map((row, index) => (
  rowIndex === index
  ? (replacementRow || [])
  : row
));

export const getIndexes = (droppableId: string, itemIndex: number, rowIndex?: number): [number | undefined, number] => {
  if (typeof rowIndex === 'number') {
    return [rowIndex, itemIndex];
  }
  if (!droppableId.includes(MORE_PANEL_ID)) {
    return [undefined, itemIndex];
  }
  const split = droppableId.split('-');
  return [
    Number(split[1]), // row index
    Number(split[2]), // item index
  ];
};

export const filterEventsByState = (
  events: string[],
  listTotal: number,
  listItemIndex: number,
  nextLabel: string,
  prevLabel: string,
) => events.filter(label => {
  if (listTotal === 1) {
    return label === prevLabel
      || label === nextLabel
      ? false
      : true;
  }
  if (listItemIndex === 0) {
    return label === prevLabel
      ? false
      : true;
  }
  if (listItemIndex === (listTotal - 1)) {
    return label === nextLabel
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

export const settingsToAllChoicesList = (settings: Setting[], descriptionData: Description): ListItemInterface[] => {
  const descriptionKeys = Object.keys(descriptionData);
  const returnData = settings.filter(({id}) => id && (!id.startsWith('service-') && !id.startsWith('separator')) ? true : false).map(({
    id = '',
    learnMoreLink = 'https://morphic.world/',
  }) => {
    const dKey = descriptionKeys.find(v => v.includes(id));
    return {
      description: (dKey && descriptionData[dKey].tooltip) || '<p>Description not available.</p>',
      label: startCase(id),
      learnMoreLink,
      id,
    };
  });
  return returnData;
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

export const newSpacer = (): ListItemInterface => ({
  description: 'Spacer',
  label: 'Spacer',
  id: `${QUICKSTRIP_SPACER_ID} ${SPACER_ID} ${v4()}`,
});

export const newVisibleSpacer = (): ListItemInterface => ({
  description: 'Visible Spacer',
  label: 'Visible Spacer',
  id: `${QUICKSTRIP_SPACER_ID} ${VISIBLE_SPACER_ID} ${v4()}`,
});

export function generateMorePanelRow(): ListItemInterface[] {
  return Array.from(Array(10).keys()).map(() => ({
    description: '',
    label: '',
    id: '',
  }));
}

export function changeMoreIDRowIndex(droppableId: string, newIndex: number) {
  return droppableId.split('-').map(
    (v, i) => i === 1 ? newIndex : v
  ).join('-');
}