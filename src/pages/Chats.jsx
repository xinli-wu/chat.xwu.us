import { Box, Drawer, Grid, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate, useParams } from 'react-router-dom';
import Chat from '../components/Chat';
import ChatHistory from '../components/ChatHistory';
import ChatsArea from '../components/ChatsArea';
import { useChats } from '../hooks/useAPI';
import Footer from '../components/Footer';
import LeftPanel from '../components/LeftPanel';

export default function Chats() {
  const params = useParams();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = React.useState(params.id);
  const [chats, setChats] = React.useState([]);
  const [savedPromptOpen, setSavedPromptOpen] = React.useState(false);
  const { data, error, isLoading, mutate, isValidating } = useChats();

  useEffect(() => {
    setSelectedChat(selectedChat);
  }, [params.id, selectedChat]);

  useEffect(() => {
    if (error || isLoading || isValidating) return;
    if (data.data?.status === 'success') {
      setChats(data.data.data);
    }
  }, [data, error, isLoading, isValidating]);

  const onChatSelect = (id) => {
    setSavedPromptOpen(false);
    navigate(`/chat/${id}`);
    setSelectedChat(id);
  };

  return (
    <ChatsArea>
      {isMobile ? (
        <Box className="no-scrollbar" sx={{ height: '100%', width: '90%' }}>
          <Drawer
            sx={{ backdropFilter: 'blur(.15rem)' }}
            anchor="left"
            open={savedPromptOpen}
            onClose={() => setSavedPromptOpen((prev) => !prev)}
            PaperProps={{ sx: { backgroundColor: 'unset' } }}
          >
            <LeftPanel isLoading={isValidating} setSelectedChat={onChatSelect} chats={chats} />
          </Drawer>
          <Chat selectedChat={selectedChat} onChatSave={mutate} setSavedPromptOpen={setSavedPromptOpen} />
        </Box>
      ) : (
        <Grid className="no-scrollbar" container spacing={2} sx={{ height: '100%', width: '90%', maxWidth: 1680 }}>
          <LeftPanel isLoading={isValidating} setSelectedChat={onChatSelect} chats={chats} />
          <Chat selectedChat={selectedChat} onChatSave={mutate} setSavedPromptOpen={setSavedPromptOpen} />
        </Grid>
      )}
    </ChatsArea>
  );
}
