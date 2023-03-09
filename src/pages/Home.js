import { Alert, Box, Paper, Snackbar, Stack, Typography } from '@mui/material';
import InputBox from 'components/InputBox';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TopBar from '../components/TopBar';
import './Home.css';
// import { Avatar } from '@mui/material';

export default function Home() {
  document.title = 'chat';
  const { REACT_APP_CHAT_API_URL } = process.env;
  const bottomRef = useRef(null);
  const lastMsgRef = useRef(null);
  const footerRef = useRef(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isReading, setIsReading] = React.useState(false);
  const [chats, setChats] = React.useState([
    {
      "metadata": {
        "id": "user0",
        "ts": "5:46 am"
      },
      "message": {
        "role": "user",
        "content": "quick sort in c"
      }
    },
    {
      "metadata": {
        "id": "chatcmpl-6rt5iOHfNQ1nE1cIdxx3rWMc4aIx2",
        "ts": "5:46 am"
      },
      "message": {
        "role": "assistant",
        "content": "\n\nHere is an implementation of quick sort in C:\n\n```\n#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint partition(int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            swap(&arr[i], &arr[j]);\n        }\n    }\n    swap(&arr[i + 1], &arr[high]);\n    return i + 1;\n}\n\nvoid quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\n\nvoid printArray(int arr[], int size) {\n    for (int i = 0; i < size; i++) {\n        printf(\"%d \", arr[i]);\n    }\n    printf(\"\\n\");\n}\n\nint main() {\n    int arr[] = {10, 7, 8, 9, 1, 5};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    quickSort(arr, 0, n - 1);\n    printf(\"Sorted array: \");\n    printArray(arr, n);\n    return 0;\n}\n```\n\nThe `swap` function is a helper function that swaps two integers. The `partition` function takes an array, `arr`, and two indices, `low` and `high`, and partitions the array around a pivot element such that all elements smaller than the pivot are on the left and all elements larger than the pivot are on the right. The `quickSort` function recursively sorts the array by partitioning it and sorting the left and right partitions. The `printArray` function is a helper function that prints an array. Finally, the `main` function initializes an array, sorts it using quick sort, and prints the sorted array."
      }
    }
  ]);
  const [noti, setNoti] = React.useState(null);
  const [lastMsgHeight, setLastMsgHeight] = React.useState();


  // useEffect(() => {
  //   if (footerRef.current) {
  //     const boundingRect = footerRef.current.getBoundingClientRect();
  //     const { height } = boundingRect;
  //     console.log(height);
  //     setFooterHeight(prev => prev === height ? prev : height);
  //   }
  // }, [suggestOpen, footerRef.current]);


  const onMessagesSubmit = async (newMsg) => {
    const newChat = { metadata: { id: 'user' + chats.length, ts: dayjs().format('h:mm a') }, message: { role: 'user', content: newMsg } };
    setChats(prev => [...prev, newChat]);
    setIsLoading(true);

    try {
      const raw = await fetch(`${REACT_APP_CHAT_API_URL}/openai/chat/completion`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chats.map(x => x.message), newChat.message] })
      });

      if (!raw.ok) {
        console.log(await raw.text());
        throw new Error(await raw.text() || '');
      };
      const reader = raw.body.getReader();

      setIsReading(true);
      let finalMsg = '';
      const read = () => reader.read().then(({ done, value }) => {
        if (done) {
          setIsReading(false);
          return;
        };
        const decoder = new TextDecoder();
        const lines = decoder.decode(value).toString().split('\n').filter(line => line.trim() !== '');
        lines.forEach(l => {
          const msg = l.replace(/^data: /, '');
          if (msg !== '[DONE]' && JSON.parse(msg).choices[0].delta.content) {
            const msgObj = JSON.parse(msg);

            const { content } = msgObj.choices[0].delta;
            finalMsg += content;
            setChats(prev => [
              ...prev.filter(x => x.metadata.id !== msgObj.id),
              {
                metadata: { id: msgObj.id, ts: dayjs().format('h:mm a') },
                message: {
                  role: 'assistant',
                  content: finalMsg
                }
              }]
            );

            if (lastMsgRef.current) {
              const boundingRect = lastMsgRef.current.getBoundingClientRect();
              const { height } = boundingRect;
              setLastMsgHeight(height);
            }
          }
        });
        read();
      });
      read();
    } catch (error) {
      console.log(error.message);
      setNoti(`API error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }

  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats.length, lastMsgHeight]);

  return (
    <>
      <Box sx={{
        zIndex: -10,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexFlow: 'column nowrap',
        height: '100vh'
      }}>
        <TopBar />
        <Stack className='no-scrollbar' sx={{
          pt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: `500px`,
          overflowY: 'scroll',
          flexGrow: 1,
        }}>
          <Stack spacing={2} sx={{ width: '90%', maxWidth: 1280, }}>
            {chats.map((chat, index) => {
              const isAssistant = chat.message.role === 'assistant';
              return (
                <Stack key={index} sx={{ width: '100%', alignItems: isAssistant ? 'start' : 'end' }}>
                  <Stack direction='row' spacing={1} sx={{ alignItems: 'end' }}>
                    {/* {isAI && <Avatar sx={{ bgcolor: 'rgb(46,149,118)' }}>AI</Avatar>} */}
                    <Paper elevation={12} sx={{
                      p: 1,
                      borderRadius: 3,
                      textAlign: isAssistant ? 'left' : 'right',
                      maxWidth: 1200,
                      overflowX: 'scroll'
                      // backgroundColor: 'rgb(52,52,52)'
                      // ...(isAssistant && { backgroundColor: 'rgb(46,149,118)' })
                    }}>
                      {isAssistant
                        ? <div ref={index === chats.length - 1 ? lastMsgRef : undefined}>
                          <ReactMarkdown
                            components={(
                              {
                                code({ node, inline, className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || '') || ['language-javascript', 'javascript'];
                                  return !inline && match ? (
                                    <Stack>
                                      <SyntaxHighlighter
                                        showLineNumbers
                                        wrapLines
                                        wrapLongLines
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
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
                          </ReactMarkdown></div>
                        // ? <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{chat.message.content}</pre>
                        : <Typography>{chat.message.content}</Typography>
                      }
                    </Paper>
                    {/* {!isAI && <Avatar />} */}
                  </Stack>
                  <Typography sx={{ fontSize: '0.6rem', textAlign: 'end', color: 'grey' }}>{chat.metadata.ts}</Typography>
                  {/* {index === chats.length - 1 && <Box sx={{ p: 2 }} ref={bottomRef} />} */}
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
      </Box>

      <Snackbar
        open={noti !== null}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => setNoti(undefined)}
      // message={noti}
      >
        <Alert severity='error' sx={{ width: '100%' }}>{noti}</Alert>
      </Snackbar>
    </>
  );
}