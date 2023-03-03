import { Box, Grid } from '@mui/material';
import { SERVER_URL } from '../config';
import { decode } from 'html-entities';
import React from 'react';
import Video from './Video';

export const VideoList = ({ videos }) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 1, sm: 8, md: 12 }}>
        {videos.map((video, i) => {
          const { id, snippet } = video;
          const thumbnailUrl = `${SERVER_URL}/thumbnail?url=${encodeURIComponent(snippet.thumbnails.medium.url)}`;
          return (
            <Grid item xs={1} sm={4} md={4} key={i}>
              <Video v={id.videoId} title={decode(snippet.title)} poster={thumbnailUrl} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
