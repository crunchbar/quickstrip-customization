import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stepper,
  Step,
  StepLabel,
  StepContent,
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
  [BUTTON_TYPE_APP]: 'A button to launch an application',
  [BUTTON_TYPE_WEB]: 'A button to open a webpage',
  [BUTTON_TYPE_KEYBOARD]: 'A button to trigger a keyboard shortcut',
};

const steps = [
  'Choose the type of button',
  'Customize your button',
];

const programList = [
  {name: 'Notepad', path: 'C:\\Windows\\System32\\notepad.exe'},
];

export interface MakeYourOwnProps {
  names?: string[];
  onClose?: () => void;
  onSubmit?: (bd: MYOButtonInterface) => void;
  open?: boolean;
}

const MakeYourOwn: React.FC<MakeYourOwnProps> = ({
  names = [],
  onClose,
  onSubmit = () => undefined,
  open = false,
}) => {
  const [values, setValues] = React.useState<MYOButtonInterface>({...baseData});
  const [dirty, setDirty] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const isLastStep = activeStep === steps.length - 1;
  const commonClassName = `${COMMON_ITEM_CLASS} ${MAKE_YOUR_OWN_ITEM_CLASS}`;
  const isNameTaken = names.indexOf(values.buttonName) > -1;
  const selectedProgram = programList.find(p => p.path === values.buttonData);
  const isOtherProgram = selectedProgram === undefined && values.buttonData !== undefined;
  const resetForm = () => {
    setValues({...baseData});
    setDirty(false);
  };
  const handleChange = (name: keyof MYOButtonInterface) => (event: React.ChangeEvent<{ name?: string; checked?: boolean; value: unknown; }>) => {
    const {checked, value} = event.target;
    setValues(v => ({
      ...v,
      [name]: name === 'fullScreen' ? checked : value,
    }));
  };
  const handleNext = () => {
    setActiveStep(1);
  };
  const handleBack = () => {
    setActiveStep(0);
    resetForm();
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setDirty(true);
    const {buttonData, buttonName, popupText} = values;
    if (!buttonData || buttonData === OTHER || !buttonName || !popupText || isNameTaken) {
      return;
    }
    onSubmit(values);
    handleBack();
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
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormControl>
            <RadioGroup
              aria-label="Button Type"
              name="buttonType"
              value={values.buttonType}
              onChange={handleChange('buttonType')}>
              <FormControlLabel value={BUTTON_TYPE_APP} control={<Radio color="primary" />} label={buttonTypeLabels[BUTTON_TYPE_APP]} />
              <FormControlLabel value={BUTTON_TYPE_WEB} control={<Radio color="primary" />} label={buttonTypeLabels[BUTTON_TYPE_WEB]} />
              <FormControlLabel value={BUTTON_TYPE_KEYBOARD} control={<Radio color="primary" />} label={buttonTypeLabels[BUTTON_TYPE_KEYBOARD]} />
            </RadioGroup>
          </FormControl>
        );
      case 1:
        return (
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
        );
      default:
        return 'Unknown step';
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="Make Your Own Button"
      className="myo"
      id={MAKE_YOUR_OWN_ID}
      fullWidth={true}
    >
      <DialogTitle className="myo-header">
        Make Your Own Button
        <IconButton
          edge="end"
          aria-label="Close Make Your Own Button Dialog"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(index)}
              <div className="actions-container">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className="button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={isLastStep ? handleSubmit : handleNext}
                  className="button"
                >
                  {isLastStep ? 'Make' : 'Next'}
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Dialog>
  );
}

export default MakeYourOwn;
