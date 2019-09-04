import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  CONFIRM_DIALOG_NO_BTN_ID,
  CONFIRM_DIALOG_YES_BTN_ID,
} from '../../constants/constants';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  description: string;
  title?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> =  ({
  title = 'Confirm',
  description,
  open,
  onClose,
  onSubmit,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="confirm-dialog-title"
    aria-describedby="confirm-dialog-description"
  >
    <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="confirm-dialog-description">
        {description}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" id={CONFIRM_DIALOG_NO_BTN_ID}>
        No
      </Button>
      <Button onClick={onSubmit} color="primary" autoFocus id={CONFIRM_DIALOG_YES_BTN_ID}>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
