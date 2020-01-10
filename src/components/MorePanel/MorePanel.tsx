import * as React from 'react';
import {ListItemInterface} from '../../interfaces';
import {Droppable} from 'react-beautiful-dnd';
import {
  COMMON_ITEM_CLASS,
  // GRID,
  MORE_PANEL_ID,
  MORE_PANEL_ITEM_CLASS,
} from '../../constants/constants';
import {getListStyle} from '../../utils/utils';
import QuickstripItem from '../QuickstripItem/QuickstripItem';
import {Button} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

export interface MorePanelProps {
  isDropDisabled?: boolean;
  onAddRow?: () => void;
  open?: boolean;
  editable?: boolean;
  items?: ListItemInterface[][];
}

const MorePanel: React.FC<MorePanelProps> = ({
  isDropDisabled = false,
  onAddRow = () => undefined,
  open = true,
  editable = true,
  items = [],
}) => {
  return open
    ? (
      <div className="more-panel">
        <div className="static-row">
          <div className="tell-me-more-box">
            Tell me more about
            <ul>
              <li>Morphic and what it is</li>
              <li>How to create or edit my own preferences</li>
              <li>How to make a new key</li>
              <li>How to use this at home</li>
              <li>How to convert my documents</li>
              <li>Other frequently asked questions</li>
              <li>Other help topics</li>
              <li>Help me with ___</li>
            </ul>
          </div>
          <div>
            <h3>Things to try</h3>
            <div className="button">Button 1</div>
            <div className="button">Button 2</div>
            <div className="button">Button 3</div>
            <div className="button">Button 4</div>
          </div>
          <div>
            <h3>Managing settings</h3>
            <div className="button">Button 5</div>
            <div className="button">Button 6</div>
            <div className="button">Button 7</div>
            <div className="button">Button 8</div>
          </div>
        </div>
        {items.map((row, rowIndex) => {
          return (
            <div className="more-panel-row" key={rowIndex}>
              {row.map((item, index) => {
                const droppableId = `${MORE_PANEL_ID}-${rowIndex}-${index}`;
                return (
                  <Droppable
                    key={index}
                    droppableId={droppableId}
                    direction="horizontal"
                    isDropDisabled={isDropDisabled || !editable}>
                    {(provided, snapshot) => (
                      <div
                        id={droppableId}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver, 'white')}
                        className={`more-panel-droppable${!editable ? ' show-final' : ''}`}
                        {...provided.droppableProps}>
                        {item.id && (
                          <QuickstripItem
                            className={`${COMMON_ITEM_CLASS} ${MORE_PANEL_ITEM_CLASS}`}
                            key={item.id}
                            item={item}
                            index={index}
                          />
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          );
        })}
        <Button onClick={onAddRow}>
          <AddIcon fontSize="small" />
          Add Row
        </Button>
      </div>
    )
    : null;
}

export default MorePanel;