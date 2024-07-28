import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, List, ListItem, ListItemButton, ListItemText, Paper } from '@mui/material';
import React from 'react';
import { isMobile } from 'react-device-detect';
import LoadingProgress from './LoadingProgress';
import { deleteChatById } from '../hooks/useAPI';

function ChatItem({ chat, setSelectedChat }) {
  const deleteChat = async (e) => {
    e.stopPropagation();
    const res = await deleteChatById(chat._id);
    console.log(res);
  };

  return (
    <ListItem disablePadding sx={{ '&:hover > .MuiListItemButton-root > .MuiButtonBase-root': { display: 'unset' } }}>
      <ListItemButton role={undefined} onClick={() => setSelectedChat(chat._id)} dense>
        <ListItemText
          primary={chat.data.title}
          primaryTypographyProps={{
            sx: { width: '100%', overflowX: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' },
          }}
        />
        <IconButton
          size="small"
          edge="end"
          aria-label="delete"
          sx={{ display: 'none', padding: 0 }}
          onClick={deleteChat}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
}

export default function ChatHistory({ isLoading, setSelectedChat, chats }) {
  return (
    <Paper
      className="no-scrollbar"
      sx={{
        flexGrow: 1,
        borderRadius: isMobile ? 0 : 3,
        overflow: 'scroll',
        ...(isMobile && { minWidth: '60vw', opacity: 0.6 }),
      }}
    >
      <LoadingProgress show={isLoading} />
      <List dense>
        {chats.map((x, i) => (
          <ChatItem key={i} chat={x} setSelectedChat={setSelectedChat} />
          // <ListItem
          //   key={i}
          //   secondaryAction={
          //     showDelete.show &&
          //     showDelete.id === i && (
          //       <IconButton edge="end" aria-label="comments">
          //         <DeleteIcon />
          //       </IconButton>
          //     )
          //   }
          //   disablePadding
          // >
          //   <ListItemButton
          //     role={undefined}
          //     onClick={() => setSelectedChat(x._id)}
          //     dense
          //     onMouseEnter={() => setShowDelete({ show: true, id: i })}
          //     onMouseOut={() => setShowDelete({ show: false, id: null })}
          //   >
          //     <ListItemText
          //       primary={x.data.title}
          //       primaryTypographyProps={{
          //         sx: { width: '100%', overflowX: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' },
          //       }}
          //     />
          //   </ListItemButton>
          // </ListItem>
        ))}
      </List>
    </Paper>
  );
}
