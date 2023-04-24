import { Avatar, IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';

const { VITE_CHAT_API_URL } = import.meta.env;

export default function ProfileMenu() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user, setUser } = React.useContext(UserContext);
  const { setToast } = React.useContext(AppContext);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogoutClick = async (_e) => {
    const { data } = await axios.post(`${VITE_CHAT_API_URL}/me/logout`);
    if (data.status === 'success') {
      setUser(null);
      setToast({ text: data.message, severity: data.status });
    }

  };

  const onProfileClick = (_e) => {
    handleClose();
    navigate('/account');
  };

  return (
    <>
      <IconButton
        sx={{ p: 0 }}
        id='profile-button'
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color='inherit'
        size='small'
      >
        <Avatar sx={{ width: 32, height: 32, textTransform: 'capitalize' }}>{user.email.slice(0, 1)}</Avatar>
      </IconButton>
      <Menu
        id='profile-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'profile-button',
        }}
      >
        <MenuItem dense onClick={onProfileClick}>{t('Profile')}</MenuItem>
        <MenuItem dense onClick={onLogoutClick}>{t('Logout')}</MenuItem>
      </Menu>
    </>
  );
};