import { Box, Stack, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import Logo from './Logo';
import NavMenu from './NavMenu';
import ProfileMenu from './ProfileMenu';

export default function TopBar() {
  const theme = useTheme();
  const { user } = useContext(UserContext);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: 40,
          justifyContent: 'space-between',
          top: 0,
          backdropFilter: `blur(.2rem) brightness(${theme.palette.mode === 'dark' ? 0.85 : 0.95})`,
          zIndex: 1,
        }}
      >
        <Box sx={{ width: 100 }}>
          <Logo />
        </Box>
        <Box>
          {user && (
            <Stack
              direction={'row'}
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                p: 0.5,
              }}
            >
              <NavMenu />
              <ProfileMenu />
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
}
