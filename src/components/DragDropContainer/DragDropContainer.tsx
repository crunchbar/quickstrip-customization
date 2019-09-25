import React from 'react';
import {DragDropContext, DragStart} from 'react-beautiful-dnd';
import {ListItemInterface, MYOButtonInterface} from '../../interfaces';
import {chunk} from 'lodash/fp';
import useWindowSize from '../../hooks/useWindowSize';
import {Grid, Link, Menu, MenuItem} from '@material-ui/core';
import {ALL_CHOICES_ID, MENU_EVENTS} from '../../constants';
import {
  GRID,
  HOLDING_BOX_ID,
  QUICK_STRIP_ID,
  QUICKSTRIP_SPACER_ID,
  THIN_SPACER_ID,
  WIDE_SPACER_ID,
} from '../../constants/constants';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import {
  filterEventsByState,
  getMenuItems,
  getUpdatedHBChunks,
  moveItem,
  mYODataToListItem,
  reorderItems,
  newThinSpacer,
  newWideSpacer,
} from '../../utils/utils';
import {
  focusFirstQuickStripItem,
  focusFirstHoldingBoxItem,
} from '../../utils/keyboardHandler';
import Quickstrip from '../Quickstrip/Quickstrip';
import HoldingBox from '../HoldingBox/HoldingBox';
import AllChoicesList from '../AllChoicesList/AllChoicesList';
import MakeYourOwn from '../MakeYourOwn/MakeYourOwn';
import Spacers from '../Spacers/Spacers';

export interface DragDropContainerProps {
  allChoicesList: ListItemInterface[];
  downloadSiteConfig: (buttonList: string[]) => void;
  userButtonList?: string[];
}

const menuItems: {[key: string]: string[]} = {
  [QUICK_STRIP_ID]: getMenuItems(MENU_EVENTS.QUICK_STRIP),
  [HOLDING_BOX_ID]: getMenuItems(MENU_EVENTS.HOLDING_BOX),
};

const DragDropContainer: React.FC<DragDropContainerProps> = ({
  allChoicesList: acl = [],
  downloadSiteConfig,
  userButtonList = [],
}) => {
  const [allChoicesList, setAllChoicesList] = React.useState<ListItemInterface[]>(acl);
  const [holdingBoxList, setHoldingBoxList] = React.useState<ListItemInterface[]>([]);
  const [
    quickstripList,
    setQuickstripList
  ] = React.useState<ListItemInterface[]>(allChoicesList.filter(
    c => userButtonList.indexOf(c.id) > -1 ? true : false
  ));
  const [checked, setChecked] = React.useState<string[]>(userButtonList);
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
  const itemsPerChunk = (containerWidth - (GRID * chunkMultiplier)) / (GRID * 12);
  let holdingBoxChunks = chunk(itemsPerChunk, holdingBoxList);
  while (holdingBoxChunks.length < 2) {
    holdingBoxChunks = [
      ...holdingBoxChunks,
      [],
    ];
  }
  const currentMenuItems = currentElDetails.droppableId.includes(HOLDING_BOX_ID)
    ? menuItems[HOLDING_BOX_ID]
    : filterEventsByState(
      menuItems[QUICK_STRIP_ID],
      quickstripList.length,
      currentElDetails.index
    );
  const getList = (id: string): ListItemInterface[] => (
    id === QUICK_STRIP_ID
    ? quickstripList
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
    // dropped outside the list
    if (!destination) {
      return;
    }
    const newSpacer = source.droppableId === THIN_SPACER_ID
      ? newThinSpacer()
      : source.droppableId === WIDE_SPACER_ID
      ? newWideSpacer()
      : null;
    // add spacer to quickstrip
    if (newSpacer) {
      const quickstripClone = Array.from(quickstripList);
      quickstripClone.splice(destination.index, 0, newSpacer);
      setQuickstripList(quickstripClone);
      return;
    }
    // dropped on all choices (remove)
    if (destination.droppableId === ALL_CHOICES_ID) {
      const sourceList = getList(source.droppableId);
      toggleChecked(sourceList[source.index].id);
      return;
    }
    // dropped within same box therefore reorder
    if (source.droppableId === destination.droppableId) {
      const items = reorderItems(
        getList(source.droppableId),
        source.index,
        destination.index
      );
      if (source.droppableId === QUICK_STRIP_ID) {
        setQuickstripList(items || []);
      } else {
        setHoldingBoxList(getUpdatedHBList(source.droppableId, items));
      }
    } else {
      const result = moveItem(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
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
      if (source.droppableId === QUICK_STRIP_ID) {
        setQuickstripList(result[source.droppableId] || []);
      }
      if (destination.droppableId === QUICK_STRIP_ID) {
        setQuickstripList(result[destination.droppableId] || []);
      }
    }
  }
  const handleMenuOpen = (event: any, currentElDetails: any) => {
    event.preventDefault();
    if (
      event.type === 'contextmenu'
      || event.type === 'dblclick'
      || event.key === 'Enter'
    ) {
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
      case MENU_EVENTS.HOLDING_BOX.MOVE_TO_QUICK_STRIP:
        handleDragEnd({ source, destination: {
          droppableId: QUICK_STRIP_ID,
          index: 0,
        }});
        focusFirstQuickStripItem();
        break;
      case MENU_EVENTS.QUICK_STRIP.PUT_BACK_ALL_CHOICES:
      case MENU_EVENTS.HOLDING_BOX.REMOVE_FROM_HOLDING_BOX:
        setConfirmDialogOpen(true);
        break;
      case MENU_EVENTS.QUICK_STRIP.MOVE_TO_HOLDING_BOX:
        handleDragEnd({ source, destination: {
          droppableId: `${HOLDING_BOX_ID}${0}`,
          index: 0,
        }});
        focusFirstHoldingBoxItem();
        break;
      case MENU_EVENTS.QUICK_STRIP.MOVE_RIGHT:
        handleDragEnd({ source, destination: {
          ...source,
          index: source.index + 1,
        }});
        break;
      case MENU_EVENTS.QUICK_STRIP.MOVE_LEFT:
        handleDragEnd({ source, destination: {
          ...source,
          index: source.index - 1,
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
  const onDownload = () => {
    downloadSiteConfig(quickstripList.map(item => item.id));
  };
  const handleMakeYourOwnSubmit = (buttonData: MYOButtonInterface) => {
    const listItem = mYODataToListItem(buttonData);
    if (allChoicesList.some(choice => choice.id === listItem.id)) {
      return;
    }
    setAllChoicesList(prevState => ([
      listItem,
      ...prevState,
    ]));
    toggleChecked(listItem.id, listItem);
    focusFirstHoldingBoxItem();
  };
  const handleDragStart = (initial: DragStart) => {
    setIsDropDisabled(initial.draggableId.includes(QUICKSTRIP_SPACER_ID));
  };
  const removeCurrentElementFromQuickstrip = () => {
    handleMenuCloseClick();
    setQuickstripList(prevState => prevState.filter(i => i.id !== currentElDetails.item.id));
  };
  return (
    <div>
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Quickstrip {...{handleMenuOpen, onDownload, quickstripList}} />
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <HoldingBox {...{handleMenuOpen, holdingBoxChunks, isDropDisabled}} />
          </Grid>
          <Grid item xs={2}>
            <Spacers />
          </Grid>
          <Grid item xs={3}>
            <MakeYourOwn
              names={allChoicesList.map(c => c.label)}
              onSubmit={handleMakeYourOwnSubmit}
            />
          </Grid>
        </Grid>
        <AllChoicesList {...{checked, isDropDisabled, list: allChoicesList, onToggle: toggleChecked}} />
      </DragDropContext>
      <Menu
        id="quickstrip-item-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        keepMounted
        onClose={handleMenuCloseClick}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        {
          currentElDetails.item.id.includes(QUICKSTRIP_SPACER_ID)
          ? <MenuItem
              ref={focusMenuItem}
              onClick={removeCurrentElementFromQuickstrip}>
              Remove Spacer
            </MenuItem>
          : currentMenuItems.map((label, index) => (
            <MenuItem
              {...(index === 0 ? {ref: focusMenuItem} : {})}
              key={label}
              onClick={() => handleMenuItemClick(label)}>
              {label}
            </MenuItem>
          ))
        }
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
