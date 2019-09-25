import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MYOTextField from './MYOTextField';
import {
  BUTTON_TYPE_APP,
  BUTTON_TYPE_KEYBOARD,
  BUTTON_TYPE_WEB,
  COMMON_ITEM_CLASS,
  MAKE_YOUR_OWN_ID,
  MAKE_YOUR_OWN_ITEM_CLASS,
  OTHER,
} from '../../constants/constants';
import {MYOButtonInterface} from '../../interfaces';
import ChipInput from 'material-ui-chip-input';
import React from 'react';
import ScaleText from 'react-scale-text';

const baseData: MYOButtonInterface = Object.freeze({
  buttonName: '',
  buttonData: undefined,
  buttonId: 'MakeYourOwn',
  buttonType: BUTTON_TYPE_APP,
  fullScreen: false,
  popupText: '',
  description: '',
});

const buttonTypeLabels: {[key: string]: string} = {
  [BUTTON_TYPE_WEB]: 'That Opens A Web Site',
  [BUTTON_TYPE_APP]: 'That Launches An App',
  [BUTTON_TYPE_KEYBOARD]: 'That Sends A Keyboard Shortcut',
};

const buttonTypes = Object.keys(buttonTypeLabels);

const programList = [
  {name: 'Notepad', path: 'C:\\Windows\\System32\\notepad.exe'},
];

export interface MakeYourOwnProps {
  names?: string[];
  onSubmit?: (bd: MYOButtonInterface) => void;
}

const MakeYourOwn: React.FC<MakeYourOwnProps> = ({
  names = [],
  onSubmit = () => undefined,
}) => {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<MYOButtonInterface>({...baseData});
  const [dirty, setDirty] = React.useState(false);
  const commonClassName = `${COMMON_ITEM_CLASS} ${MAKE_YOUR_OWN_ITEM_CLASS}`;
  const isNameTaken = names.indexOf(values.buttonName) > -1;
  const selectedProgram = programList.find(p => p.path === values.buttonData);
  const isOtherProgram = selectedProgram === undefined && values.buttonData !== undefined;
  const resetForm = () => {
    setValues({...baseData});
    setDirty(false);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (name: keyof MYOButtonInterface) => (event: { target: { name?: string; checked?: boolean; value: unknown; }}) => {
    const {checked, value} = event.target;
    setValues(v => ({
      ...v,
      [name]: name === 'fullScreen' ? checked : value,
    }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setDirty(true);
    const {buttonData, buttonName, popupText} = values;
    if (!buttonData || buttonData === OTHER || !buttonName || !popupText || isNameTaken) {
      return;
    }
    handleClose();
    onSubmit(values);
    resetForm();
  };
  const handleDeleteChip = (chip: string) => {
    setValues(v => ({
      ...v,
      buttonData: v.buttonData && v.buttonData.split('+').filter(s => s !== chip).join('+'),
    }));
  };
  const handleHotKeys = (e: any) => {
    e.preventDefault();
    const key =
      e.key === 'Meta'
      ? 'Command'
      : e.key === ' '
      ? 'Space'
      : e.key;
    setValues(v => {
      const chips = v.buttonData ? v.buttonData.split('+') : [];
      return {
        ...v,
        buttonData: [...chips, key].join('+'),
      };
    });
  };
  const handleButtonTypeClick = (buttonType: string) => {
    handleChange('buttonType')({target: {value: buttonType}});
    setOpen(true);
  };
  return (
    <React.Fragment>
      <Paper id={MAKE_YOUR_OWN_ID} tabIndex={0} className="myo vertical-space-1">
        <Typography variant="h5" component="h1" className="pad-1">
          Make Your Own Button
        </Typography>
        <div className="myo-button-list">
          {buttonTypes.map(type => (
            <Button
              key={type}
              className={commonClassName}
              variant="contained"
              onClick={() => handleButtonTypeClick(type)}
            >
              {buttonTypeLabels[type]}
            </Button>
          ))}
        </div>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="Customize Your Button"
        className="myo-dialog"
        fullWidth={true}
      >
        <DialogTitle className="myo-header">
          Customize Your Button
          <IconButton
            edge="end"
            aria-label="Close Customize Your Button Dialog"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off">
            <Typography align="center">
              {buttonTypeLabels[values.buttonType]}
            </Typography>
            <div className="flex-center">
              <div className="demo-quickstrip-item">
                <ScaleText maxFontSize={16}>{values.buttonName}</ScaleText>
              </div>
            </div>
            <MYOTextField
              id="button-name"
              label={`Name ${dirty && isNameTaken ? 'Taken' : ''}`}
              value={values.buttonName}
              onChange={handleChange('buttonName')}
              placeholder="Enter Name for Button"
              inputProps={{
                maxLength: 20,
              }}
              required
              error={dirty && (!values.buttonName || isNameTaken)}
            />
            {values.buttonType === BUTTON_TYPE_APP && (
              <React.Fragment>
                <FormControl
                  className="input-container"
                  required
                  error={dirty && !values.buttonData && !isOtherProgram}
                  fullWidth={true}>
                  <InputLabel shrink htmlFor="button-data">Name of the application</InputLabel>
                  <Select
                    value={values.buttonData || ''}
                    onChange={handleChange('buttonData')}
                    name="buttonData"
                    inputProps={{
                      id: 'button-data',
                    }}
                    displayEmpty={true}
                    renderValue={() => {
                      return selectedProgram
                        ? selectedProgram.name
                        : isOtherProgram
                        ? OTHER
                        : <div style={{opacity: 0.42}}>Select</div>;
                    }}
                  >
                    <MenuItem value={OTHER}>
                      Other
                    </MenuItem>
                    {programList.map(item => <MenuItem key={item.name} value={item.path}>{item.name}</MenuItem>)}
                  </Select>
                </FormControl>
                {isOtherProgram && (
                  <MYOTextField
                    id="button-data-other"
                    label="Location of application"
                    value={values.buttonData === OTHER ? '' : values.buttonData}
                    onChange={handleChange('buttonData')}
                    placeholder="C:\Windows\System32\notepad.exe"
                    required
                    error={dirty && (!values.buttonData || values.buttonData === OTHER)}
                  />
                )}
              </React.Fragment>
            )}
            {values.buttonType === BUTTON_TYPE_WEB && (
              <MYOTextField
                id="button-data"
                label="Address of the webpage"
                value={values.buttonData || ''}
                onChange={handleChange('buttonData')}
                placeholder="https://www.google.com/"
                required
                error={dirty && !values.buttonData}
              />
            )}
            {values.buttonType === BUTTON_TYPE_KEYBOARD && (
              <ChipInput
                className="input-container"
                error={dirty && !values.buttonData}
                fullWidth={true}
                InputLabelProps={{ shrink: true }}
                label='Keyboard Shortcut'
                onDelete={handleDeleteChip}
                onKeyDown={handleHotKeys}
                placeholder="Press a key to add it to the shortcut"
                required
                value={values.buttonData ? values.buttonData.split('+') : []}
              />
            )}
            <MYOTextField
              id="popup-text"
              label="Popup Text"
              value={values.popupText}
              onChange={handleChange('popupText')}
              placeholder="Enter Popup Text"
              inputProps={{
                maxLength: 510,
              }}
              required
              error={dirty && !values.popupText}
            />
            <MYOTextField
              id="description"
              label="Description"
              value={values.description}
              onChange={handleChange('description')}
              placeholder="Enter description"
            />
            <FormControlLabel
              value="start"
              control={
                <Switch
                  checked={values.fullScreen}
                  onChange={handleChange('fullScreen')}
                  value="fullScreen"
                  color="primary"
                  inputProps={{
                    'aria-label': 'fullScreen primary checkbox',
                    className: commonClassName,
                  }}
                />
              }
              label="Full Screen"
              labelPlacement="start"
              className="myo-switch"
            />
          </form>
          <div className="actions-container">
            <Button onClick={resetForm} className="button">
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className="button"
            >
              Make
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default MakeYourOwn;
