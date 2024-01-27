import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Autocomplete, Box, Fab, Grid, Paper, Stack, TextField, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import AppContext from '../contexts/AppContext';
import UserContext from '../contexts/UserContext';
import { useChat, useModels } from '../hooks/useAPI';
import AssistantMsgMarkdown from './AssistantMsgMarkdown';
import './Chat.css';
import InputBox from './InputBox';
import LoadingProgress from './LoadingProgress';

const { VITE_CHAT_API_URL } = import.meta.env;

const streamChatCompletion = async ({ user, body }) =>
  fetch(`${VITE_CHAT_API_URL}/openai/chat/completion`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token} `,
    },
    body,
  });

export default function Chat({ selectedChat, onChatSave, setSavedPromptOpen }) {
  document.title = 'chat';

  const { user } = useContext(UserContext);

  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const footerRef = useRef(null);
  const theme = useTheme();
  const { setToast } = useContext(AppContext);

  const models = useModels();
  const [model, setModel] = React.useState(models.data?.data?.data[0]);
  const [chat, setChat] = React.useState([]);
  const [isCompletionLoading, setIsCompletionLoading] = React.useState(false);
  const [isReading, setIsReading] = React.useState(false);
  const [lastMsgHeight, setLastMsgHeight] = React.useState();
  const lastUserMessage = useRef('');

  const { data, error, isLoading, isValidating } = useChat(selectedChat);

  useEffect(() => {
    if (models.error || models.isLoading) return;
    if (models.data?.data?.status === 'success') {
      setModel(models.data.data.data[0]);
    }
  }, [models.data, models.error, models.isLoading]);

  useEffect(() => {
    if (error || isLoading) return;
    if (data?.data?.status === 'success') {
      setChat(data.data.data.data.chats);
      document.title = data.data.data.data.title;
    } else {
      setChat([]);
    }
  }, [data, error, isLoading]);

  const updateCurAssistantMsg = (id, ts, msg) => {
    setChat((prev) => [
      ...prev.filter((x) => x.metadata.id !== id),
      {
        metadata: { id, ts },
        message: {
          role: 'assistant',
          content: msg,
        },
      },
    ]);
  };

  const updateLastMsgHeight = () => {
    if (lastMsgRef.current) {
      const boundingRect = lastMsgRef.current.getBoundingClientRect();
      const { height } = boundingRect;
      setLastMsgHeight(height);
    }
  };

  const onMessagesSubmit = async (newMsg) => {
    const ts = dayjs().toISOString();
    lastUserMessage.current = newMsg;
    const newChat = {
      metadata: { id: `user${chat.length}`, ts },
      message: { role: 'user', content: newMsg },
    };
    setChat((prev) => [...prev, newChat]);
    setIsCompletionLoading(true);

    try {
      const body = JSON.stringify({ messages: [...chat.map((x) => x.message), newChat.message], config: { model } });

      const stream = await streamChatCompletion({ user, body });

      if (!stream.ok) throw new Error((await stream.text()) || '');

      const reader = stream.body.getReader();

      setIsReading(true);

      const msg = { id: null, content: '' };

      const read = () =>
        reader.read().then(({ done, value }) => {
          if (!done) {
            const decoder = new TextDecoder();
            const chunk = decoder.decode(value).split('\n');
            chunk.pop();

            chunk.forEach((x) => {
              const obj = JSON.parse(x);
              if (msg.id === null) {
                msg.id = obj.id;
              }
              msg.content += obj.choices[0].delta.content || '';
            });

            // if (chat[chat.length - 1]?.message?.role !== 'assistant') {
            //   updateCurAssistantMsg(msg.id, ts, msg.content);
            // }
            updateCurAssistantMsg(msg.id, ts, `${msg.content}▊`);
            updateLastMsgHeight();

            // if (lastMsgRef.current) {
            //   // lastMsgRef.current.innerHTML = renderToString(<AssistantMsgMarkdown content={`${msg.content} ▊`} />);
            //   updateLastMsgHeight();
            // }
          }
          if (done) {
            setIsReading(false);
            // lastMsgRef.current.innerHTML = '';
            updateCurAssistantMsg(msg.id, ts, msg.content);
            return;
          }

          read();
        });

      read();
    } catch (error) {
      console.error(error.message);
      setToast({ text: `API error: ${error.message} `, severity: 'error' });
    } finally {
      setIsCompletionLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.length, lastMsgHeight]);

  useEffect(() => {
    updateLastMsgHeight();
  }, [chat]);

  const onSaveBtnClick = async () => {
    const { data } = await axios.post(`${VITE_CHAT_API_URL}/my/chat/add`, { chats: chat }).catch((e) => {
      setToast({
        text: `API error: ${e.response.data.message}`,
        severity: 'error',
      });
    });
    if (data?.status === 'success') setToast({ text: `Saved successfully!`, severity: 'success' });
    onChatSave();
    setChat([]);
  };

  return (
    <Grid item xs={12} sm={12} md={8} lg={9} xl={9} sx={{ height: '100%' }}>
      <Stack style={{ height: '100%' }} spacing={1}>
        <Paper sx={{ borderRadius: 3, display: 'flex', alignItems: 'center', p: 1 }}>
          {models.data && model && (
            <Autocomplete
              onChange={(_e, v) => setModel(v ?? models.data.data.data[0])}
              value={model}
              size="small"
              fullWidth
              options={models.data?.data?.data}
              groupBy={(option) => option?.group}
              getOptionLabel={(option) => option?.id}
              renderInput={(params) => <TextField {...params} label="Choose Model" />}
            />
          )}
        </Paper>
        <Paper sx={{ borderRadius: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Stack>
            <LoadingProgress show={isLoading || isValidating || isCompletionLoading} />
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
            <Stack className="no-scrollbar" sx={{ alignItems: 'center', width: '100%', overflowY: 'scroll' }}>
              <Stack spacing={2} sx={{ width: '100%' }}>
                {chat.map((x, idx) => {
                  const isAssistant = x.message.role === 'assistant';
                  return (
                    <Stack key={idx} sx={{ width: '100%', alignItems: isAssistant ? 'start' : 'end' }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'end', maxWidth: '100%' }}>
                        <Paper
                          ref={idx === chat.length - 1 ? lastMsgRef : undefined}
                          elevation={0}
                          sx={{
                            p: 1,
                            borderRadius: 3,
                            textAlign: isAssistant ? 'left' : 'right',
                            width: '100%',
                            backgroundColor:
                              theme.palette.mode === 'light' ? 'rgba(225, 232, 239)' : 'rgba(44, 44, 44)',
                            ...(isAssistant && {
                              backgroundColor: 'rgb(63, 147, 120)',
                            }),
                            ...(isAssistant && theme.palette.mode === 'light' && { filter: 'brightness(1.25)' }),
                          }}
                        >
                          {isAssistant ? (
                            <>
                              {/* <Box ref={idx === chat.length - 1 ? lastMsgRef : undefined} /> */}
                              {/* see renderToString() above */}
                              <AssistantMsgMarkdown content={x.message.content} canCopy />
                            </>
                          ) : (
                            <Typography>{x.message.content}</Typography>
                          )}
                        </Paper>
                      </Stack>
                      <Typography sx={{ fontSize: '0.6rem', textAlign: 'end', color: 'grey' }}>
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
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
            >
              <Stack direction="row" sx={{ display: 'flex', justifyContent: 'right', width: '100%' }}>
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
                  isLoading={isCompletionLoading}
                  isReading={isReading}
                  canSave={!!chat.length}
                  onSaveBtnClick={onSaveBtnClick}
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Grid>
  );
}
