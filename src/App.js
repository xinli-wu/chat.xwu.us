import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { UserContext } from 'contexts/UserContext';
import { ColorModeContext } from 'contexts/utilContext';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
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
    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient();


function App() {
  document.body.style.transition = 'background-color 0.1s ease-in-out';
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [app, setApp] = React.useState({ page: '/' });

  const preferedMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'light' : 'light';
  const [mode, setMode] = React.useState(preferedMode);

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

  // useEffect(() => {
  //   console.log(app);
  //   if (location.pathname !== app.page) {
  //     navigate(app.page);
  //   }
  // }, [app, location.pathname, navigate]);

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={{ app, setApp }}>
              <UserContext.Provider value={{ user, setUser }}>
                <TopBar />
                <Routes>
                  {user ?
                    <>
                      <Route path='/' element={<Chat />} />
                      <Route path='/chat' element={<Chat />} />
                      <Route path='/profile' element={<Profile />} />
                      {/* disbale image creation, too expensive :( */}
                      {/* <Route path='/image' element={<Image />} /> */}
                      <Route path='*' element={<Chat />} />
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
