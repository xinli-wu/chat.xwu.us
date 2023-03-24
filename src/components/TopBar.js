import { Box, Button, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import BackBtn from './BackBtn';
import ColorModeSwitch from './ColorModeSwitch';
import Logo from './Logo';

export default function TopBar() {

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);

  const onLogoutClick = (e) => {
    localStorage.removeItem('token');
    setUser(null);

    if (location.pathname !== '/login') navigate('/login');
  };


  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: 40,
        position: 'fixed',
        justifyContent: 'space-between',
        top: 0,
        backdropFilter: `blur(.2rem) brightness(${theme.palette.mode === 'dark' ? 0.85 : 0.95})`,
        zIndex: 1,
      }}
    >
      <Box sx={{ alignItems: 'start' }}>
        <BackBtn />
      </Box>
      <Box sx={{ alignItems: 'center' }}>
        <Logo />
      </Box>
      <Box sx={{ alignItems: 'end' }}>
        {user && <Button onClick={onLogoutClick}>Logout</Button>}
        <ColorModeSwitch />
      </Box>
    </Box>
  );
}
