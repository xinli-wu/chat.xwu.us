import { Grid, ListItemText, MenuItem, MenuList, Paper } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';

export default function CompletionHistory() {
  const [completionHistory, setCompletionHistory] = React.useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios(`${process.env.REACT_APP_CHAT_API_URL}/my/openai/chat/completion-hitory`);
      if (data.status === 'success') setCompletionHistory(data.data);
    })();
  }, []);

  return (
    <Grid item xs={12} sm={12} md={4} lg={3} xl={3} sx={{ height: '100%' }}>
      <Paper elevation={3} sx={{
        overflow: 'scroll',
        height: '100%',
      }}>
        <MenuList dense >
          {completionHistory.map((hitory, i) => (
            <MenuItem key={i}>
              <ListItemText sx={{
                textAlign: 'left',
                overflowX: 'hidden'
              }}>
                {hitory.content}
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    </Grid>
  );
}
