import { useTheme } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import uChatDarkH from '../assets/images/logo/uChatDarkH.png';
import uChatDarkV from '../assets/images/logo/uChatDarkV.png';
import uChatLightH from '../assets/images/logo/uChatLightH.png';
import uChatLightV from '../assets/images/logo/uChatLightV.png';

export default function Logo() {
  const navigate = useNavigate();
  const location = useLocation();

  const altLogo = 0; // Math.floor(Math.random() * 2);
  const theme = useTheme();
  const { mode } = theme.palette;

  const logoH = {
    dark: [uChatDarkH, uChatDarkH],
    light: [uChatLightH, uChatLightH],
  };

  const logoV = {
    dark: [uChatDarkV, uChatDarkV],
    light: [uChatLightV, uChatLightV],
  };

  const favicon = document.getElementById('favicon');
  if (favicon) favicon.href = logoV[mode][altLogo];

  const onLogoClick = (e) => {
    if (location.pathname !== '/') navigate({ pathname: '/' });
  };

  return (
    <img src={logoH[mode][altLogo]} alt="Logo" onClick={onLogoClick} style={{ cursor: 'pointer', height: '100%' }} />
  );
}
