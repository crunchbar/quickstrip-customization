export interface ListItemInterface {
  description: string;
  label: string;
  learnMoreLink?: string;
  id: string;
  popupText?: string;
}

export interface HoldingBoxState {
  holdingBoxList?: ListItemInterface[];
  quickstripList?: ListItemInterface[];
  [key: string]: ListItemInterface[] | undefined;
}

export interface Setting {
  id?: string;
  learnMoreLink?: string;
  messageKey?: string;
  [key: string]: any;
}

export interface Description {
  [key: string]: {
    title: string;
    tooltip?: string;
  };
}

export interface MYOButtonInterface {
  buttonId: string;
  buttonName: string;
  buttonType: string;
  buttonData?: string;
  fullScreen: boolean;
  popupText: string;
  description: string;
}