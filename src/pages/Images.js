import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useParams } from 'react-router-dom';
import ChatHistory from '../components/ChatHistory';
import { ChatsArea } from '../components/ChatsArea';
import { useImages } from '../hooks/useAPI';
import Image from './Image';
import { useNavigate } from 'react-router-dom';

export default function Images() {
  const params = useParams();
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = React.useState(params.id || undefined);
  const [chats, setChats] = React.useState([]);

  const { data, error, isLoading, mutate, isValidating } = useImages();

  useEffect(() => {
    if (error || isLoading || isValidating) return;
    if (data.data?.status === 'success') {
      setChats(data.data.data);
    }
  }, [data, error, isLoading, isValidating]);

  const onChatSelect = (id) => {
    navigate(`/image/${id}`);
    setSelectedChat(id);
  };


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
            setSelectedChat={onChatSelect}
            chats={chats}
          />
        )}
        <Image
          selectedChat={selectedChat}
          onChatSave={mutate}
        />
      </Grid>
    </ChatsArea>
  );
}
