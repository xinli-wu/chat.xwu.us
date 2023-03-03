import { Box } from '@mui/material';
import React from 'react';
import BackBtn from './BackBtn';
import ColorModeSwitch from './ColorModeSwitch';
import Logo from './Logo';

export default function TopBar() {

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 40,
        justifyContent: 'space-between',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      <BackBtn />
      <Logo />
      <ColorModeSwitch />
    </Box>
  );
}
