import { Box } from '@mui/material';
import React from 'react';
import Menu from './Menu';
import ColorModeSwitch from './ColorModeSwitch';
import Logo from './Logo';
import { useTheme } from '@mui/material';

export default function TopBar() {

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 40,
        position: 'fixed',
        top: 0,
        backdropFilter: `blur(.2rem) brightness(${theme.palette.mode === 'dark' ? 0.85 : 0.95})`,
        zIndex: 1,
      }}
    >
      <Logo />
      <Menu />
      <ColorModeSwitch />
    </Box>
  );
}
