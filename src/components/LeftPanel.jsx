import { Grid, Stack } from '@mui/material';
import React from 'react';
import ChatHistory from './ChatHistory';
import Footer from './Footer';

export default function LeftPanel({ isLoading, setSelectedChat, chats }) {
  return (
    <Grid item xs={12} sm={12} md={4} lg={3} xl={3} sx={{ height: '100%' }}>
      <Stack spacing={2} sx={{ height: '100%' }}>
        <ChatHistory isLoading={isLoading} setSelectedChat={setSelectedChat} chats={chats} />
        <Footer />
      </Stack>
    </Grid>
  );
}
