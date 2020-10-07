import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function IconLabelButtons(variant, color, text, icon, handleClick) {
  const classes = useStyles();

  return (
      <Button
        variant={variant}
        color={color}
        className={classes.button}
        startIcon={icon}
        onClick={handleClick}
      >
        {text}
      </Button>
  );
}
