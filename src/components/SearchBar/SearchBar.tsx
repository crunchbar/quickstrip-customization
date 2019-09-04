import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    inputRoot: {
      flexWrap: 'wrap'
    },
    inputInput: {
      width: 'auto',
      flexGrow: 1
    },
  })
);

export interface SearchBarProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  id?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  label,
  placeholder,
  value,
  onChange,
  className,
  inputClassName,
  id,
}) => {
  const classes = useStyles();
  const textFieldProps = {
    id,
    fullWidth: true,
    label,
    value,
    placeholder,
    InputLabelProps: { shrink: true },
    InputProps: {
      classes: {
        root: classes.inputRoot,
        input: classes.inputInput,
      },
      endAdornment: value ? (
        <InputAdornment position="end">
          <IconButton
            edge="end"
            aria-label="Clear Search"
            onClick={() => onChange('')}
          >
            <CancelIcon />
          </IconButton>
        </InputAdornment>
      ) : undefined,
    },
    inputProps: {
      className: inputClassName,
    },
    onChange: (e: any) => onChange(e.target.value),
  };
  return (
    <div className={`${classes.root} ${className ? className : ''}`}>
      <TextField {...textFieldProps} />
    </div>
  );
}

export default SearchBar;
