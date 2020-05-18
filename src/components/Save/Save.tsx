import React from 'react';
import {Button, Paper, Typography} from '@material-ui/core';
import {
  COMMON_ITEM_CLASS,
  SAVE_ID,
  SAVE_ITEM_CLASS,
  VIDEO_ID,
  VIDEO_ITEM_CLASS,
} from '../../constants/constants';

export interface ISave {
  onSave: () => void;
  showFinal?: boolean;
  toggleShowFinal?: () => void;
}

const Save: React.FC<ISave> = ({onSave, showFinal, toggleShowFinal}) => {
  const commonSaveClassName = `${COMMON_ITEM_CLASS} ${SAVE_ITEM_CLASS}`;
  const commonVideoClassName = `${COMMON_ITEM_CLASS} ${VIDEO_ITEM_CLASS}`;
  return (
    <div className="save-container">
      <Paper id={VIDEO_ID} tabIndex={0} className="border">
        <Typography variant="subtitle1" component="h1" className="pad-1-2">
          Getting Started
        </Typography>
        <iframe
          tabIndex={0}
          title="Video: Getting Started"
          width="235"
          height="132"
          src="https://www.youtube.com/embed/P_u10xGejlg"
          frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={commonVideoClassName}
        />
      </Paper>
      <Paper id={SAVE_ID} tabIndex={0} className="border">
        <Typography variant="subtitle1" component="h1" className="pad-1-2">
          View & Save your QuickStrip
        </Typography>
        <div className="buttons-container">
          <Button
            className={commonSaveClassName}
            variant="outlined"
            onClick={toggleShowFinal}
          >
            {showFinal ? 'Edit' : 'Preview'}
          </Button>
          <Button
            className={commonSaveClassName}
            variant="outlined"
            onClick={onSave}
          >
            Save your QuickStrip
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default Save;
