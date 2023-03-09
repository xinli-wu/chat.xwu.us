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
        color: 'text.primary',
        position: 'fixed',
        top: 0,
        backdropFilter: 'blur(.2rem)',
      }}
    >
      <BackBtn />
      <Logo />
      <ColorModeSwitch />
    </Box>
  );
}
