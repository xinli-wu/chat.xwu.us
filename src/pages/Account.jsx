import { FormControl, FormGroup, Paper, Stack, TextField } from '@mui/material';
import React, { useContext } from 'react';
import Stripe from '../components/stripe/Stripe';
import UserContext from '../contexts/UserContext';

export default function Account() {
  const { user } = useContext(UserContext);
  const [form, setForm] = React.useState({ email: user.email });

  return (
    <Stack
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 10,
      }}
    >
      <Stack
        spacing={2}
        sx={{
          p: 6,
          maxWidth: 1280,
        }}
      >
        <Paper>
          <FormGroup>
            <FormControl sx={{ p: 2 }} margin="dense">
              <TextField disabled label="Email" variant="standard" fullWidth onChange={(e) => setForm({ email: e.target.value })} value={form.email} />
            </FormControl>
          </FormGroup>
        </Paper>
        <Paper>
          <Stripe />
        </Paper>
      </Stack>
    </Stack>
  );
}
