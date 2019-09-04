import {
  ALL_CHOICES_ID,
  HOLDING_BOX_ID,
  MAKE_YOUR_OWN_ID,
  QUICK_STRIP_ID,
  COMMON_ITEM_CLASS,
  IS_DRAGGING_CLASS,
  CONFIRM_DIALOG_YES_BTN_ID,
  CONFIRM_DIALOG_NO_BTN_ID,
  HOLDING_BOX_ITEM_CLASS,
  MAKE_YOUR_OWN_ITEM_CLASS,
  QUICK_STRIP_ITEM_CLASS,
  ALL_CHOICES_ITEM_CLASS,
} from '../constants/constants';

const mainFocusList = [
  QUICK_STRIP_ID,
  HOLDING_BOX_ID,
  MAKE_YOUR_OWN_ID,
  ALL_CHOICES_ID,
];
const previousChildElementIndex = [
  -1, // QUICK_STRIP_ID
  -1, // HOLDING_BOX_ID
  -1, // MAKE_YOUR_OWN_ID
  -1, // ALL_CHOICES_ID
];
const dialogBtns = [
  CONFIRM_DIALOG_YES_BTN_ID,
  CONFIRM_DIALOG_NO_BTN_ID,
];

const focusedOnList = (list: string[]) => list.indexOf(document.activeElement!.id);

const indexOfActiveElementWithin = (selector: string) =>
  Array.from(document.querySelectorAll(`.${selector}`)).indexOf(document.activeElement!);

const getParentFocusIndex = () => {
  const indexOfQuickStripItem = indexOfActiveElementWithin(QUICK_STRIP_ITEM_CLASS);
  if (indexOfQuickStripItem > -1) {
    previousChildElementIndex[0] = indexOfQuickStripItem;
    return 0;
  }
  const indexOfHoldingBoxItem = indexOfActiveElementWithin(HOLDING_BOX_ITEM_CLASS);
  if (indexOfHoldingBoxItem > -1) {
    previousChildElementIndex[1] = indexOfHoldingBoxItem;
    return 1;
  }
  const indexOfMakeYourOwnItem = indexOfActiveElementWithin(MAKE_YOUR_OWN_ITEM_CLASS);
  if (indexOfMakeYourOwnItem > -1) {
    previousChildElementIndex[2] = indexOfMakeYourOwnItem;
    return 2;
  }
  const indexOfAllChoicesItem = indexOfActiveElementWithin(ALL_CHOICES_ITEM_CLASS);
  if (indexOfAllChoicesItem > -1) {
    previousChildElementIndex[3] = indexOfAllChoicesItem;
    return 3;
  }
  return focusedOnList(mainFocusList);
};

const tabHandler = () => {
  const currentDOMIndex = getParentFocusIndex();
  const mainFocusListIndex =
    // base tabbing logic
    currentDOMIndex === mainFocusList.length - 1
    ? 0
    : currentDOMIndex + 1;
  // focus on child element if it was previously in focus
  const childIndex = previousChildElementIndex[mainFocusListIndex];
  if (childIndex > -1) {
    const nodes = Array.from(document.querySelectorAll(
      `#${mainFocusList[mainFocusListIndex]} .${COMMON_ITEM_CLASS}`
    ));
    if (nodes[childIndex]) {
      (nodes[childIndex] as HTMLElement).focus();
      return;
    } else if (nodes.length > 0) {
      (nodes[nodes.length - 1] as HTMLElement).focus();
      return;
    }
  }
  // focus on element within main list
  (document.getElementById(mainFocusList[mainFocusListIndex]) as HTMLElement).focus();
};

const getCommonNodes = () => {
  // handle confirm dialog navigation
  if (focusedOnList(dialogBtns) !== -1) {
    const btnNodes = dialogBtns.map(id => document.querySelector(`#${id}`));
    const btnNodeIndex = btnNodes.indexOf(document.activeElement!);
    return {
      currentNodeIndex: btnNodeIndex,
      nodes: btnNodes,
      shouldNotHandle: false,
    };
  }
  const parentFocusIndex = getParentFocusIndex();
  // do not handle if element is not within parent list
  if (parentFocusIndex === -1) {
    return {
      currentNodeIndex: -1,
      nodes: [],
      shouldNotHandle: true,
    };
  }
  const nodes = Array.from(document.querySelectorAll(
    `#${mainFocusList[parentFocusIndex]} .${COMMON_ITEM_CLASS}`
  ));
  return {
    currentNodeIndex: nodes.indexOf(document.activeElement!),
    nodes,
    shouldNotHandle: nodes.some(n => n.className.includes(IS_DRAGGING_CLASS)),
  };
};

const arrowLeftHandler = () => {
  let {currentNodeIndex, nodes, shouldNotHandle} = getCommonNodes();
  if (shouldNotHandle) {
    return;
  }
  if (currentNodeIndex === 0) {
    currentNodeIndex = nodes.length - 1;
  } else if (currentNodeIndex === -1) {
    currentNodeIndex = 0;
  } else {
    currentNodeIndex -= 1;
  }
  if (nodes[currentNodeIndex]) {
    (nodes[currentNodeIndex] as HTMLElement).focus();
  }
};

const arrowRightHandler = () => {
  let {currentNodeIndex, nodes, shouldNotHandle} = getCommonNodes();
  if (shouldNotHandle) {
    return;
  }
  if (currentNodeIndex === -1 || currentNodeIndex === nodes.length - 1) {
    currentNodeIndex = 0;
  } else {
    currentNodeIndex += 1;
  }
  if (nodes[currentNodeIndex]) {
    (nodes[currentNodeIndex] as HTMLElement).focus();
  }
};

const keyHandlerMap: {[key:string]: Function} = {
  Tab: tabHandler,
  ArrowLeft: arrowLeftHandler,
  ArrowRight: arrowRightHandler,
  ArrowUp: arrowLeftHandler,
  ArrowDown: arrowRightHandler,
};

export function focusFirstQuickStripItem() {
  setTimeout(() => {
    (document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}`) as HTMLElement).focus();
  }, 100);
}

export function focusFirstHoldingBoxItem() {
  setTimeout(() => {
    (document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}`) as HTMLElement).focus();
  }, 100);
}

export default function keyboardHandler(e: any) {
  if (keyHandlerMap[e.key]) {
    e.preventDefault();
    keyHandlerMap[e.key]();
  }
}