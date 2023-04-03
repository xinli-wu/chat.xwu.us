import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import ChatHistory from '../components/ChatHistory';
import { ChatsArea } from '../components/ChatsArea';
import { useChats } from '../hooks/useAPI';

export default function Chats() {
  const params = useParams();

  const [selectedChat, setSelectedChat] = React.useState(params.id || undefined);
  const [chats, setChats] = React.useState([]);

  const { data, error, isLoading, mutate, isValidating } = useChats();

  useEffect(() => {
    if (error || isLoading || isValidating) return;
    if (data.data?.status === 'success') {
      setChats(data.data.data);
    }
  }, [data, error, isLoading, isValidating]);

  useEffect(() => {

    setSelectedChat(params.id);

  }, [params.id]);

  return (
    <ChatsArea>
      <Grid className='no-scrollbar' container spacing={2} sx={{
        pt: 6,
        pl: 2,
        pr: 2,
        flexGrow: 1,
        height: 'calc(100vh - 120px)',
      }}>
        {!isMobile && (
          <ChatHistory
            isLoading={isValidating}
            setSelectedChat={setSelectedChat}
            chats={chats}
          />
        )}
        <Chat
          selectedChat={selectedChat}
          onChatSave={mutate}
        />
      </Grid>
    </ChatsArea>
  );
}
