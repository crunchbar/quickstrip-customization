import React from 'react';
import TextField, {TextFieldProps} from '@material-ui/core/TextField';
import {
  COMMON_ITEM_CLASS,
  MAKE_YOUR_OWN_ITEM_CLASS,
} from '../../constants/constants';

const MYOTextField: React.FC<TextFieldProps> = React.forwardRef(({
  inputProps = {},
  ...restProps
}, ref) => {
  const commonClassName = `${COMMON_ITEM_CLASS} ${MAKE_YOUR_OWN_ITEM_CLASS}`;
  return (
    <TextField
      inputRef={ref}
      margin="normal"
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        ...inputProps,
        className: inputProps.className ? `${inputProps.className} ${commonClassName}` : commonClassName,
      }}
      {...restProps}
    />
  );
});

export default MYOTextField;
