import { Button, FormGroup } from '@mui/material';
import { Box, FormControl, Paper, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import './Chat.css';

export default function Login() {

  const { user, setUser } = useContext(UserContext);
  console.log({ user });

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = React.useState('ryan7gm@gmail.com');

  React.useEffect(() => {
    const controller = new AbortController();
    const email = searchParams.get('email');
    const otp = searchParams.get('otp');


    (async () => {
      if (email && otp) {
        //login
        const res = await axios.post(`${process.env.REACT_APP_CHAT_API_URL}/email-login`, { email, otp });
        localStorage['token'] = res.data.token;
        console.log(res.data);
      }

    })();

    return () => controller.abort();
  }, [searchParams]);

  React.useEffect(() => {
    if (location.pathname !== '/email-login') navigate('/email-login');
  }, [location.pathname, navigate]);

  const onSendLoginClick = async (_e) => {
    const res = await axios.post(`${process.env.REACT_APP_CHAT_API_URL}/email-login`, { email });
    console.log(res.data);
  };

  React.useEffect(() => {
    (async () => {
      const { data } = await axios(`${process.env.REACT_APP_CHAT_API_URL}/me`) || {};
      if (data.status === 'success') {
        setUser({ user: data.data.user, token: localStorage['token'] });
        navigate('/chat');
      }
    })();
  }, [navigate, setUser]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 30 }}>
      <Paper>
        <FormGroup>
          <FormControl sx={{ p: 2, width: 500 }} margin="dense">
            <TextField label="Email" variant="standard" fullWidth onChange={(e) => setEmail(e.target.value)} value={email} />
          </FormControl>
          <FormControl sx={{ p: 2, width: 500 }} margin="dense">
            <Button variant="contained" onClick={onSendLoginClick}>Send Login Link</Button>
          </FormControl>
        </FormGroup>
      </Paper>
      {/* <Noti noti={noti} setNoti={setNoti} /> */}
    </Box>
  );
}

