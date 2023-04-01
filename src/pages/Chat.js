import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import InputBox from 'components/InputBox';
import dayjs from 'dayjs';
import throttle from 'lodash.throttle';
import React, { useContext, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatsArea } from '../components/ChatsArea';
import { CopyCode } from '../components/CopyCode';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';
import './Chat.css';

export default function Chat() {

  const { REACT_APP_CHAT_API_URL } = process.env;
  const { user } = useContext(UserContext);

  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const footerRef = useRef(null);
  const theme = useTheme();
  const { setToast } = useContext(AppContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isReading, setIsReading] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const [lastMsgHeight, setLastMsgHeight] = React.useState();
  const lastUserMessage = useRef('');

  useEffect(() => {
    document.title = lastUserMessage.current || 'chat';
  }, [chats.length]);

  const setCurAssistantMsg = (id, ts, msg) => {
    setChats(prev => [
      ...prev.filter(x => x.metadata.id !== id),
      {
        metadata: { id: id, ts },
        message: {
          role: 'assistant',
          content: msg
        }
      }]
    );
  };

  const throttledSetCurAssistantMsg = throttle(setCurAssistantMsg, 70, { trailing: true });

  const onMessagesSubmit = async (newMsg) => {
    lastUserMessage.current = newMsg;
    const newChat = { metadata: { id: 'user' + chats.length, ts: dayjs().format('h:mm a') }, message: { role: 'user', content: newMsg } };
    setChats(prev => [...prev, newChat]);
    setIsLoading(true);

    try {
      const raw = await fetch(`${REACT_APP_CHAT_API_URL}/openai/chat/completion`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ messages: [...chats.map(x => x.message), newChat.message] })
      });

      if (!raw.ok) {
        throw new Error(await raw.text() || '');
      };
      const reader = raw.body.getReader();

      setIsReading(true);
      let finalMsg = '';
      let msgId = null;
      const ts = dayjs().format('h:mm a');

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

              throttledSetCurAssistantMsg(msgObj.id, ts, finalMsg + ' ▊');

              if (lastMsgRef.current) {
                const boundingRect = lastMsgRef.current.getBoundingClientRect();
                const { height } = boundingRect;
                setLastMsgHeight(height);
              }
            }
          } else {
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats.length, lastMsgHeight]);

  return (
    <>
      <ChatsArea>
        <Stack className='no-scrollbar' sx={{
          pt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1280,
          overflowY: 'scroll',
          flexGrow: 1,
          padding: '48px 5% 0px 5%',
        }}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            {chats.map((chat, idx) => {
              const isAssistant = chat.message.role === 'assistant';
              return (
                <Stack key={idx} sx={{ width: '100%', alignItems: isAssistant ? 'start' : 'end' }}>
                  <Stack direction='row' spacing={1} sx={{ alignItems: 'end', maxWidth: '100%' }}>
                    <Paper elevation={12} sx={{
                      p: 1,
                      borderRadius: 3,
                      textAlign: isAssistant ? 'left' : 'right',
                      width: '100%',
                      ...(isAssistant && { backgroundColor: 'rgb(63, 147, 120)' }),
                      ...((isAssistant && theme.palette.mode === 'light') && { filter: 'brightness(1.25)' })
                    }}>
                      {isAssistant
                        ? <Box ref={idx === chats.length - 1 ? lastMsgRef : undefined}>
                          <ReactMarkdown
                            components={(
                              {
                                code({ node, inline, className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || '') || ['language-javascript', 'javascript'];
                                  return !inline && match ? (
                                    <Stack sx={{ overflowX: 'scroll' }}>
                                      <CopyCode language={match[1]} code={String(children)} />
                                      <SyntaxHighlighter
                                        showLineNumbers
                                        // @ts-ignore
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag='div'
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    </Stack>
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                }
                              }
                            )}
                          >
                            {chat.message.content}
                          </ReactMarkdown>
                        </Box>
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
            <InputBox onMessagesSubmit={onMessagesSubmit} isLoading={isLoading} isReading={isReading} />
            <Stack spacing={0}>
              <Typography variant='body2' sx={{ fontSize: '0.65rem', textAlign: 'right', color: 'grey' }}>Powered by gpt-3.5-turbo</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.65rem', textAlign: 'right', color: 'grey' }}>Your audio may be sent to a web service for recognition processing on certain browsers, such as Chrome</Typography>
            </Stack>
          </Stack>
        </Stack>
      </ChatsArea>

    </>
  );
}

