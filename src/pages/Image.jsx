import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Fab, Grid, Paper, Stack, Typography } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from 'react-router-dom';
import { ImageRenderer } from '../components/ImageRenderer';
import InputBox from '../components/InputBox';
import LoadingProgress from '../components/LoadingProgress';
import { AppContext } from '../contexts/AppContext';
import { useImage } from '../hooks/useAPI';
import './Image.css';

export default function Image({ selectedChat, onChatSave, setSavedPromptOpen }) {
  document.title = 'image';
  const { id } = useParams();
  const { VITE_CHAT_API_URL } = import.meta.env;
  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const footerRef = useRef(null);
  const { setToast } = useContext(AppContext);

  const [chat, setChat] = React.useState({ data: [], isLoading: false });

  const { data, error, isLoading, isValidating } = useImage(selectedChat);

  useEffect(() => {
    if (error) return;
    if (isLoading) setChat((prev) => ({ ...prev, isLoading: true }));
    if (data?.data?.status === 'success') {
      setChat({ data: data.data.data.data.chats, isLoading: false });
      document.title = data.data.data.data.title;
    } else {
      setChat({ data: [], isLoading: false });
    }
  }, [data, error, isLoading]);

  const onMessagesSubmit = async (prompt) => {
    const now = dayjs().toISOString();
    const newChat = {
      metadata: { id: 'user' + chat.data.length, c: now },
      message: { role: 'user', content: prompt },
    };

    setChat((prev) => ({ data: [...prev.data, newChat], isLoading: true }));

    try {
      const { data } = await axios.post(`${VITE_CHAT_API_URL}/openai/image/create`, { prompt });
      if (data.status === 'error') {
        setToast({ text: data.message, severity: 'error' });
        setChat((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
      if (data.status === 'success') {
        setChat((prev) => ({
          data: [
            ...prev.data,
            {
              metadata: { id: data.created, c: now },
              message: { role: 'assistant', content: data.data },
            },
          ],
          isLoading: false,
        }));
      }
    } catch (error) {
      console.log(error);
      setToast({
        text: `API error: ${error.response?.data?.message} `,
        severity: 'error',
      });
      setChat((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => clearTimeout(id);
  }, [chat.data.length]);

  const onSaveBtnClick = async () => {
    setChat((prev) => ({ ...prev, isLoading: true }));
    await axios.post(`${VITE_CHAT_API_URL}/my/image/add`, { chats: chat.data }).catch((e) => {
      setToast({
        text: `API error: ${e.response.data.message} `,
        severity: 'error',
      });
    });
    onChatSave();
    setChat({ data: [], isLoading: false });
  };

  return (
    <Grid item xs={12} sm={12} md={8} lg={9} xl={9} sx={{ height: '100%' }}>
      <Paper
        sx={{
          borderRadius: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Stack>
          <LoadingProgress show={isLoading || isValidating || chat.isLoading} />
        </Stack>
        <Stack
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'scroll',
            maxWidth: 1280,
            alignSelf: 'center',
            p: 1,
            pt: 0,
          }}
        >
          <Stack
            className="no-scrollbar"
            sx={{
              alignItems: 'center',
              width: '100%',
              overflowY: 'scroll',
            }}
          >
            <Stack spacing={2} sx={{ width: '100%' }}>
              {chat.data.map((x, idx) => {
                const isAssistant = x.message.role === 'assistant';
                return (
                  <Stack
                    key={idx}
                    sx={{
                      width: '100%',
                      alignItems: isAssistant ? 'start' : 'end',
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'end' }}>
                      <Paper
                        elevation={12}
                        sx={{
                          p: 1,
                          borderRadius: 3,
                          textAlign: isAssistant ? 'left' : 'right',
                          width: '100%',
                        }}
                      >
                        {isAssistant ? (
                          <Box ref={idx === chat.data.length - 1 ? lastMsgRef : undefined}>
                            <Grid container spacing={1}>
                              {x.message.content.map(({ b64_json, url }, idx) => (
                                <Grid key={idx} item xs={12} sm={12}>
                                  <ImageRenderer b64_json={b64_json} url={url} />
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        ) : (
                          <Typography>{x.message.content}</Typography>
                        )}
                      </Paper>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: '0.6rem',
                        textAlign: 'end',
                        color: 'grey',
                      }}
                    >
                      {dayjs(x.metadata.ts).format('h:mm a')}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
            <div ref={bottomRef} />
          </Stack>
          <Stack
            className="no-scrollbar"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Stack
              direction={'row'}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box>
                {isMobile && (
                  <Fab
                    size="small"
                    color="primary"
                    onClick={() => setSavedPromptOpen((prev) => !prev)}
                    sx={{ transform: 'scale(0.8)' }}
                  >
                    <ChevronRightIcon />
                  </Fab>
                )}
              </Box>
            </Stack>
            <Stack ref={footerRef} spacing={1} sx={{ width: '100%' }}>
              <InputBox
                onMessagesSubmit={onMessagesSubmit}
                isLoading={isLoading}
                disabled={!!chat.data.length || !!id}
                canSave={!!chat.data.length || !!id}
                onSaveBtnClick={onSaveBtnClick}
              />
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Grid>
  );
}
