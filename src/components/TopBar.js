import { Box } from '@mui/material';
import React from 'react';
import Menu from './Menu';
import ColorModeSwitch from './ColorModeSwitch';
import Logo from './Logo';

export default function TopBar() {

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 40,
        position: 'fixed',
        top: 0,
        backdropFilter: 'blur(.2rem) brightness(0.85)',
        zIndex: 1,
      }}
    >
      <Logo />
      <Menu />
      <ColorModeSwitch />
    </Box>
  );
}
