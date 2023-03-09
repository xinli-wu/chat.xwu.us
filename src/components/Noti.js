import React from 'react';
import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';

export const Noti = ({ noti, setNoti }) => {

  return (
    <Snackbar
      open={noti.text !== null}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={3000}
      onClose={() => setNoti({ text: null, severity: undefined })}
    >
      <Alert severity={noti.severity || 'info'} sx={{ width: '100%' }}>{noti.text}</Alert>
    </Snackbar>
  );
};
