import { Box, Drawer, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate, useParams } from 'react-router-dom';
import ChatHistory from '../components/ChatHistory';
import { ChatsArea } from '../components/ChatsArea';
import { useImages } from '../hooks/useAPI';
import Image from './Image';

export default function Images() {
  const params = useParams();
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = React.useState(params.id || undefined);
  const [chats, setChats] = React.useState([]);
  const [savedPromptOpen, setSavedPromptOpen] = React.useState(false);
  const { data, error, isLoading, mutate, isValidating } = useImages();

  useEffect(() => {
    if (error || isLoading || isValidating) return;
    if (data.data?.status === 'success') {
      setChats(data.data.data);
    }
  }, [data, error, isLoading, isValidating]);

  const onChatSelect = (id) => {
    setSavedPromptOpen(false);
    navigate(`/image/${id}`);
    setSelectedChat(id);
  };

  return (
    <>
      <ChatsArea>
        {isMobile ? (
          <Box
            className="no-scrollbar"
            sx={{
              height: '100%',
              width: '90%',
            }}
          >
            <Drawer
              sx={{ backdropFilter: `blur(.15rem)` }}
              anchor={'left'}
              open={savedPromptOpen}
              onClose={() => setSavedPromptOpen((prev) => !prev)}
              PaperProps={{ sx: { backgroundColor: 'unset' } }}
            >
              <ChatHistory isLoading={isValidating} setSelectedChat={onChatSelect} chats={chats} />
            </Drawer>
            <Image selectedChat={selectedChat} onChatSave={mutate} setSavedPromptOpen={setSavedPromptOpen} />
          </Box>
        ) : (
          <Grid
            className="no-scrollbar"
            container
            spacing={2}
            sx={{
              height: '100%',
              width: '90%',
              maxWidth: 1680,
            }}
          >
            <ChatHistory isLoading={isValidating} setSelectedChat={onChatSelect} chats={chats} />
            <Image selectedChat={selectedChat} onChatSave={mutate} setSavedPromptOpen={setSavedPromptOpen} />
          </Grid>
        )}
      </ChatsArea>
    </>
  );
}
