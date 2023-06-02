import { Box } from '@mui/material';
import React from 'react';
import ColorModeSwitch from './ColorModeSwitch';
import { Typography } from '@mui/material';
import { Stack } from '@mui/material';

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
      <Stack direction={'row'} sx={{ alignItems: 'center' }}>
        <Typography
          variant="body2"
          sx={{ fontSize: '0.65rem', textAlign: 'right', color: 'grey' }}
        >
          Your audio may be sent to a web service for recognition processing on
          certain browsers, such as Chrome
        </Typography>
        <ColorModeSwitch />
      </Stack>
    </Box>
  );
}
