import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import { Box, FormControl, FormGroup, Paper, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {

  const { setUser } = useContext(UserContext);
  const { setToast } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [form, setForm] = React.useState({ email: searchParams.get('email') || '' });

  const otp = searchParams.get('otp');

  const login = useQuery(['login'], () => axios.post(`${process.env.REACT_APP_CHAT_API_URL}/login`, { email: form.email, otp }), {
    enabled: !!form.email && !!otp,
    retry: false,
    cacheTime: 0,
  });

  React.useEffect(() => {
    if (login.isSuccess) {
      if (login.data?.data.status === 'success') {
        setToast({ text: login.data.data.message, severity: 'success' });
        if (login.data?.data?.user) {
          setUser(login.data.data.user);
        }
      } else {
        setToast({ text: login.data.data.message, severity: 'error' });
      }
    }

    if (login.isError) {
      setToast({ text: login.error?.response?.data.message, severity: 'error' });
    }

  }, [login.data, login.isError, login.isSuccess, login.error, setUser, setToast]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 30 }}>
      <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70%', minWidth: 300, maxWidth: 600 }}>
        <form onSubmit={(e) => { e.preventDefault(); login.refetch(); }} style={{ width: '100%' }}>
          <FormGroup onSubmit={() => login.refetch()} sx={{ p: 2, width: '100%' }}>
            <FormControl sx={{ p: 1 }} margin='dense'>
              <TextField disabled={login.isFetching} label='Email' variant='standard' fullWidth
                onChange={(e) => setForm({ email: e.target.value })} value={form.email}
              />
            </FormControl>
            <FormControl sx={{ p: 1 }} margin='dense'>
              <LoadingButton
                type='submit'
                variant='contained'
                disabled={!emailRegex.test(form.email)}
                onClick={() => login.refetch()}
                loading={(login.isFetching || login.isRefetching)}
                loadingPosition='end'
                endIcon={<LoginIcon />}>
                Send Login Link
              </LoadingButton>
            </FormControl>
          </FormGroup>
        </form>
      </Paper>
    </Box>
  );
}
