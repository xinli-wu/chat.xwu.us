import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { ChatsArea } from '../components/ChatsArea';

import { isMobile } from 'react-device-detect';
import CompletionHistory from '../components/CompletionHistory';
import Conversation from '../components/Conversation';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const params = useParams();
  const navigate = useNavigate();

  const [selectedConversation, setSelectedConversation] = React.useState(params.id || null);
  const [completionHistory, setCompletionHistory] = React.useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios(`${process.env.REACT_APP_CHAT_API_URL}/my/conversation-hitory`);
      if (data.status === 'success') setCompletionHistory(data.data);
    })();
  }, []);

  useEffect(() => {
    if (selectedConversation) navigate(`/chat/${selectedConversation}`);
  }, [selectedConversation, navigate]);

  return (
    <ChatsArea>
      <Grid className='no-scrollbar' container spacing={2} sx={{
        pt: 6,
        pl: 2,
        pr: 2,
        flexGrow: 1,
        height: 'calc(100vh - 120px)',
      }}>
        {!isMobile && <CompletionHistory
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          completionHistory={completionHistory}
        />}
        <Conversation
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          setCompletionHistory={setCompletionHistory}
        />
      </Grid>
    </ChatsArea>
  );
}
