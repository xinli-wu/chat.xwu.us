import { Box, useTheme } from '@mui/material';
import React from 'react';
import BackBtn from './BackBtn';
import ColorModeSwitch from './ColorModeSwitch';
import Logo from './Logo';

export default function TopBar() {

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 40,
        position: 'fixed',
        justifyContent: 'space-between',
        top: 0,
        backdropFilter: `blur(.2rem) brightness(${theme.palette.mode === 'dark' ? 0.85 : 0.95})`,
        zIndex: 1,
      }}
    >
      <BackBtn />
      <Logo />
      <ColorModeSwitch />
    </Box>
  );
}
