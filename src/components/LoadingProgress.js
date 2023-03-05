import { Box, CircularProgress, LinearProgress } from '@mui/material';
import React from 'react';

export default function LoadingProgress({ show, variant = 'linear' }) {
  // show = true;
  return (
    <>
      {variant === 'linear' && (
        <Box sx={{ height: 4 }}>
          {show && <LinearProgress />}
        </Box>
      )}
      {variant === 'circular' && show && <CircularProgress size={30} />}
    </>
  );
}
