import * as React from 'react';
import {Droppable} from 'react-beautiful-dnd';
import {ListItemInterface} from '../../interfaces';
import Paper from '@material-ui/core/Paper';
import {
  COMMON_ITEM_CLASS,
  QUICK_STRIP_ID,
  QUICK_STRIP_ITEM_CLASS,
} from '../../constants/constants';
import {getListStyle} from '../../utils/utils';
import QuickstripItem from '../QuickstripItem/QuickstripItem';
import {ReactComponent as Logo} from '../../assets/quickstrip-logo.svg';
import CloseIcon from '@material-ui/icons/Close';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Button from '@material-ui/core/Button';

export interface QuickstripProps {
  handleMenuOpen: (e: any, o: any) => void;
  onDownload: () => void;
  quickstripList: ListItemInterface[];
}

const Quickstrip: React.FC<QuickstripProps> = ({
  handleMenuOpen,
  onDownload,
  quickstripList,
}) => {
  const quickStripRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(610);
  const [showFinal, setShowFinal] = React.useState(false);
  const [scaleFactor, setScaleFactor] = React.useState(1);
  const incrementScaleFactor = () => setScaleFactor(prevState => (prevState + 0.1) >= 1 ? 1 : (prevState + 0.1));
  const decrementScaleFactor = () => setScaleFactor(prevState => (prevState - 0.1) <= 0.1 ? 0.1 : (prevState - 0.1));
  const toggleShowFinal = () => setShowFinal(prevState => !prevState);
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
  const quickStripKeyMap: {
    [key: string]: (e: any) => void
  } = {
    '+': incrementScaleFactor,
    '-': decrementScaleFactor,
    'π': toggleShowFinal,
    'p': e => e.ctrlKey && e.altKey && toggleShowFinal(),
  };
  // make sure quickstrip can fit all items
  React.useEffect(() => {
    setWidth(610 + ((quickstripList.length - (showFinal ? 1 : 0)) * 104))
  }, [quickstripList.length, showFinal]);
  return (
    <div className="quickstrip-wrapper">
      <Paper
        id={QUICK_STRIP_ID}
        tabIndex={0}
        className="quickstrip-container"
        elevation={0}
        square={true}
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'bottom right',
          width,
        }}
        onKeyDown={e => quickStripKeyMap[e.key] && quickStripKeyMap[e.key](e)}
      >
        <div className="logo pad-1">
          <Logo />
        </div>
        <Droppable droppableId={QUICK_STRIP_ID} direction="horizontal">
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
                    usePortal={true} />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="quickstrip-more-btns">
          <div>MORE...<br /><br />(&&nbsp;HELP)</div>
          <div className="save">Save</div>
          <div>Undo</div>
          <div className="empty" />
          <div className="small-text">Reset to Standard</div>
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
      <div className="quickstrip-absolute-items">
        <Button size="small" onClick={toggleShowFinal}>
          {showFinal ? 'Edit' : 'Preview'}
        </Button>
        <Button size="small" onClick={onDownload}>
          Download
        </Button>
        <ZoomInIcon onClick={incrementScaleFactor} />
        <ZoomOutIcon onClick={decrementScaleFactor} />
      </div>
    </div>
  );
}

export default Quickstrip;
