import React, {useState} from 'react';
import {Droppable} from 'react-beautiful-dnd';
import {ListItemInterface} from '../../interfaces';
import {Paper, Tooltip, Typography} from '@material-ui/core';
import {some} from 'lodash/fp';
import {
  COMMON_ITEM_CLASS,
  HOLDING_BOX_ID,
  HOLDING_BOX_ITEM_CLASS,
} from '../../constants/constants';
import QuickstripItem from '../QuickstripItem/QuickstripItem';
import {getListStyle} from '../../utils/utils';
import AddIcon from '@material-ui/icons/Add';

export interface HoldingBoxProps {
  holdingBoxChunks: ListItemInterface[][];
  handleMakeYourOwnButton: () => void;
  handleMenuOpen: (e: any, o: any) => void;
}

const HoldingBox: React.FC<HoldingBoxProps> = ({
  holdingBoxChunks,
  handleMakeYourOwnButton,
  handleMenuOpen,
}) => {
  const [
    holdingBoxDragMap,
    setHoldingBoxDragMap,
  ] = useState<{[key: number]: boolean | undefined}>({});
  const commonClassName = `${COMMON_ITEM_CLASS} ${HOLDING_BOX_ITEM_CLASS}`;
  return (
    <Paper id={HOLDING_BOX_ID} tabIndex={0} className="vertical-space-1">
      <Typography variant="h5" component="h1" className="pad-1">
        My Choices
      </Typography>
      <div className="make-your-own-button-add-container">
        <Tooltip title="Make Your Own Button">
          <button
            aria-label="Make Your Own Button"
            className={commonClassName}
            onClick={handleMakeYourOwnButton}
            onKeyPress={e => e.key === 'Enter' && handleMakeYourOwnButton()}
            tabIndex={0}>
            <AddIcon />
          </button>
        </Tooltip>
      </div>
      {holdingBoxChunks.map((chunk, chunkIndex) => {
        const droppableId = `${HOLDING_BOX_ID}${chunkIndex}`;
        return (
          <Droppable key={chunkIndex} droppableId={droppableId} direction="horizontal">
            {(provided, snapshot) => {
              if (holdingBoxDragMap[chunkIndex] !== snapshot.isDraggingOver) {
                setHoldingBoxDragMap(prevState => ({
                  ...prevState,
                  [chunkIndex]: snapshot.isDraggingOver,
                }));
              }
              return (
                <div
                  id={droppableId}
                  ref={provided.innerRef}
                  style={getListStyle(some(Boolean, holdingBoxDragMap))}
                  {...provided.droppableProps}>
                  {chunk.map((item, index) => {
                    const openMenu = (e: any) => handleMenuOpen(e, {
                      droppableId,
                      index,
                      item,
                    });
                    return (
                      <QuickstripItem
                        className={commonClassName}
                        key={item.id}
                        item={item}
                        index={index}
                        onContextMenu={openMenu}
                        onKeyPress={openMenu}
                        onDoubleClick={openMenu} />
                    );
                  })}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        );
      })}
    </Paper>
  );
}

export default HoldingBox;
