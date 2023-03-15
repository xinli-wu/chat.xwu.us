import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from '@mui/material';
import React from 'react';

function BackBtn() {

  return (
    <IconButton disabled>
      <ArrowBackIosNewIcon />
    </IconButton>
  );
}

export default BackBtn;