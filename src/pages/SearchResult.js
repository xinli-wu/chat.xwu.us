import { Box } from '@mui/material';
import { Stack } from '@mui/system';
import axios from 'axios';
import LoadingProgress from 'components/LoadingProgress';
import SearchBox from 'components/SearchBox';
import dayjs from 'dayjs';
import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { VideoList } from '../components/VideoList';
import { SERVER_URL } from '../config';


export default function SearchResult() {
  const [videos, setVideos] = React.useState({ data: [], loading: false });
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const q = location.state?.q || searchParams.get('q');
  const qHistory = JSON.parse(localStorage.qHistory || '[]');
  localStorage.qHistory = JSON.stringify([...qHistory.filter(x => x.q !== q), { q, t: dayjs().unix() }]);

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      document.title = 'search: ' + q;
      setVideos({ data: [], loading: true });
      const { data } = await axios(`${SERVER_URL}/search`, { signal: controller.signal, params: { q } })
        .catch(() => setVideos({ data: [], loading: false })) || {};
      setVideos({ data, loading: false });
    })();

    return () => controller.abort();
  }, [q]);

  return (
    <Stack direction='column'>
      <LoadingProgress show={videos.loading} />
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Box sx={{ width: '100%', position: 'absolute', top: 0, zIndex: 10 }}>
          <SearchBox />
        </Box>
      </Box>
      <Box sx={{ width: '100%', position: 'absolute', top: 120, }}>
        <VideoList videos={videos.data} />
      </Box>
    </Stack>
  );
}