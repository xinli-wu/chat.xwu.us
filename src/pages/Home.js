import { Box, Paper, Stack, Typography } from '@mui/material';
import InputBox from 'components/InputBox';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyCode } from '../components/CopyCode';
import { Noti } from '../components/Noti';
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
        "ts": "12:00 am"
      },
      "message": {
        "role": "user",
        "content": "quick sort in java"
      }
    },
    {
      "metadata": {
        "id": "chatcmpl-6sAAFmpIQxmNEQwkADg1KGcM9nluW",
        "ts": "12:00 am"
      },
      "message": {
        "role": "assistant",
        "content": "\n\nHere is an implementation of Quick Sort in Java:\n\n```\npublic class QuickSort {\n    \n    public static void main(String[] args) {\n        int[] arr = {5, 2, 9, 3, 7, 6, 1, 8, 4};\n        quickSort(arr, 0, arr.length - 1);\n        System.out.println(Arrays.toString(arr));\n    }\n    \n    public static void quickSort(int[] arr, int left, int right) {\n        if (left < right) {\n            int pivotIndex = partition(arr, left, right);\n            quickSort(arr, left, pivotIndex - 1);\n            quickSort(arr, pivotIndex + 1, right);\n        }\n    }\n    \n    public static int partition(int[] arr, int left, int right) {\n        int pivot = arr[right];\n        int i = left - 1;\n        for (int j = left; j < right; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[right];\n        arr[right] = temp;\n        return i + 1;\n    }\n    \n}\n```\n\nIn this implementation, the `quickSort` method takes the array to be sorted, the left and right indices of the subarray to be sorted. It first checks if the subarray has more than one element (i.e. `left < right`). If it does, it selects a pivot element (in this case, the rightmost element of the subarray) and partitions the subarray into two subarrays: one containing all elements less than the pivot and another containing all elements greater than or equal to the pivot. It then recursively sorts these two subarrays using the same `quickSort` method.\n\nThe `partition` method takes the same subarray indices and the array to be sorted. It selects the pivot element (in this case, the rightmost element of the subarray) and iterates through the subarray from the left index to the second-to-last index. For each element that is less than the pivot, it swaps it with the element at the current index `i` (which starts at `left - 1`) and increments `i`. This effectively moves all elements less than the pivot to the left of `i` and all elements greater than or equal to the pivot to the right of `i`. Finally, it swaps the pivot element with the element at index `i + 1`, which places the pivot in its final sorted position. It then returns the index of the pivot element."
      }
    }
  ]);
  const [noti, setNoti] = React.useState({ text: null, severity: undefined });
  const [lastMsgHeight, setLastMsgHeight] = React.useState();

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
      let msgId = null;
      const ts = dayjs().format('h:mm a');
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
            if (!msgId) msgId = msgObj.id;
            const { content } = msgObj.choices[0].delta;
            finalMsg += content;
            setChats(prev => [
              ...prev.filter(x => x.metadata.id !== msgObj.id),
              {
                metadata: { id: msgObj.id, ts },
                message: {
                  role: 'assistant',
                  content: finalMsg + ' ▉'
                }
              }]
            );

            if (lastMsgRef.current) {
              const boundingRect = lastMsgRef.current.getBoundingClientRect();
              const { height } = boundingRect;
              setLastMsgHeight(height);
            }
          } else {
            if (finalMsg) setChats(prev => [
              ...prev.filter(x => x.metadata.id !== msgId),
              {
                metadata: { id: msgId, ts },
                message: {
                  role: 'assistant',
                  content: finalMsg
                }
              }]
            );
          }
        });
        read();
      });
      read();
    } catch (error) {
      console.log(error.message);
      setNoti({ text: `API error: ${error.message}`, severity: 'error' });
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
        justifyContent: 'space-between',
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
          // maxHeight: `500px`,
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
                                      <CopyCode code={String(children)} setNoti={setNoti} />
                                      <SyntaxHighlighter
                                        showLineNumbers
                                        wrapLines
                                        wrapLongLines
                                        // @ts-ignore
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

      <Noti noti={noti} setNoti={setNoti} />
    </>
  );
}

