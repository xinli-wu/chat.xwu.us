import { Box } from '@mui/material';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import InputBox from 'components/InputBox';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useRef } from 'react';
import { ChatsArea } from '../components/ChatsArea';
import { ImageRenderer } from '../components/ImageRenderer';
import './Image.css';
import { AppContext } from '../contexts/AppContext';

export default function Image() {
  document.title = 'image';

  const { REACT_APP_CHAT_API_URL } = process.env;
  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const footerRef = useRef(null);
  const { setToast } = useContext(AppContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [chats, setChats] = React.useState([]);

  const onMessagesSubmit = async (prompt) => {
    const now = dayjs().toISOString();
    const newChat = {
      metadata: { id: 'user' + chats.length, c: now },
      message: { role: 'user', content: prompt }
    };
    setChats(prev => ([...prev, newChat]));
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${REACT_APP_CHAT_API_URL}/openai/image/create`, { prompt });
      if (data.status === 'error') {
        setToast({ text: data.message, severity: 'error' });
      }
      if (data.status === 'success') {
        setChats(prev => ([
          ...prev,
          {
            metadata: { id: data.created, c: now },
            message: { role: 'assistant', content: data.data }
          }
        ]));
      }

    } catch (error) {
      console.log(error.message);
      setToast({ text: `API error: ${error.message}`, severity: 'error' });
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


  return (
    <>
      <ChatsArea>
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
          <Stack spacing={2} sx={{ width: '100%' }}>
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
                        ? <Box ref={idx === chats.length - 1 ? lastMsgRef : undefined}>
                          <Grid container spacing={1}>
                            {chat.message.content.map(({ b64_json, url }, idx) => (
                              <Grid key={idx} item xs={12} sm={12}>
                                <ImageRenderer b64_json={b64_json} url={url} />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                        : <Typography>{chat.message.content}</Typography>
                      }
                    </Paper>
                  </Stack>
                  <Typography sx={{ fontSize: '0.6rem', textAlign: 'end', color: 'grey' }}>{dayjs(chat.metadata.ts).format('h:mm a')}</Typography>
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
          </Stack>
        </Stack>
      </ChatsArea>
    </>
  );
}
