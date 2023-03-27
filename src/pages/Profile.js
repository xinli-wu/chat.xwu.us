import { Box, FormControl, FormGroup, Paper, Stack, TextField } from '@mui/material';
import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Noti } from '../components/Noti';
import { UserContext } from '../contexts/UserContext';
import './Chat.css';

const isTrue = (v) => v?.toLowerCase() === 'true';

export default function Profile() {

  const { user } = useContext(UserContext);
  const [form, setForm] = React.useState({ email: user.email });
  const [noti, setNoti] = React.useState({ text: null, severity: undefined });

  const [searchParams] = useSearchParams();
  const success = isTrue(searchParams.get('success'));
  const session_id = searchParams.get('session_id');
  const canceled = isTrue(searchParams.get('canceled'));
  console.log(success, session_id, canceled);

  return (
    <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10, }}>
      <Box
        sx={{ width: '90%' }}
      >
        {/* <Stripe /> */}
        <Paper>
          <FormGroup>
            <FormControl sx={{ p: 2 }} margin='dense'>
              <TextField disabled={true} label='Email' variant='standard' fullWidth
                onChange={(e) => setForm({ email: e.target.value })} value={form.email}
              />
            </FormControl>
          </FormGroup>
        </Paper>
      </Box>

      <Noti noti={noti} setNoti={setNoti} />
    </Stack>
  );
}
