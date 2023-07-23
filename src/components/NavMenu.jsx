import { MenuItem, MenuList } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuItem, setMenuItem] = React.useState(location.pathname.split('/')[1]);

  const menuItems = React.useMemo(() => ['chat', 'image'], []);

  const onMenuItemClick = (menuItem) => {
    menuItem = menuItems[menuItem];

    navigate(`/${menuItem}`);
    setMenuItem(menuItem);
  };

  React.useEffect(() => {
    const page = location.pathname.split('/')[1];
    const id = location.pathname.split('/')[2];
    if (menuItems.includes(page) && !id) {
      navigate(`/${menuItem}`);
    }
  }, [menuItems, menuItem, navigate, location.pathname]);

  return (
    <MenuList
      dense
      sx={{
        display: 'flex',
        flexDirection: 'row',
        p: 0,
        height: '100%',
        pr: 1,
      }}
    >
      {menuItems.map((x, i) => (
        <MenuItem
          key={x}
          selected={x === menuItem}
          sx={{ textTransform: 'capitalize', borderRadius: 1, ml: 1 }}
          onClick={() => onMenuItemClick(i)}
        >
          {t(x)}
        </MenuItem>
      ))}
    </MenuList>
  );
}
