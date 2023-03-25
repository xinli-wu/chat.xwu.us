import { IconButton, useTheme } from '@mui/material';
import { ColorModeContext } from 'contexts/utilContext';
import React from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function ColorModeSwitch() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <IconButton
      onClick={colorMode.toggleColorMode} color='inherit'>
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

export default ColorModeSwitch;