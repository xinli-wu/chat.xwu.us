import { Alert as MuiAlert, Slide, Snackbar } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide unmountOnExit {...props} direction="down" />;
}

export const Toast = () => {
  const { toast, setToast } = useContext(AppContext);
  const [open, setOpen] = React.useState(true);

  const onSnackbarClose = (_e, reason) => {
    if (reason === 'clickaway') return;
  };

  useEffect(() => {
    if (toast.text) setOpen(true);
    const id = setTimeout(() => {
      setOpen(false);
    }, 3000);

    return () => clearTimeout(id);
  }, [toast]);

  return (
    <>
      <Snackbar
        open={open && !!toast.text}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        TransitionComponent={SlideTransition}
        onClose={onSnackbarClose}
        TransitionProps={{ onExited: () => setToast({}) }}
      >
        <Alert severity={toast.severity} sx={{ width: '100%' }}>
          {toast.text}
        </Alert>
      </Snackbar>
    </>
  );
};
