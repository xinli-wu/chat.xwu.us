import { Box, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import useWindowSize from 'hooks/useWindowSize';
import React, { useRef } from 'react';
import { useNavigate, useLocation, matchPath, createSearchParams } from 'react-router-dom';
import { SERVER_URL } from '../config';
import LoadingProgress from './LoadingProgress';
import './Video.css';
import VideoJS from './VideoJS';

window.HELP_IMPROVE_VIDEOJS = false;

export default function Video({ v, title, poster }) {
  const playerWrapperRef = useRef(null);
  const [width] = useWindowSize();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [format, setFormat] = React.useState({ data: undefined, loading: false });
  const [videoJsOptions, setVideoJsOptions] = React.useState({});
  const [playerWrapperH, setPlayerWrapperH] = React.useState(0);


  React.useEffect(() => {
    setPlayerWrapperH(playerWrapperRef.current ? playerWrapperRef.current.offsetWidth / 1.77777777778 : 0);
  }, [width]);

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setFormat({ data: undefined, loading: true });
      const { data } = await axios(`${SERVER_URL}/format`, { signal: controller.signal, params: { v } });
      setVideoJsOptions({
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: `${SERVER_URL}/watch?v=${v}`,
          type: data?.mimeType
        }],
        poster
      });

      setFormat({ data, loading: false });
    })();

    return () => controller.abort();

  }, [v, poster]);

  const onTitleClick = (e) => {
    e.preventDefault();

    if (!matchPath(pathname, '/watch')?.pathname) {
      navigate({ pathname: '/watch', search: `?${createSearchParams({ v })}` });
    }
  };

  const playerRef = useRef(null);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      player.log('player is waiting');
    });

    // player.on('dispose', () => {
    //   player.log('player will dispose');
    // });

    player.on('play', () => {
      document.title = title;
    });
  };

  return (
    <Box sx={{ m: 2 }}>
      <Paper
        sx={{
          alignItems: 'center'
          , minHeight: playerWrapperH ? playerWrapperH + 80 : 260
          , width: '100%'
          , borderRadius: '4px 4px 4px 4px'
          , overflow: 'hidden'
          , position: 'relative'
        }}
      >
        <Stack >
          <Box ref={playerWrapperRef} className='player-wrapper'
            sx={{
              position: 'absolute'
              , width: '100%'
            }}
          >
            {format.data && <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />}
          </Box>
          <Box onClick={onTitleClick} sx={{
            cursor: 'pointer'
            , p: 1
            , position: 'absolute'
            , height: 80
            , bottom: 0
            , left: 0
            , display: 'flex'
            , alignItems: 'center'
          }}>
            {title && <Typography variant='subtitle2' textAlign="left" >{title}</Typography>}
          </Box>
        </Stack>
        <LoadingProgress show={format.loading} />
      </Paper >
    </Box >
  );
};
