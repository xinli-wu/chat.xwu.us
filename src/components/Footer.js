import { Box } from '@mui/material';
import React from 'react';
import ColorModeSwitch from './ColorModeSwitch';

export default function Footer() {

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 40,
        position: 'fixed',
        justifyContent: 'space-between',
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Box></Box>
      <Box>
        <ColorModeSwitch />
      </Box>
    </Box>
  );
}
