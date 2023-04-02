import { Grid } from '@mui/material';
import React from 'react';
import { ChatsArea } from '../components/ChatsArea';
import CompletionHistory from './CompletionHistory';
import Conversation from './Conversation';
import { isMobile } from 'react-device-detect';

export default function Chat() {

  return (
    <ChatsArea>
      <Grid className='no-scrollbar' container spacing={2} sx={{
        pt: 6,
        pl: 2,
        pr: 2,
        flexGrow: 1,
        height: 'calc(100vh - 120px)',
      }}>
        {!isMobile && <CompletionHistory />}
        <Conversation />
      </Grid>
    </ChatsArea>
  );
}
