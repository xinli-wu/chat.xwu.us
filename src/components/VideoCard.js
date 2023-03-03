import { Box, Paper, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { createSearchParams, matchPath, useLocation, useNavigate } from 'react-router-dom';
import './Video.css';
import { decode } from 'html-entities';
import LoadingProgress from './LoadingProgress';
import { SERVER_URL } from '../config';

window.HELP_IMPROVE_VIDEOJS = false;


export const VideoCard = ({ v, title, poster }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [format, setFormat] = React.useState({ data: undefined, loading: false });

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setFormat({ data: undefined, loading: true });
      const { data } = await axios(`${SERVER_URL}/format`, { signal: controller.signal, params: { v } });
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
    <Box>
      <LoadingProgress show={format.loading} />
      <Paper onClick={onTitleClick} sx={{ alignItems: 'center', minHeight: 220, cursor: 'pointer' }}>
        {format.data && <img alt='' style={{ width: '100%', borderRadius: '4px 4px 0px 0px' }} src={poster} />}
        <Box sx={{ p: 1 }}>
          {title && <Typography variant='subtitle2' textAlign="left" >{decode(title)}</Typography>}
        </Box>
      </Paper>
    </Box>
  );
};
