import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { UserContext } from 'contexts/UserContext';
import { ColorModeContext } from 'contexts/utilContext';
import jwtDecode from "jwt-decode";
import React, { useEffect, useMemo } from 'react';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import { Toast } from './components/Toast';
import TopBar from './components/TopBar';
import { AppContext } from './contexts/AppContext';
import Chats from './pages/Chats';
import Images from './pages/Images';
import Login from './pages/Login';
import Profile from './pages/Profile';

axios.interceptors.request.use(
  config => {
    const { origin } = new URL(config.url);
    const allowedOrigins = [process.env.REACT_APP_CHAT_API_URL];
    const token = localStorage.getItem('token');
    if (allowedOrigins.includes(origin) && token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
  },
  error => Promise.reject(error)
);

const queryClient = new QueryClient();

const { REACT_APP_CHAT_API_URL } = process.env;

function App() {
  document.body.style.transition = 'background-color 0.1s ease-in-out';
  const preferedMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const [mode, setMode] = React.useState(preferedMode);
  const navigate = useNavigate();
  const location = useLocation();
  const assumedUser = useMemo(() => {
    return localStorage['token']
      ? { email: jwtDecode(localStorage['token'])?.email, token: localStorage['token'] }
      : null;
  }, []);

  const [user, setUser] = React.useState(assumedUser);
  const [app, setApp] = React.useState({ page: '/' });
  const [toast, setToast] = React.useState({});
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  React.useEffect(() => {
    (async () => {
      if (email && otp) {
        const { data } = await axios.post(`${process.env.REACT_APP_CHAT_API_URL}/login`, { email, otp });

        if (data?.status === 'success') {
          if (data?.data?.user) {
            console.log('setUser', data.data.user);
            setUser(data.data.user);
          }
          setToast({ text: data.message, severity: 'success' });
        } else {
          setToast({ text: data.message, severity: 'error' });
        }
      }
    })();

  }, [email, otp, assumedUser]);


  React.useEffect(() => setMode(preferedMode), [preferedMode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        // @ts-ignore
        palette: { mode },
      }),
    [mode],
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      localStorage.removeItem('token');
    };
    if (user && ['/', '/login'].includes(location.pathname)) {
      localStorage.setItem('token', user.token);
      window.location.replace('/chat');
    };

  }, [user, location.pathname, navigate]);

  useEffect(() => {
    const id = setInterval(() => {
      if (user) {
        (async () => {
          const { data } = await axios.post(`${REACT_APP_CHAT_API_URL}/me/refresh`);
          if (data.status === 'success') {
            setUser(data.data.user);
          } else {
            setToast({ text: data.message, severity: 'error' });
            setUser(null);
          }
        })();
      }
    }, 1000 * 60 * 5);
    return () => clearInterval(id);
  }, [user]);

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={{ app, setApp, toast, setToast }}>
              <UserContext.Provider value={{ user, setUser }}>
                <TopBar />
                <Toast />
                <Routes>
                  {user ?
                    <>
                      <Route path='/' element={<Chats />} />
                      <Route path='/chat' element={<Chats />} />
                      <Route path='/chat/:id' element={<Chats />} />
                      <Route path='/account' element={<Profile />} />
                      <Route path='/account/:section' element={<Profile />} />
                      <Route path='/image' element={<Images />} />
                      <Route path='/image/:id' element={<Images />} />
                      <Route path='/*' element={<Chats />} />
                    </>
                    : <Route path='*' element={<Login />} />
                  }
                </Routes>
                <Footer />
              </UserContext.Provider>
            </AppContext.Provider>
          </QueryClientProvider>
        </ColorModeContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
