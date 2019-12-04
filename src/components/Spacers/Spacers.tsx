import React from 'react';
import {Droppable} from 'react-beautiful-dnd';
import {Paper, Typography} from '@material-ui/core';
import {
  COMMON_ITEM_CLASS,
  SPACERS_ID,
  SPACER_ITEM_CLASS,
  VISIBLE_SPACER_ID,
  SPACER_ID,
} from '../../constants/constants';
import { newVisibleSpacer, newSpacer } from '../../utils/utils';
import QuickstripItem from '../QuickstripItem/QuickstripItem';

const Spacers: React.FC = () => {
  const [visibleSpacer] = React.useState(newVisibleSpacer());
  const [spacer] = React.useState(newSpacer());
  const commonClassName = `${COMMON_ITEM_CLASS} ${SPACER_ITEM_CLASS}`;
  return (
    <Paper id={SPACERS_ID} tabIndex={0} className="spacers vertical-space-1 border">
      <Typography variant="h5" component="h1" className="pad-1">
        Spacers
      </Typography>
      <div className="spacer-container">
        <span>Spacer</span>
        <Droppable droppableId={SPACER_ID} isDropDisabled={true}>
          {(provided) => (
            <div
              id={SPACER_ID}
              ref={provided.innerRef}
              {...provided.droppableProps}>
              <QuickstripItem
                className={commonClassName}
                item={spacer}
                index={0}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <div className="spacer-container">
        <span>Visible Spacer</span>
        <Droppable droppableId={VISIBLE_SPACER_ID} isDropDisabled={true}>
          {(provided) => (
            <div
              id={VISIBLE_SPACER_ID}
              ref={provided.innerRef}
              {...provided.droppableProps}>
              <QuickstripItem
                className={commonClassName}
                item={visibleSpacer}
                index={0}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </Paper>
  );
}

export default Spacers;
