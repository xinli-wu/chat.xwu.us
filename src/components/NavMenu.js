import { MenuItem, MenuList } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItem, setMenuItem] = React.useState(location.pathname.split('/')[1]);

  const menuItems = ['chat', 'image'];

  const onMenuItemClick = (menuItem) => {
    menuItem = menuItems[menuItem];

    setMenuItem(prev => menuItem ? menuItem : prev);
    navigate(`/${menuItem}`);
  };

  return (
    <>
      <MenuList dense
        sx={{ display: 'flex', flexDirection: 'row', p: 0, height: '100%', pr: 1 }}
      >
        {menuItems.map((x, i) => (
          <MenuItem
            key={x}
            selected={x === menuItem}
            sx={{ textTransform: 'capitalize', borderRadius: 1, ml: 1 }}
            onClick={() => onMenuItemClick(i)}
          >
            {x}
          </MenuItem>
        ))}
      </MenuList>
    </>
  );
}