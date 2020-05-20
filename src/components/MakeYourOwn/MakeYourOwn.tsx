import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
  SvgIconProps,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MYOTextField from './MYOTextField';
import {
  BUTTON_TYPE_APP,
  BUTTON_TYPE_KEYBOARD,
  BUTTON_TYPE_WEB,
  COMMON_ITEM_CLASS,
  KEY_MODIFIERS,
  KEY_BUTTONS,
  MYOB_DIALOG_CLASS,
  MAKE_YOUR_OWN_ID,
  MAKE_YOUR_OWN_ITEM_CLASS,
  OTHER,
} from '../../constants/constants';
import {MYOButtonInterface} from '../../interfaces';
import ChipInput from 'material-ui-chip-input';
import React from 'react';
import ScaleText from 'react-scale-text';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import BackspaceIcon from '@material-ui/icons/Backspace';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {getMappedKey, splitButtonData} from '../../utils/utils';

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
  [BUTTON_TYPE_KEYBOARD]: 'That Send Keystrokes',
};

const buttonTypes = Object.keys(buttonTypeLabels);

const programList = [
  {name: 'Notepad', path: 'C:\\Windows\\System32\\notepad.exe'},
];

const keyButtonIcons: {[key: string]: (props: SvgIconProps) => JSX.Element} = {
  Backspace: BackspaceIcon,
  Tab: KeyboardTabIcon,
  ArrowLeft: KeyboardArrowLeftIcon,
  ArrowRight: KeyboardArrowRightIcon,
  ArrowUp: KeyboardArrowUpIcon,
  ArrowDown: KeyboardArrowDownIcon,
};

export interface MakeYourOwnProps {
  data?: MYOButtonInterface,
  names?: string[];
  onSubmit?: (bd?: MYOButtonInterface) => void;
}

const MakeYourOwn: React.FC<MakeYourOwnProps> = ({
  data,
  names = [],
  onSubmit = () => undefined,
}) => {
  const keyStore = React.useRef('');
  const firstInputRef = React.useRef(null);
  const chipInputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<MYOButtonInterface>({...baseData});
  const [dirty, setDirty] = React.useState(false);
  const [advanced, setAdvanced] = React.useState(false);
  const commonClassName = `${COMMON_ITEM_CLASS} ${MAKE_YOUR_OWN_ITEM_CLASS}`;
  const chipInputClassName = `${commonClassName} chip-checkbox-input`;
  const isNameTaken = !data && names.indexOf(values.buttonName) > -1;
  const selectedProgram = programList.find(p => p.path === values.buttonData);
  const isOtherProgram = selectedProgram === undefined && values.buttonData !== undefined;
  const resetForm = () => {
    setValues(prevState => ({
      ...(data || baseData),
      buttonType: prevState.buttonType,
    }));
    setDirty(false);
    setAdvanced(false);
  };
  const handleClose = () => {
    setOpen(false);
    onSubmit(undefined);
  };
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
    setOpen(false)
    onSubmit(values);
    resetForm();
  };
  const handleDeleteChip = (chip: string, index: number) => {
    setValues(v => ({
      ...v,
      buttonData: v.buttonData && splitButtonData(v.buttonData).filter((s, i) => i !== index).join(''),
    }));
  };
  const handleAdvancedInput = ({target: {value: buttonData = ''}}) => setValues(v => ({
    ...v,
    buttonData
  }));
  const handleChipInputUpdate = (key: string) => {
    keyStore.current += getMappedKey(key);
    setValues(v => ({
      ...v,
      buttonData: (v.buttonData || '') + keyStore.current,
    }));
    keyStore.current = '';
  };
  const handleHotKeys = (e: any) => {
    if ([...KEY_MODIFIERS, ...KEY_BUTTONS].includes(e.key)) {
      // keyStore.current += `${key}-`;
      return;
    }
    e.preventDefault();
    handleChipInputUpdate(e.key);
  };
  const handleChipInputFocus = () => {
    if (chipInputRef.current) {
      chipInputRef.current.focus();
    }
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = event.target;
    const key = getMappedKey(name);
    if (checked) {
      keyStore.current += key;
    } else {
      keyStore.current = keyStore.current.slice(0, -1);
    }
    handleChipInputFocus();
  };
  const handleButtonTypeClick = (buttonType: string) => {
    resetForm();
    handleChange('buttonType')({target: {value: buttonType}});
    setOpen(true);
  };
  const handleAdvancedToggle = () => setAdvanced(prevState => !prevState);
  React.useEffect(() => {
    if (data) {
      setValues({...data});
      setDirty(false);
      setOpen(true);
    }
  }, [data]);
  React.useEffect(() => {
    if (open) {
      // @ts-ignore
      setTimeout(() => firstInputRef.current.focus());
    }
  }, [open]);
  return (
    <React.Fragment>
      <Paper id={MAKE_YOUR_OWN_ID} tabIndex={0} className="myo vertical-space-1 border">
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
        className={MYOB_DIALOG_CLASS}
        fullWidth={true}
      >
        <DialogTitle className="myo-header">
          Customize Your Button
          <IconButton
            edge="end"
            aria-label="Close Customize Your Button Dialog"
            onClick={handleClose}
            className={commonClassName}
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
              ref={firstInputRef}
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
                      className: commonClassName,
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
              <React.Fragment>
                {
                  advanced
                  ? (
                    <React.Fragment>
                      <MYOTextField
                        // @ts-ignore
                        inputRef={r => chipInputRef.current = r}
                        InputLabelProps={{ required: false }}
                        label={(
                          <span>
                            Keyboard Shortcut
                            <span className="MuiFormLabel-asterisk MuiInputLabel-asterisk">&thinsp;*</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            (
                              <span
                                className="link"
                                onClick={handleAdvancedToggle}
                              >
                                Switch to basic mode
                              </span>
                            )
                          </span>
                        )}
                        required
                        multiline
                        rows={4}
                        value={values.buttonData}
                        onChange={handleAdvancedInput}
                        variant="outlined"
                      />
                      <Typography variant="body2">
                        In advanced mode, you need to enter your keystrokes in a special syntax. You can learn more about&nbsp;
                        <Link
                          href="https://github.com/GPII/windows/blob/master/gpii/node_modules/gpii-userInput/README.md"
                          variant="body2"
                          target="_blank"
                          rel="noopener"
                          className={commonClassName}
                        >
                          using advanced mode here
                        </Link>
                        .
                      </Typography>
                      <br />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <ChipInput
                        // @ts-ignore
                        inputRef={r => chipInputRef.current = r}
                        allowDuplicates={true}
                        clearInputValueOnChange={true}
                        className="input-container"
                        error={dirty && !values.buttonData}
                        fullWidth={true}
                        InputLabelProps={{ shrink: true, required: false }}
                        label={(
                          <span>
                            Keyboard Shortcut
                            <span className="MuiFormLabel-asterisk MuiInputLabel-asterisk">&thinsp;*</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            (
                              <span
                                className="link"
                                onClick={handleAdvancedToggle}
                              >
                                Switch to advanced mode
                              </span>
                            )
                          </span>
                        )}
                        onDelete={handleDeleteChip}
                        onKeyDown={handleHotKeys}
                        placeholder="Press a key to add it to the shortcut"
                        required
                        value={values.buttonData ? splitButtonData(values.buttonData) : []}
                        InputProps={{
                          inputProps: {className: commonClassName},
                        }}
                      />
                      <React.Fragment key={values.buttonData}>
                        {['Shift', 'Ctrl', 'Alt/Option', 'Win/Cmd'].map(i => (
                          <FormControlLabel
                            key={i}
                            control={
                              <Checkbox
                                onChange={handleCheckboxChange}
                                name={i}
                                color="primary"
                                inputProps={{className: chipInputClassName}}
                              />
                            }
                            label={i}
                          />
                        ))}
                        <div>
                          {KEY_BUTTONS.map(label => {
                            const Icon = keyButtonIcons[label];
                            return (
                              <IconButton
                                key={label}
                                aria-label={label}
                                className={commonClassName}
                                onClick={() => {handleChipInputUpdate(label);handleChipInputFocus();}}
                              >
                                <Icon />
                              </IconButton>
                            );
                          })}
                        </div>
                      </React.Fragment>
                    </React.Fragment>
                  )
                }
              </React.Fragment>
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
            {values.buttonType !== BUTTON_TYPE_KEYBOARD && (
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
            )}
          </form>
          <div className="actions-container">
            <Button onClick={resetForm} className={`button ${commonClassName}`}>
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={`button ${commonClassName}`}
            >
              {!!data ? 'Update' : 'Make'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default MakeYourOwn;
