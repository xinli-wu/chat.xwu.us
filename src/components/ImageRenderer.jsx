import { useTheme } from '@emotion/react';
import { Backdrop, Fade, Box, Modal } from '@mui/material';
import React from 'react';
import './ImageRenderer.css';

function Image({ url, b64JSON }) {
  return <img src={url || `data:image/jpeg;base64,${b64JSON}`} alt="" style={{ width: '100%', height: '100%' }} />;
}

function ImageRenderer({ b64JSON, url }) {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
  };

  return (
    <>
      <Box
        className="root"
        onClick={() => setOpen(true)}
        sx={{
          width: 256,
          height: 256,
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          outline: `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <Image url={url} b64JSON={b64JSON} />
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-image"
        aria-describedby="modal-modal-image-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Image url={url} b64JSON={b64JSON} />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default ImageRenderer;
