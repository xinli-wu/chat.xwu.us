import AddIcon from '@mui/icons-material/Add';
import { Box, Fab, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import InputBox from 'components/InputBox';
import dayjs from 'dayjs';
import throttle from 'lodash.throttle';
import React, { useContext, useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';
import { useChat } from '../hooks/useAPI';
import { AssistantMsgMarkdown } from './AssistantMsgMarkdown';
import './Chat.css';
import LoadingProgress from './LoadingProgress';

export default function Chat({ selectedChat, onChatSave }) {
  document.title = 'chat';

  const { REACT_APP_CHAT_API_URL } = process.env;
  const { user } = useContext(UserContext);

  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const footerRef = useRef(null);
  const theme = useTheme();
  const { setToast } = useContext(AppContext);

  const [chat, setChat] = React.useState([]);
  const [isCompletionLoading, setIsCompletionLoading] = React.useState(false);
  const [isReading, setIsReading] = React.useState(false);
  const [lastMsgHeight, setLastMsgHeight] = React.useState();
  const lastUserMessage = useRef('');

  const { data, error, isLoading, isValidating } = useChat(selectedChat);

  useEffect(() => {
    if (error || isLoading) return;
    if (data?.data?.status === 'success') {
      setChat(data.data.data.data.chats);
      document.title = data.data.data.data.title;
    } else {
      setChat([]);
    }

  }, [data, error, isLoading]);

  const setCurAssistantMsg = (id, ts, msg) => {
    setChat(prev => [
      ...prev.filter(x => x.metadata.id !== id),
      {
        metadata: { id, ts },
        message: {
          role: 'assistant',
          content: msg
        }
      }]
    );
  };

  const throttledSetCurAssistantMsg = throttle(setCurAssistantMsg, 70, { leading: true, trailing: true });

  const onMessagesSubmit = async (newMsg) => {
    const ts = dayjs().toISOString();
    lastUserMessage.current = newMsg;
    const newChat = { metadata: { id: 'user' + chat.length, ts }, message: { role: 'user', content: newMsg } };
    setChat(prev => [...prev, newChat]);
    setIsCompletionLoading(true);

    try {
      const raw = await fetch(`${REACT_APP_CHAT_API_URL}/openai/chat/completion`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ messages: [...chat.map(x => x.message), newChat.message] })
      });

      if (!raw.ok) {
        throw new Error(await raw.text() || '');
      };
      const reader = raw.body.getReader();

      setIsReading(true);
      let finalMsg = '';
      let msgId = null;

      const read = () => reader.read().then(({ done, value }) => {
        if (done) return;

        const decoder = new TextDecoder();
        const lines = decoder.decode(value).toString().split('\n').filter(line => line.trim() !== '');
        lines.forEach(l => {
          const msg = l.replace(/^data: /, '');

          if (msg !== '[DONE]') {
            const msgObj = JSON.parse(msg);
            if (!msgId) msgId = msgObj.id;
            const { content } = msgObj.choices[0].delta;
            if (content) {

              finalMsg += content;

              //setState once to push a new chat, content can be anything
              // if (finalMsg === '') throttledSetCurAssistantMsg(msgObj.id, ts, ' ▊');
              throttledSetCurAssistantMsg(msgObj.id, ts, finalMsg + ' ▊');
              // finalMsg += content;
              if (lastMsgRef.current) {
                const boundingRect = lastMsgRef.current.getBoundingClientRect();
                const { height } = boundingRect;
                setLastMsgHeight(height);
                // lastMsgRef.current.innerHTML = renderToString(<AssistantMsgMarkdown content={finalMsg + ' ▊'} />);
              }
            }
          } else {
            // if (lastMsgRef.current) {
            //   const boundingRect = lastMsgRef.current.getBoundingClientRect();
            //   const { height } = boundingRect;
            //   setLastMsgHeight(height);
            //   lastMsgRef.current.innerHTML = renderToString(<AssistantMsgMarkdown content={finalMsg} />);
            // }
            throttledSetCurAssistantMsg(msgId, ts, finalMsg);

            setIsReading(false);
          }

        });

        read();
      });

      read();
    } catch (error) {
      console.log(error.message);
      setToast({ text: `API error: ${error.message}`, severity: 'error' });
    } finally {
      setIsCompletionLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.length, lastMsgHeight]);

  const onNewChatClick = async () => {

    await axios.post(`${REACT_APP_CHAT_API_URL}/my/chat/add`, { chats: chat });
    onChatSave();
    // navigate('/chat');
    setChat([]);
  };

  return (
    <Grid item xs={12} sm={12} md={8} lg={9} xl={9} sx={{ height: '100%' }}>
      <Paper sx={{
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        justifyContent: 'space-between',
        // alignItems: 'center',
        ...(isMobile && { pb: 6 })
      }}>
        <Stack>
          <LoadingProgress show={isLoading || isValidating || isCompletionLoading} />
        </Stack>
        <Stack className='no-scrollbar' sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1280,
          overflowY: 'scroll',
          overflowX: 'visible',
          flexGrow: 1,
          height: '100%',
          p: 1
        }}>
          <Stack spacing={2} sx={{ width: '100%' }} >
            {chat.map((x, idx) => {
              const isAssistant = x.message.role === 'assistant';
              return (
                <Stack key={idx} sx={{ width: '100%', alignItems: isAssistant ? 'start' : 'end' }}>
                  <Stack direction='row' spacing={1} sx={{ alignItems: 'end', maxWidth: '100%' }}>
                    <Paper elevation={0} sx={{
                      p: 1,
                      borderRadius: 3,
                      textAlign: isAssistant ? 'left' : 'right',
                      width: '100%',
                      backgroundColor: theme.palette.mode === 'light' ? 'rgba(225, 232, 239)' : 'rgba(44, 44, 44)',
                      ...(isAssistant && { backgroundColor: 'rgb(63, 147, 120)' }),
                      ...((isAssistant && theme.palette.mode === 'light') && { filter: 'brightness(1.25)' })
                    }}>
                      {isAssistant
                        ? <Box ref={idx === chat.length - 1 ? lastMsgRef : undefined}>
                          <AssistantMsgMarkdown content={x.message.content} />
                        </Box>
                        : <Typography>{x.message.content}</Typography>
                      }
                    </Paper>
                  </Stack>
                  <Typography sx={{ fontSize: '0.6rem', textAlign: 'end', color: 'grey' }}>{dayjs(x.metadata.ts).format('h:mm a')}</Typography>
                </Stack>
              );
            })}
          </Stack>
          <div ref={bottomRef} />
        </Stack>
        {!!chat.length &&
          <Stack sx={{ position: 'absolute', bottom: 90, alignSelf: 'end' }}>
            <Fab
              disabled={isCompletionLoading || isReading}
              size='small'
              color='primary'
              aria-label='new conversation'
              onClick={onNewChatClick}
              sx={{ transform: 'scale(0.8)' }}
            >
              <AddIcon />
            </Fab>
          </Stack>
        }
        <Stack className='no-scrollbar' sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1280
        }}>
          <Stack ref={footerRef} spacing={1} sx={{ width: '100%' }}>
            <InputBox onMessagesSubmit={onMessagesSubmit} isLoading={isCompletionLoading} isReading={isReading} />
          </Stack>
        </Stack>
      </Paper >
    </Grid >
  );
}
