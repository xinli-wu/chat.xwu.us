import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Collapse, Divider, List, ListItem, ListItemText, Paper, Stack, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import LoadingProgress from './LoadingProgress';
import VoiceInput from './VoiceInput';

export default function InputBox({ onMessagesSubmit, showLoading }) {
  const theme = useTheme();
  const [q, setQ] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [suggestions, setSuggestions] = useState(JSON.parse(localStorage.qHistory || '[]'));
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [voiceInput, setVoiceInput] = useState(false);
  const inputElement = useRef(null);
  // let keyPressed = {};

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.children[0].focus();
    }
  });

  useEffect(() => {
    localStorage.qHistory = JSON.stringify(suggestions);
  }, [suggestions]);

  const updateSuggestions = (q) => {
    setSuggestions(prev => ([...prev.filter(x => x.q !== q), { q, t: dayjs().unix() }].sort((a, b) => b.t - a.t).slice(0, 7)));
    onMessagesSubmit(q);
    setQ('');
  };

  const onQSubmit = (e) => {
    e.preventDefault();
    // keyPressed = {};
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

  const BoldedText = ({ text, shouldBeBold }) => {
    const textArray = text.split(shouldBeBold);
    return (
      <span>
        {textArray.map((item, index) => (
          <span key={index}>
            {item}
            {index !== textArray.length - 1 && (
              <b><span
                style={{
                  backgroundColor: theme.palette.mode === 'light' ? 'rgb(150,200,100)' : 'rgb(46,149,118)',
                  // ...(theme.palette.mode === 'light' && { color: 'white' }),
                }}>
                {shouldBeBold}
              </span></b>
            )}
          </span>
        ))}
      </span>
    );
  };



  return (
    <Paper elevation={suggestOpen ? 24 : 6} component='form' onSubmit={onQSubmit}>
      {suggestions.length > 0 &&
        <Collapse in={suggestOpen} timeout={150}>
          <Stack sx={{ m: 0.25, textAlign: 'start' }}>
            <List>
              <TransitionGroup>
                {suggestions?.filter(x => x.q.includes(q)).map(x => {
                  return (
                    <Collapse key={x.q} >
                      <Stack direction={'row'} >
                        <ListItem button dense onMouseDown={(e) => onSuggestionClick(e, x.q)}>
                          <ListItemText><BoldedText text={x.q} shouldBeBold={q} /></ListItemText>
                        </ListItem>
                        <IconButton aria-label="delete" size='small' onMouseDown={(e) => onSuggestionDeleteClick(e, x.q)}>
                          <ClearIcon />
                        </IconButton>
                      </Stack>
                    </Collapse>
                  );
                })}
              </TransitionGroup>
            </List>
            <Divider />
          </Stack>
        </Collapse>
      }
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <VoiceInput setQ={setQ} setInterimTranscript={setInterimTranscript} voiceInput={voiceInput} setVoiceInput={setVoiceInput} />
        {/* <Box sx={{ width: 80, height: 30, }}>
          <Box sx={{ position: 'absolute', left: 30, top: 10 }}>
            <Siriwave
              width={80}
              height={30}
              style={'ios9'}
              amplitude={5}
            />
          </Box>
        </Box> */}
        <InputBase
          ref={inputElement}
          // sx={{ ml: 1 }}
          disabled={voiceInput}
          fullWidth
          multiline={false}
          // maxRows={10}
          placeholder={`Start ${voiceInput ? 'speaking' : 'typing'}...`}
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
        // onKeyDown={(e) => {
        //   keyPressed[e.key] = true;
        //   console.log(q.length, keyPressed);
        //   if (keyPressed.Enter && !keyPressed.Control && !keyPressed.Alt && q.trim().length !== 0) onQSubmit(e);
        // }}
        // onKeyUp={() => keyPressed = {}}
        />
        <Box sx={{ alignSelf: 'flex-end', bottom: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* <Box sx={{ display: 'flex', position: 'absolute' }}>
            <LoadingProgress variant='circular' show={showLoading} />
          </Box> */}
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" disabled={q.trim().length === 0}>
            {showLoading ?
              <LoadingProgress variant='circular' show={showLoading} />
              : <SearchIcon />}
          </IconButton>
        </Box>
      </Box>
    </Paper >
  );
}
