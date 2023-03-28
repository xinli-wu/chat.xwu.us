import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { UserContext } from 'contexts/UserContext';
import { ColorModeContext } from 'contexts/utilContext';
import jwtDecode from "jwt-decode";
import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import { Toast } from './components/Toast';
import TopBar from './components/TopBar';
import { AppContext } from './contexts/AppContext';
import Chat from './pages/Chat';
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


function App() {
  document.body.style.transition = 'background-color 0.1s ease-in-out';
  const preferedMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const [mode, setMode] = React.useState(preferedMode);
  const navigate = useNavigate();
  const location = useLocation();
  const assumedUser = React.useMemo(() => {
    return localStorage['token'] ? { email: jwtDecode(localStorage['token'])?.email, token: localStorage['token'] } : null;
  }, []);

  const [user, setUser] = React.useState(assumedUser);
  const [app, setApp] = React.useState({ page: '/' });
  const [toast, setToast] = React.useState({});
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  React.useEffect(() => {
    (async () => {
      if ((!email || !otp) && assumedUser) {
        await axios(`${process.env.REACT_APP_CHAT_API_URL}/me`).catch(_e => setUser(null));
      }

      if (email && otp) {
        const res = await axios.post(`${process.env.REACT_APP_CHAT_API_URL}/login`, { email, otp });

        if (res.data?.status === 'success') {
          if (res.data?.data?.user) {
            localStorage['token'] = res.data.data.user.token;
            setUser(res.data.data.user);
          }
          setToast({ text: res.data.message, severity: 'success' });
        } else {
          setToast({ text: res.data.message, severity: 'error' });
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

    if (!user) navigate('/login');
    if (user && ['/', '/login'].includes(location.pathname)) navigate('/chat');

  }, [user, location.pathname, setApp, navigate]);

  React.useEffect(() => {
    (async () => {
      const res = await axios.post(`${process.env.REACT_APP_CHAT_API_URL}/me/refresh`);
      if (res.data?.status === 'success') {
        if (res.data?.data?.user) {
          localStorage['token'] = res.data.data.user.token;
          setUser(res.data.data.user);
        }
        setToast({ text: res.data.message, severity: 'success' });
      } else {
        setToast({ text: res.data.message, severity: 'error' });
      }
    })();
  }, []);

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
                      <Route path='/' element={<Chat />} />
                      <Route path='/chat' element={<Chat />} />
                      <Route path='/account' element={<Profile />} />
                      <Route path='/account/:section' element={<Profile />} />
                      {/* disbale image creation, too expensive :( */}
                      {/* <Route path='/image' element={<Image />} /> */}
                      <Route path='*' element={<Navigate replace to="/chat" />} />
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
