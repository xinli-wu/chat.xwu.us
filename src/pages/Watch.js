import { Box, Stack } from '@mui/material';
import axios from 'axios';
import LoadingProgress from 'components/LoadingProgress';
import SearchBox from 'components/SearchBox';
import Video from 'components/Video';
import { SERVER_URL } from '../config';
import { decode } from 'html-entities';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Watch() {
  const [searchParams] = useSearchParams();
  const v = searchParams.get('v');

  const [info, setInfo] = React.useState({ data: undefined, loading: false });

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setInfo({ data: undefined, loading: true });
      const { data } = await axios(`${SERVER_URL}/info`, { signal: controller.signal, params: { v } })
        .catch(() => setInfo({ data: [], loading: false })) || {};
      setInfo({ data, loading: false });

      document.title = data.videoDetails.title;
    })();

    return () => controller.abort();
  }, [v]);

  return (
    <Stack direction='column'>
      <LoadingProgress show={info.loading} />
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Box sx={{ width: '100%', position: 'absolute', top: 0, zIndex: 10 }}>
          <SearchBox />
        </Box>
        <Box sx={{ width: '100%', position: 'absolute', top: 80, }}>
          {info?.data?.error && <p>Video is not available to play</p>}
          {info?.data?.videoDetails &&
            <Video
              v={v}
              title={decode(info.data.videoDetails.title)}
              poster={info.data.videoDetails.thumbnails[2].url}
            />
          }
        </Box>
      </Box>
    </Stack>
  );
}