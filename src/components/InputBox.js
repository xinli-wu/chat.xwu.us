import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Collapse, Divider, List, ListItem, ListItemText, Paper, Stack, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import VoiceInput from './VoiceInput';

export default function InputBox({ onMessagesSubmit }) {
  const theme = useTheme();
  const [q, setQ] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [suggestions, setSuggestions] = useState(JSON.parse(localStorage.qHistory || '[]'));
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [voiceInput, setVoiceInput] = useState(false);
  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.children[0].focus();
    }
  });

  useEffect(() => {
    localStorage.qHistory = JSON.stringify(suggestions);
  }, [suggestions]);

  const updateSuggestions = (q) => {
    setSuggestions(prev => ([...prev.filter(x => x.q !== q), { q, t: dayjs().unix() }].sort((a, b) => b.t - a.t).slice(0, 5)));
    onMessagesSubmit(q);
    setQ('');
  };

  const onQSubmit = (e) => {
    e.preventDefault();
    updateSuggestions(q);
    setSuggestOpen(false);
  };

  const onInputChange = (e) => {
    e.preventDefault();
    setQ(e.target.value);
  };

  const onSuggestionClick = (e, q) => {
    e.preventDefault();
    if (e.type === 'mousedown') {
      setQ(q);
      updateSuggestions(q);
    }
    setSuggestOpen(false);
  };

  const onSearchBoxBlur = (e) => {
    e.preventDefault();
    setSuggestOpen(false);
  };

  const onSuggestionDeleteClick = (e, q) => {
    e.preventDefault();
    e.stopPropagation();
    setSuggestions(prev => ([...prev.filter(x => x.q !== q)]));
  };

  return (
    <Paper elevation={24} component='form' onSubmit={onQSubmit}>
      {suggestions.length > 0 &&
        <Collapse in={suggestOpen} timeout={150}>
          <Stack sx={{ m: 0.25, textAlign: 'start' }}>
            <List>
              <TransitionGroup>
                {suggestions?.map(({ q }) => (
                  <Collapse key={q}>
                    <Stack direction={'row'} >
                      <ListItem button dense onMouseDown={(e) => onSuggestionClick(e, q)}>
                        <ListItemText>{q}</ListItemText>
                      </ListItem>
                      <IconButton aria-label="delete" size='small' onMouseDown={(e) => onSuggestionDeleteClick(e, q)}>
                        <ClearIcon />
                      </IconButton>
                    </Stack>
                  </Collapse>
                ))}
              </TransitionGroup>
            </List>
            <Divider />
          </Stack>
        </Collapse>
      }
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" disabled={q.length === 0}>
          <SearchIcon />
        </IconButton>
        <InputBase
          ref={inputElement}
          sx={{ ml: 1 }}
          disabled={voiceInput}
          fullWidth
          placeholder="Start typing..."
          inputProps={{ 'aria-label': 'start typing' }}
          value={voiceInput ? interimTranscript : q}
          onChange={onInputChange}
          onBlur={onSearchBoxBlur}
          onClick={() => !voiceInput ? setSuggestOpen(true) : null}
          componentsProps={{
            input: {
              style: { fontStyle: voiceInput ? 'italic' : 'normal', color: voiceInput ? theme.palette.grey[400] : theme.palette.text.primary },
            }
          }}
        />
        <VoiceInput setQ={setQ} setInterimTranscript={setInterimTranscript} voiceInput={voiceInput} setVoiceInput={setVoiceInput} />
      </Box>

    </Paper >

  );
}
