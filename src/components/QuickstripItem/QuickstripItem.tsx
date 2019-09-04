import React from 'react';
import {createPortal} from 'react-dom';
import {Draggable} from 'react-beautiful-dnd';
import {ListItemInterface} from '../../interfaces';
import ScaleText from 'react-scale-text';
import {ALL_CHOICES_ID, GRID, IS_DRAGGING_CLASS} from '../../constants/constants';
import Tooltip from '@material-ui/core/Tooltip';

export interface QuickstripItemProps extends React.HTMLProps<HTMLDivElement> {
  item: ListItemInterface;
  index: number;
  className?: string;
  usePortal?: boolean;
  onDoubleClick?: (e: any) => void;
}

const getItemStyle = (snapshot: any, provided: any) => ({
  ...provided.draggableProps.style,
  userSelect: 'none',
  padding: GRID * 2,
  margin: `0 ${GRID}px 0 0`,
  borderRadius: 5,
  background: snapshot.isDragging ? 'lightgreen' : 'rgb(11,41,86)',
  color: 'rgb(255,255,255)',
  width: GRID * 12,
  minWidth: GRID * 12,
  height: GRID * 12,
  minHeight: GRID * 12,
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  overflow: 'hidden',
  ...(snapshot.draggingOver === ALL_CHOICES_ID
    && snapshot.isDropAnimating
    ? {
      visibility: 'hidden',
      transitionDuration: '0.001s',
    } : {})
});

const QuickstripItem: React.FC<QuickstripItemProps> = ({
  className,
  item,
  index,
  usePortal = false,
  onDoubleClick = () => {},
  ...htmlDivProps
}) => {
  const handleClick = (e: any) => {
    // if already active, act as a double click
    if (document.activeElement === e.currentTarget) {
      e.type = 'dblclick';
      onDoubleClick(e);
    } else {
      e.currentTarget.focus();
    }
  };
  const optionalPortal = (element: any, isDragging: boolean) => {
    if(usePortal && isDragging) {
      return (
        <React.Fragment>
          {createPortal(
            element,
            document.getElementById('root-draggable-portal')!,
          )}
          <div className={`${className ? className : ''} ${IS_DRAGGING_CLASS}`} />
        </React.Fragment>
      );
    }
    return element;
  };
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <React.Fragment>
          {optionalPortal((
            <Tooltip title={item.popupText || item.description}>
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(snapshot, provided)}
                onClick={handleClick}
                className={`${className ? className : ''} ${snapshot.isDragging
                  ? IS_DRAGGING_CLASS
                  : ''}`}
                {...htmlDivProps}
              >
                <ScaleText maxFontSize={16}>{item.label}</ScaleText>
              </div>
            </Tooltip>
          ), snapshot.isDragging)}
          {provided.placeholder}
        </React.Fragment>
      )}
    </Draggable>
  );
};

export default QuickstripItem;
