import { Box, FormControl, FormGroup, Paper, TextField } from '@mui/material';
import React, { useContext } from 'react';
import { Noti } from '../components/Noti';
import { UserContext } from '../contexts/UserContext';
import './Chat.css';

export default function Profile() {

  const { user } = useContext(UserContext);
  const [form, setForm] = React.useState({ email: user.email });
  const [noti, setNoti] = React.useState({ text: null, severity: undefined });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 30 }}>
      <Paper>
        <FormGroup>
          <FormControl sx={{ p: 2, width: 500 }} margin='dense'>
            <TextField disabled={true} label='Email' variant='standard' fullWidth
              onChange={(e) => setForm({ email: e.target.value })} value={form.email}
            />
          </FormControl>
        </FormGroup>
      </Paper>
      <Noti noti={noti} setNoti={setNoti} />
    </Box>
  );
}
