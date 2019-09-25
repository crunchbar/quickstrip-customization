import React from 'react';
import {Droppable} from 'react-beautiful-dnd';
import {Paper, Typography} from '@material-ui/core';
import {
  COMMON_ITEM_CLASS,
  SPACERS_ID,
  SPACER_ITEM_CLASS,
  THIN_SPACER_ID,
  WIDE_SPACER_ID,
} from '../../constants/constants';
import { newThinSpacer, newWideSpacer } from '../../utils/utils';
import QuickstripItem from '../QuickstripItem/QuickstripItem';

const Spacers: React.FC = () => {
  const [thinSpacer] = React.useState(newThinSpacer());
  const [wideSpacer] = React.useState(newWideSpacer());
  const commonClassName = `${COMMON_ITEM_CLASS} ${SPACER_ITEM_CLASS}`;
  return (
    <Paper id={SPACERS_ID} tabIndex={0} className="spacers vertical-space-1">
      <Typography variant="h5" component="h1" className="pad-1">
        Spacers
      </Typography>
      <div className="spacer-container">
        <Droppable droppableId={WIDE_SPACER_ID} isDropDisabled={true}>
          {(provided) => (
            <div
              id={WIDE_SPACER_ID}
              ref={provided.innerRef}
              {...provided.droppableProps}>
              <QuickstripItem
                className={commonClassName}
                item={wideSpacer}
                index={0}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <div className="spacer-container">
        <span>Narrow Spacer</span>
        <Droppable droppableId={THIN_SPACER_ID} isDropDisabled={true}>
          {(provided) => (
            <div
              id={THIN_SPACER_ID}
              ref={provided.innerRef}
              {...provided.droppableProps}>
              <QuickstripItem
                className={commonClassName}
                item={thinSpacer}
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
