import { Grid } from '@mui/material';
import React from 'react';
import { ChatsArea } from '../components/ChatsArea';
import CompletionHistory from './CompletionHistory';
import Conversation from './Conversation';

export default function Chat() {

  return (
    <ChatsArea>
      <Grid className='no-scrollbar' container spacing={2} sx={{
        pt: 6,
        pl: 6,
        pr: 6,
        // pb: 6,
        // display: 'flex',
        // flexDirection: 'row',
        // alignItems: 'center',
        // width: '100%',
        // maxWidth: 1280,
        // overflowY: 'scroll',
        flexGrow: 1,
        // padding: '48px 5% 0px 5%',
        height: 'calc(100vh - 120px)',
        // margin: '48px 0',
      }}>
        <CompletionHistory />
        <Conversation />
      </Grid>
    </ChatsArea>
  );
}
