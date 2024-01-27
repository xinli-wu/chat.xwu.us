import { Button, Paper, Popover, Stack, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { QRCode } from 'react-qrcode-logo';
import ColorModeSwitch from './ColorModeSwitch';
import UserContext from '../contexts/UserContext';

function SupoortChannel({ channel }) {
  const onChannelClick = () => {
    if (channel.clickable) window.open(channel.url, '_blank');
  };
  return (
    <Button size="small" sx={{ color: 'text.secondary', p: 2 }} onClick={onChannelClick}>
      <Stack spacing={1}>
        <QRCode
          quietZone={5}
          value={channel.url}
          size={128}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
        />
        <Typography variant="body2" sx={{ fontSize: '0.65rem' }}>
          {channel.name}
        </Typography>
      </Stack>
    </Button>
  );
}

function AuthorInfo() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'mouse-over-popover' : undefined;

  const supportChannel = [
    { name: 'email', clickable: true, url: 'mailto:support.chat@xwu.us' },
    { name: 'weChat', clickable: false, url: 'https://u.wechat.com/kKAsskOumLxGYJ_-aa6yAzM' },
  ];

  return (
    <>
      <Button aria-describedby={id} size="small" sx={{ color: 'text.secondary', padding: 0 }} onClick={handleClick}>
        support
      </Button>
      {/* <Typography
        variant="body2"
        sx={{ color: 'text.secondary' }}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handleClick}
      >
        xwu7
      </Typography> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Stack direction="row">
          {supportChannel.map((channel, i) => (
            <SupoortChannel key={i} channel={channel} />
          ))}
        </Stack>
      </Popover>
    </>
  );
}

export default function Footer() {
  const { user } = useContext(UserContext);

  const supportChannel = [
    {
      name: 'email',
      qr: {
        bgColor: '#ffffff',
      },
      clickable: true,
      url: `mailto:support.chat@xwu.us?subject=uChat Support&body=---%0D%0A${user._id}`,
    },
    {
      name: 'weChat',
      qr: {
        bgColor: '#09B83E',
        logoImage: 'https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon64_wx_logo.png',
      },
      clickable: false,
      url: 'https://u.wechat.com/kKAsskOumLxGYJ_-aa6yAzM',
    },
  ];

  return (
    <Paper sx={{ borderRadius: isMobile ? 0 : 3, p: 0.5 }}>
      <Stack justifyContent="center" alignItems="end" sx={{ width: '100%' }}>
        <Stack direction="row" alignSelf="center">
          {supportChannel.map((channel, i) => (
            <SupoortChannel key={i} channel={channel} />
          ))}
        </Stack>
        {/* <AuthorInfo /> */}
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ by xwu7
          </Typography>
          <ColorModeSwitch />
        </Stack>
        <Typography variant="body2" sx={{ fontSize: '0.65rem', textAlign: 'right', color: 'grey' }}>
          Your audio may be sent to a web service for recognition processing on certain browsers, such as Chrome
        </Typography>
      </Stack>
    </Paper>
  );
}
