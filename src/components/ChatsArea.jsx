import { Box } from '@mui/material';
import React from 'react';

function ChatsArea({ children }) {
  return (
    <Box
      sx={{
        zIndex: -10,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexFlow: 'column nowrap',
        height: '100%',
      }}
    >
      {children}
    </Box>
  );
}

export default ChatsArea;
