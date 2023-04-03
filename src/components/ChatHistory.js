import { Grid, ListItemText, MenuItem, MenuList, Paper } from '@mui/material';
import React from 'react';
import LoadingProgress from './LoadingProgress';
import { useNavigate } from 'react-router-dom';

export default function ChatHistory({ isLoading, setSelectedChat, chats }) {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={12} md={4} lg={3} xl={3} sx={{ height: '100%' }}>
      <Paper className='no-scrollbar' sx={{
        borderRadius: 3,
        overflow: 'scroll',
        height: '100%',
      }}>
        <LoadingProgress show={isLoading} />
        <MenuList dense>
          {chats.map((x, i) => (
            <MenuItem key={i} onClick={() => navigate(`/chat/${x._id}`)}>
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
