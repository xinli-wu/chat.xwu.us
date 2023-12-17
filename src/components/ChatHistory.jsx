import { ListItemText, MenuItem, MenuList, Paper } from '@mui/material';
import React from 'react';
import { isMobile } from 'react-device-detect';
import LoadingProgress from './LoadingProgress';

export default function ChatHistory({ isLoading, setSelectedChat, chats }) {
  return (
    <Paper
      className="no-scrollbar"
      sx={{
        flexGrow: 1,
        borderRadius: isMobile ? 0 : 3,
        overflow: 'scroll',
        ...(isMobile && { minWidth: '60vw', opacity: 0.6 }),
      }}
    >
      <LoadingProgress show={isLoading} />
      <MenuList dense>
        {chats.map((x, i) => (
          <MenuItem key={i} onClick={() => setSelectedChat(x._id)}>
            <ListItemText sx={{ textAlign: 'left', overflowX: 'hidden' }}>{x.data.title}</ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
}
