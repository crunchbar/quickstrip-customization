import * as React from 'react';
import {Droppable} from 'react-beautiful-dnd';
import {ListItemInterface} from '../../interfaces';
import Paper from '@material-ui/core/Paper';
import {
  COMMON_ITEM_CLASS,
  GRID,
  QUICK_STRIP_ID,
  QUICK_STRIP_ITEM_CLASS,
  QUICKSTRIP_SPACER_ID,
  QUICK_STRIP_SPACER_LIST_ID,
} from '../../constants/constants';
import {getListStyle} from '../../utils/utils';
import QuickstripItem from '../QuickstripItem/QuickstripItem';
import {ReactComponent as Logo} from '../../assets/quickstrip-logo.svg';
import CloseIcon from '@material-ui/icons/Close';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {startCase} from 'lodash/fp';

export interface QuickstripProps {
  handleMenuOpen: (e: any, o: any) => void;
  quickstripList: ListItemInterface[];
  morePanelOpen?: boolean;
  toggleMorePanel?: () => void;
  showFinal?: boolean;
  setScaleFactor: React.Dispatch<React.SetStateAction<number>>;
  serviceList?: string[];
  moreSpacerList?: ListItemInterface[];
  isSpacerDropDisabled?: boolean;
}

const Quickstrip: React.FC<QuickstripProps> = ({
  handleMenuOpen,
  quickstripList,
  morePanelOpen = false,
  toggleMorePanel = () => undefined,
  showFinal = false,
  setScaleFactor,
  serviceList = [],
  moreSpacerList = [],
  isSpacerDropDisabled = false,
}) => {
  const quickStripRef = React.useRef<HTMLDivElement | null>(null);
  const displayServiceList = serviceList
    .map(s => s.slice(8))
    .filter(l => l === 'close' || l === 'more' ? false : true);
  const numOfServices = displayServiceList.length
  const numOfSpacers = quickstripList.filter(i => i.id.includes(QUICKSTRIP_SPACER_ID)).length;
  const numOfItems = (quickstripList.length - (showFinal ? 1 : 0) - numOfSpacers);
  const numOfService = Math.ceil(numOfServices / 2);
  const itemWidth = GRID * 13;
  const moreContainerWidth =
    ((numOfService + 1 + (showFinal ? 0 : 1)) * (itemWidth + 2))
    + (moreSpacerList.length * (GRID * 3));
  const width = (
    261
    + moreContainerWidth
    + (numOfItems * itemWidth)
    + (numOfSpacers * itemWidth)
  );
  const calculateNextScaleFactor = (x: number, y: number) => {
    if (x === 0 && y === 0) {
      return;
    }
    setScaleFactor(prevState => {
      const nextScaleFactor = prevState - ((y || x) / (width * (5 / 6)));
      if (nextScaleFactor >= 1) {
        return 1;
      }
      if (nextScaleFactor <= 0.1) {
        return 0.1;
      }
      return nextScaleFactor;
    });
  };
  const handleQuickStripMouseScale = (event: any) => {
    const {buttons, movementY, movementX} = event;
    if (buttons === 1) {
      calculateNextScaleFactor(movementX, movementY);
    }
  };
  const handleQuickStripTouchScale = (() => {
    let lastX: number;
    let lastY: number;
    return (event: any) => {
      const {clientX, clientY} = event.changedTouches[0];
      if (lastX === undefined) {
        lastX = clientX;
        lastY = clientY;
        return;
      }
      calculateNextScaleFactor(clientX - lastX, clientY - lastY);
      lastX = clientX;
      lastY = clientY;
    };
  })();
  return (
    <div className="quickstrip-wrapper">
      <Paper
        id={QUICK_STRIP_ID}
        tabIndex={0}
        className="quickstrip-container"
        elevation={0}
        square={true}
        style={{width}}
      >
        <div className="logo pad-1">
          <Logo />
        </div>
        <Droppable
          droppableId={QUICK_STRIP_ID}
          direction="horizontal"
          isDropDisabled={showFinal}
        >
          {(provided, snapshot) => (
            <div
              ref={ref => {provided.innerRef(ref); quickStripRef.current = ref;}}
              style={getListStyle(snapshot.isDraggingOver, 'white')}
              className={`quickstrip-droppable ${showFinal ? 'show-final' : ''}`}
              {...provided.droppableProps}>
              {quickstripList.map((item, index) => {
                const openMenu = (e: any) => handleMenuOpen(e, {
                  droppableId: QUICK_STRIP_ID,
                  index,
                  item,
                });
                return (
                  <QuickstripItem
                    className={`${COMMON_ITEM_CLASS} ${QUICK_STRIP_ITEM_CLASS}`}
                    key={item.id}
                    item={item}
                    index={index}
                    onContextMenu={openMenu}
                    onKeyPress={openMenu}
                    onDoubleClick={openMenu}
                    usePortal={true}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div
          className="quickstrip-more-btns"
          style={{width: moreContainerWidth}}
        >
          <div
            onClick={toggleMorePanel}
            className={`more-btn${morePanelOpen ? ' active' : ''}`}
          >
            MORE...<br /><br />(&&nbsp;HELP)
          </div>
          <Droppable
            droppableId={QUICK_STRIP_SPACER_LIST_ID}
            direction="horizontal"
            isDropDisabled={showFinal || isSpacerDropDisabled}
          >
            {(provided, snapshot) => (
              <div
                ref={ref => provided.innerRef(ref)}
                style={getListStyle(snapshot.isDraggingOver, 'white')}
                className={`quickstrip-more-spacer-droppable ${showFinal ? 'show-final' : ''}`}
                {...provided.droppableProps}
              >
                {moreSpacerList.map((item, index) => {
                  const openMenu = (e: any) => handleMenuOpen(e, {
                    droppableId: QUICK_STRIP_SPACER_LIST_ID,
                    index,
                    item,
                  });
                  return (
                    <QuickstripItem
                      className={`${COMMON_ITEM_CLASS} ${QUICK_STRIP_ITEM_CLASS}`}
                      key={item.id}
                      item={item}
                      index={index}
                      onContextMenu={openMenu}
                      onKeyPress={openMenu}
                      onDoubleClick={openMenu}
                      usePortal={true}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {displayServiceList.map((l, i) => (
            <div
              key={i}
              className={`${l}${l.length > 9 ? ' small-text' : ''}`}
            >
              {startCase(l)}
            </div>
          ))}
        </div>
        <div className="quikstrip-close-icon">
          <CloseIcon />
        </div>
        <div
          className="quickstrip-scale-handle"
          onMouseMove={handleQuickStripMouseScale}
          onTouchMove={handleQuickStripTouchScale}>
          <DragHandleIcon />
        </div>
      </Paper>
    </div>
  );
}

export default Quickstrip;
