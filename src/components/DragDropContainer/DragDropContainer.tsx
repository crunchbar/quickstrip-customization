import React from 'react';
import {useCookies} from 'react-cookie';
import {DragDropContext, DragStart} from 'react-beautiful-dnd';
import {ListItemInterface, MYOButtonInterface} from '../../interfaces';
import {chunk, startCase} from 'lodash/fp';
import useWindowSize from '../../hooks/useWindowSize';
import {Button, Grid, Link, Menu, MenuItem} from '@material-ui/core';
import {
  ALL_CHOICES_ID,
  BUTTON_LIST,
  MORE_PANEL_LIST,
  MY_CHOICES_LIST,
  COOKIE_OPTIONS,
  GRID,
  HOLDING_BOX_ID,
  MENU_EVENTS,
  MORE_PANEL_ID,
  QUICK_STRIP_ID,
  QUICKSTRIP_SPACER_ID,
  VISIBLE_SPACER_ID,
  SPACER_ID,
} from '../../constants';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import {
  changeMoreIDRowIndex,
  filterEventsByState,
  generateMorePanelRow,
  getMenuItems,
  getIndexes,
  getUpdatedHBChunks,
  getUpdatedMorePanelList,
  moveItem,
  mYODataToListItem,
  reorderItems,
  newVisibleSpacer,
  newSpacer,
} from '../../utils/utils';
import {
  focusFirstQuickStripItem,
  focusFirstHoldingBoxItem,
} from '../../utils/keyboardHandler';
import Quickstrip from '../Quickstrip/Quickstrip';
import HoldingBox from '../HoldingBox/HoldingBox';
import AllChoicesList from '../AllChoicesList/AllChoicesList';
import MakeYourOwn from '../MakeYourOwn/MakeYourOwn';
import MorePanel from '../MorePanel/MorePanel';
import Spacers from '../Spacers/Spacers';
import Save from '../Save/Save';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

export interface DragDropContainerProps {
  allChoicesList: ListItemInterface[];
}

const menuItems: {[key: string]: string[]} = {
  [QUICK_STRIP_ID]: getMenuItems(MENU_EVENTS.QUICK_STRIP),
  [HOLDING_BOX_ID]: getMenuItems(MENU_EVENTS.HOLDING_BOX),
  [MORE_PANEL_ID]: getMenuItems(MENU_EVENTS.MORE_PANEL),
};

const DragDropContainer: React.FC<DragDropContainerProps> = ({
  allChoicesList: acl = [],
}) => {
  const [cookies, setCookie] = useCookies([BUTTON_LIST, MORE_PANEL_LIST, MY_CHOICES_LIST]);
  const [buttonListCookie] = React.useState(
    cookies[BUTTON_LIST]
    ? cookies[BUTTON_LIST].filter((b: any) => typeof b === 'string' ? !b.startsWith('service-') : true)
    : []
  );
  const [holdingBoxListCookie] = React.useState(cookies[MY_CHOICES_LIST] || []);
  const [morePanelListCookie] = React.useState(cookies[MORE_PANEL_LIST] || []);
  const [scaleFactor, setScaleFactor] = React.useState(1);
  const incrementScaleFactor = () => setScaleFactor(prevState => (prevState + 0.1) >= 1 ? 1 : (prevState + 0.1));
  const decrementScaleFactor = () => setScaleFactor(prevState => (prevState - 0.1) <= 0.1 ? 0.1 : (prevState - 0.1));
  const [showFinal, setShowFinal] = React.useState(false);
  const [
    morePanelOpen,
    // setMorePanelOpen
  ] = React.useState(true);
  const [serviceButtonList] = React.useState(
    cookies[BUTTON_LIST]
    ? cookies[BUTTON_LIST].filter((b: any) => typeof b === 'string' && b.startsWith('service-'))
    : []
  );
  const filterOutStrings = (b: any) => typeof b !== 'string';
  const [myobList, setMYOBList] = React.useState<MYOButtonInterface[]>([
    ...buttonListCookie.filter(filterOutStrings),
    ...holdingBoxListCookie.filter(filterOutStrings),
    ...morePanelListCookie.flat().filter(filterOutStrings),
  ]);
  const [allChoicesList, setAllChoicesList] = React.useState<ListItemInterface[]>(
    [...acl, ...myobList.map(m => mYODataToListItem(m))]
  );
  const cookieToStringMapper = (b: any) => typeof b === 'string' ? b : b.buttonName;
  const [checkedButtonList] = React.useState<string[]>(buttonListCookie.map(cookieToStringMapper))
  const [checkedHoldingBoxList] = React.useState<string[]>(holdingBoxListCookie.map(cookieToStringMapper))
  const [checkedMorePanelList] = React.useState<string[]>(morePanelListCookie.map((i: any) => i.map(cookieToStringMapper)))
  const [checked, setChecked] = React.useState<string[]>([
    ...checkedButtonList,
    ...checkedHoldingBoxList,
    ...checkedMorePanelList.flat().filter(i => i !== ''),
  ]);
  const stringToListItemMapper = (c: string) =>
    allChoicesList.find(a => a.id === c)
    || (c.includes(VISIBLE_SPACER_ID) && newVisibleSpacer())
    || (c.includes(SPACER_ID) && newSpacer())
    || ({
      id: c,
      label: startCase(c),
      description: 'Button Not Available Within Settings',
    })
  const [quickstripList, setQuickstripList] = React.useState<ListItemInterface[]>(checkedButtonList.map(stringToListItemMapper));
  const [holdingBoxList, setHoldingBoxList] = React.useState<ListItemInterface[]>(checkedHoldingBoxList.map(stringToListItemMapper));
  const [morePanelList, setMorePanelList] = React.useState<ListItemInterface[][]>(
    checkedMorePanelList.length > 0
    ? checkedMorePanelList.map((i: any) => i.map(stringToListItemMapper))
    : [generateMorePanelRow()]
  )
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [currentMenuItem, setCurrentMenuItem] = React.useState('');
  const [currentElDetails, setCurrentElDetails] = React.useState<any>({
    droppableId: HOLDING_BOX_ID,
    index: 0,
    item: {id: '', label: ''},
  });
  const windowSize = useWindowSize();
  const [isDropDisabled, setIsDropDisabled] = React.useState(false);
  const currentElIsSpacer = currentElDetails && currentElDetails.item.id.includes(QUICKSTRIP_SPACER_ID);
  const currentElIsMYOB = currentElDetails && myobList.some(d => d.buttonName === currentElDetails.item.id);
  const currentElIsMoreItem = currentElDetails && currentElDetails.droppableId.includes(MORE_PANEL_ID);
  const [myobData, setMYOBData] = React.useState<MYOButtonInterface>();
  const toggleChecked = (id: string, choice?: ListItemInterface) => {
    // add to holding box
    if (checked.indexOf(id) === -1) {
      const currentChoice = choice || allChoicesList.find(choice => choice.id === id) || {
        description: '',
        label: '',
        learnMoreLink: '',
        id,
      };
      setHoldingBoxList(prevHoldingBoxList => [currentChoice, ...prevHoldingBoxList]);
    } else {
      // remove from holding box and quickstrip
      setHoldingBoxList(prevHoldingBoxList => prevHoldingBoxList.filter(l => l.id !== id));
      setQuickstripList(prevQuickstripList => prevQuickstripList.filter(l => l.id !== id));
      setMorePanelList(prevMorePanelList => prevMorePanelList.map(row => row.map(item => item.id !== id ? item : ({
        description: '',
        label: '',
        id: '',
      }))));
    }
    setChecked(prevChecked => {
      const currentIndex = prevChecked.indexOf(id);
      const newChecked = [...prevChecked];
      if (currentIndex === -1) {
        newChecked.unshift(id);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      return newChecked;
    });
  };
  const containerWidth = (windowSize.width > 1280 ? 1280 : windowSize.width) * (7 / 12);
  const chunkMultiplier = containerWidth > 600
    ? (containerWidth > 960 ? 20 : 16)
    : 9;
  const itemsPerChunk = (containerWidth - (GRID * chunkMultiplier)) / (GRID * 13);
  let holdingBoxChunks = chunk(itemsPerChunk, holdingBoxList);
  while (holdingBoxChunks.length < 3) {
    holdingBoxChunks = [
      ...holdingBoxChunks,
      [],
    ];
  }
  const currentMenuItems = currentElDetails.droppableId.includes(HOLDING_BOX_ID)
    ? menuItems[HOLDING_BOX_ID]
    : currentElIsMoreItem
    ? filterEventsByState(
        filterEventsByState(
        menuItems[MORE_PANEL_ID],
        morePanelList[currentElDetails.rowIndex].length,
        currentElDetails.index,
        MENU_EVENTS.MORE_PANEL.MOVE_RIGHT,
        MENU_EVENTS.MORE_PANEL.MOVE_LEFT,
      ),
      morePanelList.length,
      currentElDetails.rowIndex,
      MENU_EVENTS.MORE_PANEL.MOVE_DOWN,
      MENU_EVENTS.MORE_PANEL.MOVE_UP,
    ) : filterEventsByState(
      currentElIsSpacer
      ? [MENU_EVENTS.QUICK_STRIP.MOVE_RIGHT, MENU_EVENTS.QUICK_STRIP.MOVE_LEFT]
      : menuItems[QUICK_STRIP_ID],
      quickstripList.length,
      currentElDetails.index,
      MENU_EVENTS.QUICK_STRIP.MOVE_RIGHT,
      MENU_EVENTS.QUICK_STRIP.MOVE_LEFT,
    );
  const getList = (id: string): ListItemInterface[] => (
    id === QUICK_STRIP_ID
    ? quickstripList
    : id.includes(MORE_PANEL_ID)
    ? morePanelList[Number(id.split('-')[1])]
    : holdingBoxChunks[Number(id.split(HOLDING_BOX_ID).pop())]
  );
  const getUpdatedHBList = (
    droppableId: string,
    replacementChunk?: ListItemInterface[],
  ): ListItemInterface[] => getUpdatedHBChunks(
    holdingBoxChunks,
    droppableId,
    replacementChunk
  ).flat();
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (
      !destination
      && source.droppableId === QUICK_STRIP_ID
      && quickstripList[source.index].id.includes(SPACER_ID)
    ) {
      setQuickstripList(prevState => prevState.filter((f, i) => i !== source.index))
    }
    // dropped outside the list
    if (!destination) {
      return;
    }
    const [srcRowIndex, srcItemIndex] = getIndexes(source.droppableId, source.index, source.rowIndex);
    const [destRowIndex, destItemIndex] = getIndexes(destination.droppableId, destination.index, destination.rowIndex);
    const newSpacerItem = source.droppableId === VISIBLE_SPACER_ID
      ? newVisibleSpacer()
      : source.droppableId === SPACER_ID
      ? newSpacer()
      : null;
    // add spacer to quickstrip
    if (newSpacerItem) {
      const quickstripClone = Array.from(quickstripList);
      quickstripClone.splice(destination.index, 0, newSpacerItem);
      setQuickstripList(quickstripClone);
      return;
    }
    // dropped on all choices (remove)
    if (destination.droppableId === ALL_CHOICES_ID) {
      const sourceList = getList(source.droppableId);
      toggleChecked(sourceList[srcItemIndex].id);
      return;
    }
    // dropped within same box therefore reorder
    if (
      source.droppableId === destination.droppableId
      || (srcRowIndex !== undefined && srcRowIndex === destRowIndex)
    ) {
      const isFromMorePanel = source.droppableId.includes(MORE_PANEL_ID);
      const items = reorderItems(
        getList(source.droppableId),
        srcItemIndex,
        destItemIndex,
        isFromMorePanel,
      );
      if (source.droppableId === QUICK_STRIP_ID) {
        setQuickstripList(items || []);
      } else if (isFromMorePanel) {
        setMorePanelList(rows => rows.map((r, i) => i === srcRowIndex ? items : r));
      } else {
        setHoldingBoxList(getUpdatedHBList(source.droppableId, items));
      }
    } else {
      const result = moveItem(
        getList(source.droppableId),
        getList(destination.droppableId),
        {...source, index: srcItemIndex},
        {...destination, index: destItemIndex},
      );
      let updatedHBChunks;
      if (source.droppableId.includes(HOLDING_BOX_ID)) {
        updatedHBChunks = getUpdatedHBChunks(
          holdingBoxChunks,
          source.droppableId,
          result[source.droppableId]
        );
      }
      if (destination.droppableId.includes(HOLDING_BOX_ID)) {
        updatedHBChunks = getUpdatedHBChunks(
          updatedHBChunks || holdingBoxChunks,
          destination.droppableId,
          result[destination.droppableId]
        );
      }
      if (updatedHBChunks) {
        setHoldingBoxList(updatedHBChunks.flat());
      }
      let updatedMorePanelList;
      if (source.droppableId.includes(MORE_PANEL_ID)) {
        updatedMorePanelList = getUpdatedMorePanelList(
          morePanelList,
          srcRowIndex!,
          result[source.droppableId]
        );
      }
      if (destination.droppableId.includes(MORE_PANEL_ID)) {
        updatedMorePanelList = getUpdatedMorePanelList(
          updatedMorePanelList || morePanelList,
          destRowIndex!,
          result[destination.droppableId]
        );
      }
      if (updatedMorePanelList) {
        setMorePanelList(updatedMorePanelList);
      }
      if (source.droppableId === QUICK_STRIP_ID) {
        setQuickstripList(result[source.droppableId] || []);
      }
      if (destination.droppableId === QUICK_STRIP_ID) {
        setQuickstripList(result[destination.droppableId] || []);
      }
    }
  }
  const handleMenuOpen = (event: any, currentElDetails: any) => {
    if (
      event.type === 'contextmenu'
      || event.type === 'dblclick'
      || event.key === 'Enter'
    ) {
      event.preventDefault();
      setCurrentElDetails(currentElDetails);
      setAnchorEl(event.currentTarget);
    }
  };
  const handleMenuCloseClick = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (label: string) => {
    setCurrentMenuItem(label);
    handleMenuCloseClick();
    const source = currentElDetails;
    switch(label) {
      case MENU_EVENTS.MORE_PANEL.MOVE_TO_QUICK_STRIP:
      case MENU_EVENTS.HOLDING_BOX.MOVE_TO_QUICK_STRIP:
        handleDragEnd({ source, destination: {
          droppableId: QUICK_STRIP_ID,
          index: 0,
        }});
        focusFirstQuickStripItem();
        break;
      case MENU_EVENTS.MORE_PANEL.PUT_BACK_ALL_CHOICES:
      case MENU_EVENTS.QUICK_STRIP.PUT_BACK_ALL_CHOICES:
      case MENU_EVENTS.HOLDING_BOX.REMOVE_FROM_HOLDING_BOX:
        setConfirmDialogOpen(true);
        break;
      case MENU_EVENTS.MORE_PANEL.MOVE_TO_HOLDING_BOX:
      case MENU_EVENTS.QUICK_STRIP.MOVE_TO_HOLDING_BOX:
        handleDragEnd({ source, destination: {
          droppableId: `${HOLDING_BOX_ID}${0}`,
          index: 0,
        }});
        focusFirstHoldingBoxItem();
        break;
      case MENU_EVENTS.MORE_PANEL.MOVE_RIGHT:
      case MENU_EVENTS.QUICK_STRIP.MOVE_RIGHT:
        handleDragEnd({ source, destination: {
          ...source,
          index: source.index + 1,
        }});
        break;
      case MENU_EVENTS.MORE_PANEL.MOVE_LEFT:
      case MENU_EVENTS.QUICK_STRIP.MOVE_LEFT:
        handleDragEnd({ source, destination: {
          ...source,
          index: source.index - 1,
        }});
        break;
      case MENU_EVENTS.MORE_PANEL.MOVE_DOWN:
        const nextRowIndex = source.rowIndex + 1;
        const nextDID = changeMoreIDRowIndex(source.droppableId, nextRowIndex);
        handleDragEnd({ source, destination: {
          ...source,
          rowIndex: nextRowIndex,
          droppableId: nextDID,
        }});
        break;
      case MENU_EVENTS.MORE_PANEL.MOVE_UP:
        const prevRowIndex = source.rowIndex - 1;
        const prevDID = changeMoreIDRowIndex(source.droppableId, prevRowIndex);
        handleDragEnd({ source, destination: {
          ...source,
          rowIndex: prevRowIndex,
          droppableId: prevDID,
        }});
        break;
      default:
        break;
    }
  };
  const handleConfirmDialogClose = () => setConfirmDialogOpen(false);
  const handleConfirmDialogSubmit = () => {
    toggleChecked(currentElDetails.item.id);
    handleConfirmDialogClose();
  };
  const focusMenuItem = (el: any) => Boolean(anchorEl) && el && el.focus();
  const saveButtonMapper = (item: ListItemInterface) => {
    const myob = myobList.find(m => m.buttonName === item.id);
    return myob ? myob : (item.id.includes(QUICKSTRIP_SPACER_ID) ? item.id.split(' ')[1] : item.id);
  };
  const onSave = () => {
    setCookie(BUTTON_LIST, [
      ...quickstripList.map(saveButtonMapper),
      ...serviceButtonList,
    ], COOKIE_OPTIONS);
    setCookie(MY_CHOICES_LIST, holdingBoxList.map(saveButtonMapper), COOKIE_OPTIONS);
    setCookie(MORE_PANEL_LIST, morePanelList.map(i => i.map(saveButtonMapper)), COOKIE_OPTIONS);
    window.close();
  };
  const handleMakeYourOwnSubmit = (buttonData?: MYOButtonInterface) => {
    if (!!!buttonData) {
      setMYOBData(undefined);
      return;
    }
    const listItem = mYODataToListItem(buttonData);
    // update myob data
    if (myobData) {
      setAllChoicesList(prevState => prevState.map(
        item => item.id === myobData.buttonName
        ? listItem
        : item
      ));
      setHoldingBoxList(prevState => prevState.map(
        item => item.id === myobData.buttonName
        ? listItem
        : item
      ));
      setQuickstripList(prevState => prevState.map(
        item => item.id === myobData.buttonName
        ? listItem
        : item
      ));
      setMYOBList(prevState => prevState.map(
        item => item.buttonName === myobData.buttonName
        ? buttonData
        : item
      ));
      setChecked(prevChecked => {
        const currentIndex = prevChecked.indexOf(myobData.buttonName);
        const newChecked = [...prevChecked];
        newChecked.splice(currentIndex, 1, listItem.id);
        return newChecked;
      });
      setMYOBData(undefined);
      return;
    }
    setMYOBList(prevState => [...prevState, buttonData]);
    // setAllChoicesList(prevState => ([
    //   listItem,
    //   ...prevState,
    // ]));
    toggleChecked(listItem.id, listItem);
    focusFirstHoldingBoxItem();
  };
  const handleDragStart = (initial: DragStart) => {
    setIsDropDisabled(initial.draggableId.includes(QUICKSTRIP_SPACER_ID));
  };
  const removeCurrentElementFromQuickstrip = () => {
    handleMenuCloseClick();
    setQuickstripList(prevState => prevState.filter(i => i.id !== currentElDetails.item.id));
    focusFirstQuickStripItem();
  };
  const handleMYOBEdit = () => {
    handleMenuCloseClick();
    setMYOBData(myobList.find(d => d.buttonName === currentElDetails.item.id));
  };
  // const toggleMorePanel = () => setMorePanelOpen(prevState => !prevState);
  const toggleShowFinal = () => setShowFinal(prevState => !prevState);
  const addMorePanelRow = () => setMorePanelList(prevState => [...prevState, generateMorePanelRow()]);
  const quickStripKeyMap: {
    [key: string]: (e: any) => void
  } = {
    '+': incrementScaleFactor,
    '-': decrementScaleFactor,
    'π': toggleShowFinal,
    'p': e => e.ctrlKey && e.altKey && toggleShowFinal(),
  };
  const isInMorePanel = (id:string) => morePanelList.some(list => list.some(item => item.id === id));
  const isInHoldingBox = (id:string) => holdingBoxList.some(item => item.id === id);
  const isInQuickstripList = (id:string) => quickstripList.some(item => item.id === id);
  const holdingBoxHasItems = holdingBoxList.length > 0;
  return (
    <div>
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="quickstrip-more-container">
          <div
            style={{
              transform: `scale(${scaleFactor})`,
              transformOrigin: 'bottom right',
            }}
            onKeyDown={e => quickStripKeyMap[e.key] && quickStripKeyMap[e.key](e)}
          >
            <MorePanel
              isDropDisabled={isDropDisabled}
              onAddRow={addMorePanelRow}
              open={morePanelOpen}
              editable={!showFinal}
              items={morePanelList}
              handleMenuOpen={handleMenuOpen}
            />
            <Quickstrip
              handleMenuOpen={handleMenuOpen}
              morePanelOpen={morePanelOpen}
              // toggleMorePanel={toggleMorePanel}
              quickstripList={quickstripList}
              showFinal={showFinal}
              setScaleFactor={setScaleFactor}
            />
          </div>
          <div className="quickstrip-more-absolute-items">
            <Button size="small" onClick={toggleShowFinal}>
              {showFinal ? 'Edit' : 'Preview'}
            </Button>
            <ZoomInIcon
              onClick={incrementScaleFactor}
              fontSize="large"
              color={scaleFactor === 1 ? 'disabled' : undefined}
            />
            <ZoomOutIcon
              onClick={decrementScaleFactor}
              fontSize="large"
              color={scaleFactor === 0.1 ? 'disabled' : undefined}
            />
          </div>
          <Save onSave={onSave} />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <HoldingBox {...{holdingBoxHasItems, handleMenuOpen, holdingBoxChunks, isDropDisabled}} />
          </Grid>
          <Grid item xs={2}>
            <Spacers />
          </Grid>
          <Grid item xs={3}>
            <MakeYourOwn
              data={myobData}
              names={allChoicesList.map(c => c.label)}
              onSubmit={handleMakeYourOwnSubmit}
            />
          </Grid>
        </Grid>
        <AllChoicesList {...{checked, isInHoldingBox, isInQuickstripList, isInMorePanel, isDropDisabled, list: acl, onToggle: toggleChecked}} />
      </DragDropContext>
      <Menu
        id="quickstrip-item-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        keepMounted
        onClose={handleMenuCloseClick}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        {currentMenuItems.map((label, index) => (
          <MenuItem
            {...(index === 0 ? {ref: focusMenuItem} : {})}
            key={label}
            onClick={() => handleMenuItemClick(label)}>
            {label}
          </MenuItem>
        ))}
        {currentElIsSpacer && (
          <MenuItem onClick={removeCurrentElementFromQuickstrip}>
            Remove Spacer
          </MenuItem>
        )}
        {currentElIsMYOB && (
          <MenuItem onClick={handleMYOBEdit}>
            Edit Button
          </MenuItem>
        )}
        {currentElDetails.item.learnMoreLink && (
          <MenuItem
            onClick={() => window.open(currentElDetails.item.learnMoreLink, '_blank')}
          >
            <Link
              href={currentElDetails.item.learnMoreLink}
              variant="body1"
              target="_blank"
              rel="noopener"
              color="textPrimary"
              underline="none"
              onClick={(e: React.MouseEvent) => e.preventDefault()}
              onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
            >
              Learn More
            </Link>
          </MenuItem>
        )}
      </Menu>
      <ConfirmDialog
        description={`Are you sure you want to ${currentMenuItem.toLowerCase()}?`}
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        onSubmit={handleConfirmDialogSubmit} />
    </div>
  );
}

export default DragDropContainer;
