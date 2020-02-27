import React from 'react';
import {Button, Paper, Typography} from '@material-ui/core';
import {
  COMMON_ITEM_CLASS,
  SAVE_ID,
  SAVE_ITEM_CLASS,
} from '../../constants/constants';

export interface ISave {
  onSave: () => void
}

const Save: React.FC<ISave> = ({onSave}) => {
  const commonClassName = `${COMMON_ITEM_CLASS} ${SAVE_ITEM_CLASS}`;
  return (
    <Paper id={SAVE_ID} tabIndex={0} className="border">
      <Typography variant="h5" component="h1" className="pad-1">
        Make & Save your QuickStrip
      </Typography>
      <iframe
        tabIndex={0}
        title="Video: Getting Started"
        width="320"
        height="180"
        src="https://www.youtube.com/embed/P_u10xGejlg"
        frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={commonClassName}
      />
      <p>Video: Getting Started</p>
      <Button
        className={commonClassName}
        variant="outlined"
        onClick={onSave}
      >
        Save and Exit
      </Button>
    </Paper>
  );
}

export default Save;
