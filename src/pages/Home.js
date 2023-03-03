import { Box, Stack, Typography } from '@mui/material';
import InputBox from 'components/InputBox';
import LoadingProgress from 'components/LoadingProgress';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Paper } from '@mui/material';
import { Snackbar } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { Avatar } from '@mui/material';

export default function Home() {
  document.title = 'chat';
  const { REACT_APP_CHAT_API_URL } = process.env;
  const bottomRef = useRef(null);

  const [showLoading, setShowLoading] = React.useState(false);
  const [chats, setChats] = React.useState([]);
  const [noti, setNoti] = React.useState({ open: false, message: '' });

  const onMessagesSubmit = async (newMsg) => {
    setChats(prev => [...prev, { metadata: { ts: dayjs().format('h:mm a') }, message: { role: 'user', content: newMsg } }]);
    setShowLoading(true);
    const res = await axios.post(`${REACT_APP_CHAT_API_URL}/openai/chat/completion`, {
      messages: [...chats.map(x => x.message), { role: 'user', content: newMsg }],
    }).catch((err) => {
      console.error(err);
      setNoti({ open: true, message: err.response.data.error.message });
    });

    if (res) setChats(prev => [...prev, { metadata: { ts: dayjs().format('h:mm a') }, message: { ...res.data.message, content: res.data.message.content } }]); //.replace('\n\n', '')
    setShowLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  // console.log(chats);

  return (
    <>
      <LoadingProgress show={showLoading} />
      <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'calc(100vh - 170px)', maxHeight: 'calc(100vh - 170px)', overflow: 'scroll' }}>
        <Stack spacing={2} sx={{ width: '90%' }}>
          {chats.map((chat, index) => {
            const isAssistant = chat.message.role === 'assistant';
            console.log(chat.message.content);
            return (
              <Stack key={index} sx={{ width: '100%', alignItems: isAssistant ? 'start' : 'end' }}>
                <Stack direction='row' spacing={1} sx={{ alignItems: 'end' }}>
                  {/* {isAI && <Avatar sx={{ bgcolor: 'rgb(46,149,118)' }}>AI</Avatar>} */}
                  <Paper elevation={24} sx={{
                    p: 1,
                    borderRadius: 3,
                    textAlign: isAssistant ? 'left' : 'right'
                  }}>
                    {isAssistant
                      ? <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                children={String(children).replace(/\n$/, '')}
                                style={nord}
                                language={match[1] || 'bash'}
                                PreTag="div"
                                {...props}
                              />
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}

                      >
                        {chat.message.content}
                      </ReactMarkdown>
                      // ? <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{chat.message.content}</pre>
                      : <Typography>{chat.message.content}</Typography>
                    }
                  </Paper>
                  {/* {!isAI && <Avatar />} */}
                </Stack>
                <Typography sx={{ fontSize: '0.6rem', textAlign: 'end', color: 'grey' }}>{chat.metadata.ts}</Typography>
              </Stack>
            );
          })}
        </Stack>
        <div ref={bottomRef} />
        <Box sx={{ width: '90%', maxWidth: 768, position: 'absolute', bottom: 50 }}>
          <InputBox onMessagesSubmit={onMessagesSubmit} />
          <Typography variant='body2' sx={{ fontSize: '0.65rem', textAlign: 'right', color: 'grey' }}>Powered by gpt-3.5-turbo</Typography>
          <Typography variant='body2' sx={{ fontSize: '0.65rem', textAlign: 'right', color: 'grey' }}>Voice Recognition is processed on device</Typography>
        </Box>
        <Snackbar
          open={noti.open}
          autoHideDuration={6000}
          // onClose={(event, reason) => }
          message={noti.message}
        // action={action}
        />
      </Stack>
    </>
  );
}