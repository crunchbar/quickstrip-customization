import React, {useState} from 'react';
import {Droppable} from 'react-beautiful-dnd';
import {ListItemInterface} from '../../interfaces';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {some} from 'lodash/fp';
import {
  COMMON_ITEM_CLASS,
  HOLDING_BOX_ID,
  HOLDING_BOX_ITEM_CLASS,
} from '../../constants/constants';
import QuickstripItem from '../QuickstripItem/QuickstripItem';
import {getListStyle} from '../../utils/utils';

export interface HoldingBoxProps {
  holdingBoxChunks: ListItemInterface[][];
  handleMenuOpen: (e: any, o: any) => void;
}

const HoldingBox: React.FC<HoldingBoxProps> = ({
  holdingBoxChunks,
  handleMenuOpen,
}) => {
  const [
    holdingBoxDragMap,
    setHoldingBoxDragMap,
  ] = useState<{[key: number]: boolean | undefined}>({});
  return (
    <Paper id={HOLDING_BOX_ID} tabIndex={0} className="vertical-space-1">
      <Typography variant="h5" component="h1" className="pad-1">
        My Choices
      </Typography>
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
                        className={`${COMMON_ITEM_CLASS} ${HOLDING_BOX_ITEM_CLASS}`}
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
