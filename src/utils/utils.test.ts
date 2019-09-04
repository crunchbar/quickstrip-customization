import {
  orderByAscLabel,
  orderByDescLabel,
  filterListByValue,
  getMenuItems,
  reorderItems,
  moveItem,
  getUpdatedHBChunks,
  filterEventsByState,
} from './utils';
import {ListItemInterface} from '../interfaces';
import {HOLDING_BOX_ID} from '../constants/constants';

const listItem1: ListItemInterface = {
  description: 'description1',
  label: 'label1',
  id: 'a',
};

const listItem2: ListItemInterface = {
  description: 'description2',
  label: 'label2',
  id: 'b',
};

describe('utils.orderByAscLabel', () => {
  it('should order list items by ascending label', () => {
    expect(orderByAscLabel([listItem2, listItem1])).toEqual([listItem1, listItem2]);
  });
});

describe('utils.orderByDescLabel', () => {
  it('should order list items by descending label', () => {
    expect(orderByDescLabel([listItem1, listItem2])).toEqual([listItem2, listItem1]);
  });
});

describe('utils.filterListByValue', () => {
  it('should return original list if input value is empty', () => {
    expect(filterListByValue([listItem1, listItem2], '')).toEqual([listItem1, listItem2]);
  });
  it('should return filtered list with labels based on input value', () => {
    expect(filterListByValue([listItem1, listItem2], 'label1')).toEqual([listItem1]);
  });
});

describe('utils.getMenuItems', () => {
  it('should return array of object values', () => {
    expect(getMenuItems({key1: 'value'})).toEqual([
      'value',
    ]);
  });
});

describe('utils.reorderItems', () => {
  it('should return reordered list based on start and end indexes.', () => {
    expect(reorderItems([listItem1, listItem2], 0, 1)).toEqual([listItem2, listItem1]);
  });
});

describe('utils.moveItem', () => {
  it('should move item from source to destination array and return updated arrays', () => {
    expect(moveItem(
      [listItem1],
      [listItem2],
      {index: 0, droppableId: 'source'},
      {index: 1, droppableId: 'destination'},
    )).toEqual({
      source: [],
      destination: [listItem2, listItem1],
    });
  });
});

describe('utils.getUpdatedHBChunks', () => {
  it('should return updated chunk list with provided chunk replacement', () => {
    expect(getUpdatedHBChunks(
      [[listItem1]],
      `${HOLDING_BOX_ID}0`,
      [listItem2],
    )).toEqual([[listItem2]]);
  });
});

describe('utils.filterEventsByState', () => {
  const events = [
    'Move button to right',
    'Move button to left',
    'Move to Holding Box',
    'Put back in All Choices',
  ];
  it('should filter out left/right events if listTotal is 1', () => {
    expect(filterEventsByState(events, 1, 0)).toEqual([events[2], events[3]]);
  });
  it('should only filter out left event if first listItem and listTotal is greater than 1', () => {
    expect(filterEventsByState(events, 2, 0)).toEqual([events[0], events[2], events[3]]);
  });
  it('should only filter out right event if last listItem and listTotal is greater than 1', () => {
    expect(filterEventsByState(events, 2, 1)).toEqual([events[1], events[2], events[3]]);
  });
});
