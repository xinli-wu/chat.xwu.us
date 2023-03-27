import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import { Box, FormControl, FormGroup, Paper, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Noti } from '../components/Noti';
import { UserContext } from '../contexts/UserContext';
import './Chat.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {

  const { setUser } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const [form, setForm] = React.useState({ email: searchParams.get('email') || '' });
  const [noti, setNoti] = React.useState({ text: null, severity: undefined });

  const otp = searchParams.get('otp');

  // const me = useQuery(['me'], () => axios(`${process.env.REACT_APP_CHAT_API_URL}/me`), {
  //   enabled: !!localStorage['token'],
  //   cacheTime: 0,
  //   retry: false
  // });

  const login = useQuery(['login'], () => axios.post(`${process.env.REACT_APP_CHAT_API_URL}/login`, { email: form.email, otp }), {
    enabled: !!form.email && !!otp,
    retry: false,
    cacheTime: 0,
    // onError: (error) => error,
  });

  React.useEffect(() => {
    if (login.isSuccess) {
      if (login.data?.data?.status === 'success') {
        if (login.data?.data?.data?.user) {
          localStorage['token'] = login.data.data.data.user.token;
          setUser(login.data.data.data.user);
        }
        setNoti({ text: login.data.data.message, severity: 'success' });
      } else {
        setNoti({ text: login.data.data.message, severity: 'error' });
      }
    }

    if (login.isError) {
      setNoti({ text: login.error?.response?.data.message, severity: 'error' });
    }

  }, [login.data, login.isError, login.isSuccess, login.error, setUser]);

  // React.useEffect(() => {
  //   if (me.isSuccess && me.data?.data?.status === 'success') {
  //     setUser(me.data.data.data.user);
  //   }

  //   if (me.isError) {
  //     setUser(null);
  //     setNoti({ text: 'Please login again.', severity: 'error' });
  //   }

  // }, [me.isFetched, me.data, me.isSuccess, me.isError, setUser]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 30 }}>
      <Paper sx={{ width: '30%', minWidth: 300, maxWidth: 720 }}>
        <FormGroup onSubmit={() => login.refetch()}>
          <FormControl sx={{ p: 2, width: 500 }} margin='dense'>
            <TextField disabled={login.isFetching} label='Email' variant='standard' fullWidth
              onChange={(e) => setForm({ email: e.target.value })} value={form.email}
            />
          </FormControl>
          <FormControl sx={{ p: 2 }} margin='dense'>
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
      </Paper>
      <Noti noti={noti} setNoti={setNoti} />
    </Box>
  );
}
