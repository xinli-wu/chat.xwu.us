import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import axios from 'axios';
import { UserContext } from 'contexts/UserContext';
import { ColorModeContext } from 'contexts/utilContext';
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import TopBar from './components/TopBar';
import Chat from './pages/Chat';
import Login from './pages/Login';

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

  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  const preferedMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
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
        palette: {
          // @ts-ignore
          mode
        },
      }),
    [mode],
  );

  React.useEffect(() => {
    if (!user) navigate('/login');
    if (user) navigate('/chat');

  }, [user, navigate]);

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <UserContext.Provider value={{ user, setUser }}>
              <TopBar />
              <Routes>
                {user ?
                  <>
                    <Route path='/' element={<Chat />} />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='*' element={<Chat />} />
                    {/* disbale image creation, too expensive :( */}
                    {/* <Route path='/image' element={<Image />} /> */}
                  </>
                  : <Route path='*' element={<Login />} />
                }
              </Routes>
            </UserContext.Provider>
          </QueryClientProvider>
        </ColorModeContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
