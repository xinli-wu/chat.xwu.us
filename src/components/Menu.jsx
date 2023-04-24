import { Button, Stack } from '@mui/material';
import React from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();
  const menu = ['Chat', 'Image'];
  const { pathname } = useLocation();

  return (
    <Stack spacing={2} direction='row' sx={{ pl: 0 }}>
      {menu.map((item) => {
        const curPage = matchPath(pathname.toLocaleLowerCase(), `/${item.toLocaleLowerCase()}`);
        return (
          <Button key={item} size='small' onClick={() => navigate(`/${item.toLocaleLowerCase()}`)}
            variant='text'
            sx={{ borderBottom: `${curPage ? 1 : 0}px solid`, }}
          >
            {item}
          </Button>
        );
      })}
    </Stack>
  );
}

export default Menu;