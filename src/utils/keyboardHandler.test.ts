import {
  ALL_CHOICES_ID,
  HOLDING_BOX_ID,
  MAKE_YOUR_OWN_ID,
  QUICK_STRIP_ID,
  COMMON_ITEM_CLASS,
  // IS_DRAGGING_CLASS,
  // CONFIRM_DIALOG_YES_BTN_ID,
  // CONFIRM_DIALOG_NO_BTN_ID,
  HOLDING_BOX_ITEM_CLASS,
  QUICK_STRIP_ITEM_CLASS,
  ALL_CHOICES_ITEM_CLASS,
  MAKE_YOUR_OWN_ITEM_CLASS,
} from '../constants/constants';
import keyboardHandler from './keyboardHandler';

let preventDefaultCalled = false;

const bodyInnerHTML = 
  `<div>
    <div id="${QUICK_STRIP_ID}" tabindex="0">
      <div class="${COMMON_ITEM_CLASS} ${QUICK_STRIP_ITEM_CLASS}" tabindex="0"></div>
      <div class="${COMMON_ITEM_CLASS} ${QUICK_STRIP_ITEM_CLASS}" tabindex="0"></div>
    </div>
    <div id="${HOLDING_BOX_ID}" tabindex="0">
      <div class="${COMMON_ITEM_CLASS} ${HOLDING_BOX_ITEM_CLASS}" tabindex="0"></div>
      <div class="${COMMON_ITEM_CLASS} ${HOLDING_BOX_ITEM_CLASS}" tabindex="0"></div>
    </div>
    <div id="${MAKE_YOUR_OWN_ID}" tabindex="0">
      <div class="${COMMON_ITEM_CLASS} ${MAKE_YOUR_OWN_ITEM_CLASS}" tabindex="0"></div>
      <div class="${COMMON_ITEM_CLASS} ${MAKE_YOUR_OWN_ITEM_CLASS}" tabindex="0"></div>
    </div>
    <div id="${ALL_CHOICES_ID}" tabindex="0">
      <div class="${COMMON_ITEM_CLASS} ${ALL_CHOICES_ITEM_CLASS}" tabindex="0"></div>
      <div class="${COMMON_ITEM_CLASS} ${ALL_CHOICES_ITEM_CLASS}" tabindex="0"></div>
    </div>
  </div>`;

const preventDefault = () => {
  preventDefaultCalled = true;
};

const keyboardHandlerWrapper = (key: string) => {
  keyboardHandler({key, preventDefault});
};

describe('keyboardHandler', () => {
  beforeAll(() => {
    document.addEventListener('keydown', keyboardHandler, true);
  });
  beforeEach(() => {
    (document.activeElement as HTMLElement).blur();
    document.body.innerHTML = bodyInnerHTML;
    preventDefaultCalled = false;
  });
  afterAll(() => {
    document.removeEventListener('keydown', keyboardHandler, true);
  });
  it('should call preventDefault on event if event handler found', () => {
    keyboardHandlerWrapper('Tab');
    expect(preventDefaultCalled).toEqual(true);
  });
  it('should focus on quick strip on single tab', () => {
    keyboardHandlerWrapper('Tab');
    expect(document.activeElement).toEqual(document.getElementById(QUICK_STRIP_ID));
  });
  it('should focus on holding box on double tab', () => {
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    expect(document.activeElement).toEqual(document.getElementById(HOLDING_BOX_ID));
  });
  it('should focus on make your own box on triple tab', () => {
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    expect(document.activeElement).toEqual(document.getElementById(MAKE_YOUR_OWN_ID));
  });
  it('should focus on all choices list on quadruple tab', () => {
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    expect(document.activeElement).toEqual(document.getElementById(ALL_CHOICES_ID));
  });
  it('should focus on previously focused child quickstrip element on tab back to quickstrip', () => {
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('ArrowRight');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:first-child`));
  });
  it('should focus on previously focused child holding box element on tab back to holdingbox', () => {
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('ArrowRight');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:first-child`));
  });
  it('should focus on previously focused child make your own element on tab back to make your own box', () => {
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('ArrowRight');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:first-child`));
  });
  it('should focus on previously focused child all choices list element on tab back to all choices list', () => {
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('ArrowRight');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    keyboardHandlerWrapper('Tab');
    expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:first-child`));
  });
  describe('when on quickstrip', () => {
    beforeEach(() => {
      keyboardHandlerWrapper('Tab');
    })
    it('should focus on first quickstrip item on right arrow key', () => {
      keyboardHandlerWrapper('ArrowRight');
      expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:first-child`));
    });
    it('should focus on second quickstrip item on 2 right arrow keys', () => {
      keyboardHandlerWrapper('ArrowRight');
      keyboardHandlerWrapper('ArrowRight');
      expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:last-child`));
    });
    it('should focus on first quickstrip item on left arrow key', () => {
      keyboardHandlerWrapper('ArrowLeft');
      expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:first-child`));
    });
    it('should focus on second quickstrip item on 2 left arrow keys', () => {
      keyboardHandlerWrapper('ArrowLeft');
      keyboardHandlerWrapper('ArrowLeft');
      expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:last-child`));
    });
    it('should focus on first quickstrip item on up arrow key', () => {
      keyboardHandlerWrapper('ArrowUp');
      expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:first-child`));
    });
    it('should focus on second quickstrip item on 2 up arrow keys', () => {
      keyboardHandlerWrapper('ArrowUp');
      keyboardHandlerWrapper('ArrowUp');
      expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:last-child`));
    });
    it('should focus on first quickstrip item on down arrow key', () => {
      keyboardHandlerWrapper('ArrowDown');
      expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:first-child`));
    });
    it('should focus on second quickstrip item on 2 down arrow keys', () => {
      keyboardHandlerWrapper('ArrowDown');
      keyboardHandlerWrapper('ArrowDown');
      expect(document.activeElement).toEqual(document.querySelector(`.${QUICK_STRIP_ITEM_CLASS}:last-child`));
    });
  });
  describe('when on holding box', () => {
    beforeEach(() => {
      keyboardHandlerWrapper('Tab');
      keyboardHandlerWrapper('Tab');
    })
    it('should focus on first holding box item on right arrow key', () => {
      keyboardHandlerWrapper('ArrowRight');
      expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:first-child`));
    });
    it('should focus on second holding box item on 2 right arrow keys', () => {
      keyboardHandlerWrapper('ArrowRight');
      keyboardHandlerWrapper('ArrowRight');
      expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:last-child`));
    });
    it('should focus on first holding box item on left arrow key', () => {
      keyboardHandlerWrapper('ArrowLeft');
      expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:first-child`));
    });
    it('should focus on second holding box item on 2 left arrow keys', () => {
      keyboardHandlerWrapper('ArrowLeft');
      keyboardHandlerWrapper('ArrowLeft');
      expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:last-child`));
    });
    it('should focus on first holding box item on up arrow key', () => {
      keyboardHandlerWrapper('ArrowUp');
      expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:first-child`));
    });
    it('should focus on second holding box item on 2 up arrow keys', () => {
      keyboardHandlerWrapper('ArrowUp');
      keyboardHandlerWrapper('ArrowUp');
      expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:last-child`));
    });
    it('should focus on first holding box item on down arrow key', () => {
      keyboardHandlerWrapper('ArrowDown');
      expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:first-child`));
    });
    it('should focus on second holding box item on 2 down arrow keys', () => {
      keyboardHandlerWrapper('ArrowDown');
      keyboardHandlerWrapper('ArrowDown');
      expect(document.activeElement).toEqual(document.querySelector(`.${HOLDING_BOX_ITEM_CLASS}:last-child`));
    });
  });
  describe('when on make your own box', () => {
    beforeEach(() => {
      keyboardHandlerWrapper('Tab');
      keyboardHandlerWrapper('Tab');
      keyboardHandlerWrapper('Tab');
    })
    it('should focus on first make your own item on right arrow key', () => {
      keyboardHandlerWrapper('ArrowRight');
      expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:first-child`));
    });
    it('should focus on second make your own item on 2 right arrow keys', () => {
      keyboardHandlerWrapper('ArrowRight');
      keyboardHandlerWrapper('ArrowRight');
      expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:last-child`));
    });
    it('should focus on first make your own item on left arrow key', () => {
      keyboardHandlerWrapper('ArrowLeft');
      expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:first-child`));
    });
    it('should focus on second make your own item on 2 left arrow keys', () => {
      keyboardHandlerWrapper('ArrowLeft');
      keyboardHandlerWrapper('ArrowLeft');
      expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:last-child`));
    });
    it('should focus on first make your own item on up arrow key', () => {
      keyboardHandlerWrapper('ArrowUp');
      expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:first-child`));
    });
    it('should focus on second make your own item on 2 up arrow keys', () => {
      keyboardHandlerWrapper('ArrowUp');
      keyboardHandlerWrapper('ArrowUp');
      expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:last-child`));
    });
    it('should focus on first make your own item on down arrow key', () => {
      keyboardHandlerWrapper('ArrowDown');
      expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:first-child`));
    });
    it('should focus on second make your own item on 2 down arrow keys', () => {
      keyboardHandlerWrapper('ArrowDown');
      keyboardHandlerWrapper('ArrowDown');
      expect(document.activeElement).toEqual(document.querySelector(`.${MAKE_YOUR_OWN_ITEM_CLASS}:last-child`));
    });
  });
  describe('when on all choices list', () => {
    beforeEach(() => {
      keyboardHandlerWrapper('Tab');
      keyboardHandlerWrapper('Tab');
      keyboardHandlerWrapper('Tab');
      keyboardHandlerWrapper('Tab');
    })
    it('should focus on first all choices list item on right arrow key', () => {
      keyboardHandlerWrapper('ArrowRight');
      expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:first-child`));
    });
    it('should focus on second all choices list item on 2 right arrow keys', () => {
      keyboardHandlerWrapper('ArrowRight');
      keyboardHandlerWrapper('ArrowRight');
      expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:last-child`));
    });
    it('should focus on first all choices list item on left arrow key', () => {
      keyboardHandlerWrapper('ArrowLeft');
      expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:first-child`));
    });
    it('should focus on second all choices list item on 2 left arrow keys', () => {
      keyboardHandlerWrapper('ArrowLeft');
      keyboardHandlerWrapper('ArrowLeft');
      expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:last-child`));
    });
    it('should focus on first all choices list item on up arrow key', () => {
      keyboardHandlerWrapper('ArrowUp');
      expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:first-child`));
    });
    it('should focus on second all choices list item on 2 up arrow keys', () => {
      keyboardHandlerWrapper('ArrowUp');
      keyboardHandlerWrapper('ArrowUp');
      expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:last-child`));
    });
    it('should focus on first all choices list item on down arrow key', () => {
      keyboardHandlerWrapper('ArrowDown');
      expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:first-child`));
    });
    it('should focus on second all choices list item on 2 down arrow keys', () => {
      keyboardHandlerWrapper('ArrowDown');
      keyboardHandlerWrapper('ArrowDown');
      expect(document.activeElement).toEqual(document.querySelector(`.${ALL_CHOICES_ITEM_CLASS}:last-child`));
    });
  });
});