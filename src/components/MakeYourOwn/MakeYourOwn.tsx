import React from 'react';
import {
  Button,
  FormControlLabel,
  Paper,
  Switch,
  Typography
} from '@material-ui/core';
import MYOTextField from './MYOTextField';
import {
  COMMON_ITEM_CLASS,
  MAKE_YOUR_OWN_ID,
  MAKE_YOUR_OWN_ITEM_CLASS,
} from '../../constants/constants';
import {MYOButtonInterface} from '../../interfaces';
import {addMYOData} from '../../utils/utils';

const baseData: MYOButtonInterface = Object.freeze({
  buttonName: '',
  buttonData: '',
  fullScreen: false,
  popupText: '',
  description: '',
});

export interface MakeYourOwnProps {
  names?: string[];
  onSubmit?: (bd: MYOButtonInterface) => void;
}

const MakeYourOwn: React.FC<MakeYourOwnProps> = ({
  names = [],
  onSubmit = () => undefined,
}) => {
  const [values, setValues] = React.useState<MYOButtonInterface>({...baseData});
  const [dirty, setDirty] = React.useState(false);
  const handleChange = (name: keyof MYOButtonInterface) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const {checked, value} = event.target;
    setValues(values => ({
      ...values,
      [name]: name === 'fullScreen' ? checked : value,
    }));
  };
  const commonClassName = `${COMMON_ITEM_CLASS} ${MAKE_YOUR_OWN_ITEM_CLASS}`;
  const isNameTaken = names.indexOf(values.buttonName) > -1;
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setDirty(true);
    const {buttonData, buttonName, popupText} = values;
    if (!buttonData || !buttonName || !popupText || isNameTaken) {
      return;
    }
    onSubmit(addMYOData(values));
    setValues({...baseData});
    setDirty(false);
  };
  return (
    <Paper id={MAKE_YOUR_OWN_ID} tabIndex={0} className="myo vertical-space-1">
      <Typography variant="h5" component="h1" className="pad-1">
        Make Your Own Button
      </Typography>
      <form noValidate autoComplete="off" className="myo-form pad-1">
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
        <MYOTextField
          id="button-data"
          label="App Location or Web URL"
          value={values.buttonData}
          onChange={handleChange('buttonData')}
          placeholder="Enter or paste in a web address or app location"
          required
          error={dirty && !values.buttonData}
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
        <div className="myo-create-btn-container">
          <Button
            variant="contained"
            color="primary"
            className={commonClassName}
            type="submit"
            onClick={handleSubmit}
          >
            Make
          </Button>
        </div>
      </form>
    </Paper>
  );
}

export default MakeYourOwn;
