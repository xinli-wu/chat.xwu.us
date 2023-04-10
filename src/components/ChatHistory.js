import { Grid, ListItemText, MenuItem, MenuList, Paper } from '@mui/material';
import React from 'react';
import LoadingProgress from './LoadingProgress';
import { isMobile } from 'react-device-detect';

export default function ChatHistory({ isLoading, setSelectedChat, chats }) {

  return (
    <Grid item xs={12} sm={12} md={4} lg={3} xl={3} sx={{ height: '100%' }}>
      <Paper className='no-scrollbar' sx={{
        borderRadius: isMobile ? 0 : 3,
        overflow: 'scroll',
        height: '100%',
        ...(isMobile && { minWidth: '60vw', opacity: 0.6 })
      }}>
        <LoadingProgress show={isLoading} />
        <MenuList dense>
          {chats.map((x, i) => (
            <MenuItem key={i} onClick={() => setSelectedChat(x._id)}>
              <ListItemText sx={{
                textAlign: 'left',
                overflowX: 'hidden'
              }}>
                {x.data.title}
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    </Grid>
  );
}
