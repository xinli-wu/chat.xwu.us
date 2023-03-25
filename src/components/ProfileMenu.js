import { Avatar, IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function ProfileMenu() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user, setUser } = React.useContext(UserContext);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogoutClick = (_e) => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const onProfileClick = (_e) => {
    handleClose();
    navigate('profile');
    // setApp(prev => ({ ...prev, page: `/profile` }));
  };

  return (
    <>
      <IconButton
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
        <MenuItem dense onClick={onProfileClick}>Profile</MenuItem>
        <MenuItem dense onClick={onLogoutClick}>Logout</MenuItem>
      </Menu>
    </>
  );
}