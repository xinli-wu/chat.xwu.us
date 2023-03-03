import { Box, LinearProgress } from '@mui/material';
import React from 'react';

export default function LoadingProgress({ show }) {
  return (
    <Box sx={{ height: 4 }}>
      {show && <LinearProgress />}
    </Box>
  );
}
