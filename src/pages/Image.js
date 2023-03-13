import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import InputBox from 'components/InputBox';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import { Noti } from '../components/Noti';
import './Image.css';

export default function Image() {
  document.title = 'image';

  const { REACT_APP_CHAT_API_URL } = process.env;
  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const footerRef = useRef(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const [noti, setNoti] = React.useState({ text: null, severity: undefined });


  const onMessagesSubmit = async (newMsg) => {
    const newChat = {
      metadata: { id: 'user' + chats.length, ts: dayjs().format('h:mm a') },
      message: { role: 'user', content: newMsg }
    };
    setChats(prev => [...prev, newChat]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${REACT_APP_CHAT_API_URL}/openai/image/create`, {
        prompt: newMsg
      });

      console.log({ res });

      setChats(prev => [...prev, {
        metadata: { id: res.data.created, ts: dayjs().format('h:mm a') },
        message: { role: 'assistant', content: res.data.data }
      }]);

    } catch (error) {
      console.log(error.message);
      setNoti({ text: `API error: ${error.message}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(id);
  }, [chats.length]);

  console.log(chats);
  return (
    <>
      <Box sx={{
        zIndex: -10,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexFlow: 'column nowrap',
        height: '100vh'
      }}>
        <Stack className='no-scrollbar' sx={{
          pt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '90vw',
          maxWidth: 1280,
          overflowY: 'scroll',
          flexGrow: 1,
        }}>
          <Stack spacing={2} sx={{ width: '90%', maxWidth: 1280, }}>
            {chats.map((chat, idx) => {
              const isAssistant = chat.message.role === 'assistant';
              return (
                <Stack key={idx} sx={{ width: '100%', alignItems: isAssistant ? 'start' : 'end' }}>
                  <Stack direction='row' spacing={1} sx={{ alignItems: 'end' }}>
                    <Paper elevation={12} sx={{
                      p: 1,
                      borderRadius: 3,
                      textAlign: isAssistant ? 'left' : 'right',
                      width: '100%',
                    }}>
                      {isAssistant
                        ? <div ref={idx === chats.length - 1 ? lastMsgRef : undefined}>
                          <Grid container spacing={1}>
                            {chat.message.content.map(({ b64_json }, idx) => (
                              <Grid key={idx} item xs={6} sm={3}>
                                <img src={`data:image/jpeg;base64,${b64_json}`} alt='' style={{ width: '100%' }} />
                              </Grid>
                            ))}
                          </Grid>
                        </div>
                        : <Typography>{chat.message.content}</Typography>
                      }
                    </Paper>
                  </Stack>
                  <Typography sx={{ fontSize: '0.6rem', textAlign: 'end', color: 'grey' }}>{chat.metadata.ts}</Typography>
                </Stack>
              );
            })}
            <div ref={bottomRef} />
          </Stack>
        </Stack>
        <Stack className='no-scrollbar' sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}>
          <Stack ref={footerRef} spacing={1} sx={{ width: '90%', maxWidth: 1280 }}>
            <InputBox onMessagesSubmit={onMessagesSubmit} isLoading={isLoading} />
            <Stack spacing={0}>
              <Typography variant='body2' sx={{ fontSize: '0.65rem', textAlign: 'right', color: 'grey' }}>Powered by gpt-3.5-turbo</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.65rem', textAlign: 'right', color: 'grey' }}>Your audio may be sent to a web service for recognition processing on certain browsers, such as Chrome</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Noti noti={noti} setNoti={setNoti} />
    </>
  );
}

