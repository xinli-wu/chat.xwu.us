import { Box, Paper, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import './Video.css';
import { decode } from 'html-entities';
import { matchPath, createSearchParams, useNavigate, useLocation } from 'react-router-dom';
import LoadingProgress from './LoadingProgress';
import { SERVER_URL } from '../config';

window.HELP_IMPROVE_VIDEOJS = false;

export const NativeVideo = ({ v, title, poster }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [format, setFormat] = React.useState({ data: undefined, loading: false });

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setFormat({ data: undefined, loading: true });
      const { data } = await axios(`${SERVER_URL}/format`, { signal: controller.signal, params: { v } })
        .catch(() => setFormat({ data: [], loading: false })) || {};
      setFormat({ data, loading: false });
    })();

    return () => controller.abort();
  }, [v]);

  const onTitleClick = (e) => {
    e.preventDefault();

    if (!matchPath(pathname, '/watch')?.pathname) {
      navigate({ pathname: '/watch', search: `?${createSearchParams({ v })}` });
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <LoadingProgress show={format.loading} />
      <Paper sx={{ alignItems: 'center', minHeight: 220, width: '100%', borderRadius: '4px 4px 4px 4px', overflow: 'hidden' }} >
        {format.data && (
          <video style={{ width: '100%', borderRadius: '4px 4px 0px 0px' }} controls poster={poster} preload="none" controlsList="nodownload">
            <source src={`${SERVER_URL}/watch?v=${v}`} type={format.data.mimeType} />
            Your browser does not support HTML video.
          </video>
        )}
        <Box onClick={onTitleClick} sx={{ cursor: 'pointer', p: 1 }}>
          {title && <Typography variant='subtitle2' textAlign="left" >{decode(title)}</Typography>}
        </Box>
      </Paper>
    </Box>
  );
};
