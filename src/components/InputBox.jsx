import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import { Box, Collapse, Divider, List, ListItemButton, ListItemText, Paper, Stack, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import LoadingProgress from './LoadingProgress';
import VoiceInput from './VoiceInput';
import { useTranslation } from 'react-i18next';

export default function InputBox({ onMessagesSubmit, isLoading, isReading = false, disabled = false }) {
  const theme = useTheme();
  const [q, setQ] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [suggestions, setSuggestions] = useState(JSON.parse(localStorage.qHistory || '[]'));
  const [suggestOpen, setSuggestOpen] = React.useState(false);
  const [voiceInput, setVoiceInput] = useState(false);
  const inputElement = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.qHistory = JSON.stringify(suggestions);
  }, [suggestions]);

  const updateSuggestions = (q) => {
    // close virtual keyboard
    inputElement?.current?.children[0]?.blur();
    setSuggestions((prev) =>
      [...prev.filter((x) => x.q !== q), { q, t: dayjs().unix() }].sort((a, b) => b.t - a.t).slice(0, 7),
    );
    onMessagesSubmit(q);
    setQ('');
  };

  const onQSubmit = (e) => {
    e.preventDefault();
    updateSuggestions(q);
    setSuggestOpen(false);
  };

  const onInputChange = (e) => {
    e?.preventDefault();
    setQ(e.target.value);
    if (e.target.value) setSuggestOpen(true);
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
    e?.preventDefault();
    setSuggestOpen(false);
  };

  const onSuggestionDeleteClick = (e, q) => {
    e.preventDefault();
    e.stopPropagation();
    setSuggestions((prev) => [...prev.filter((x) => x.q !== q)]);
  };

  const BoldedText = ({ text, shouldBeBold }) => {
    const textArray = text.split(new RegExp(shouldBeBold, 'i'));

    return (
      <span>
        {textArray.map((item, idx) => (
          <span key={idx}>
            {item}
            {idx !== textArray.length - 1 && (
              <b>
                <span
                  style={{
                    backgroundColor: theme.palette.mode === 'light' ? 'rgb(150,200,100)' : 'rgb(46,149,118)',
                  }}
                >
                  {shouldBeBold}
                </span>
              </b>
            )}
          </span>
        ))}
      </span>
    );
  };

  const filteredSuggestions = suggestions.filter((x) => x.q.toLocaleLowerCase().includes(q.toLocaleLowerCase()));

  return (
    <Paper elevation={suggestOpen ? 24 : 6} component="form" onSubmit={onQSubmit}>
      {!!suggestions.length && !disabled && (
        <Collapse in={suggestOpen} timeout={150}>
          <Stack
            sx={{
              m: filteredSuggestions.length ? 0.25 : 0,
              textAlign: 'start',
            }}
          >
            <List sx={{ ...(filteredSuggestions.length === 0 && { p: 0 }) }}>
              <TransitionGroup>
                {filteredSuggestions.map((x) => {
                  return (
                    <Collapse key={x.q}>
                      <Stack direction={'row'}>
                        <ListItemButton dense onMouseDown={(e) => onSuggestionClick(e, x.q)}>
                          <ListItemText>
                            <BoldedText text={x.q} shouldBeBold={q} />
                          </ListItemText>
                        </ListItemButton>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onMouseDown={(e) => onSuggestionDeleteClick(e, x.q)}
                        >
                          <ClearIcon />
                        </IconButton>
                      </Stack>
                    </Collapse>
                  );
                })}
              </TransitionGroup>
            </List>
            <Divider
              sx={{
                ...(filteredSuggestions.length === 0 && { display: 'none' }),
              }}
            />
          </Stack>
        </Collapse>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 44,
        }}
      >
        <VoiceInput
          disabled={disabled}
          setQ={setQ}
          setInterimTranscript={setInterimTranscript}
          voiceInput={voiceInput}
          setVoiceInput={setVoiceInput}
        />
        <InputBase
          ref={inputElement}
          disabled={voiceInput || isReading || isLoading || disabled}
          fullWidth
          multiline={false}
          // maxRows={10}
          placeholder={t(`Start ${voiceInput ? 'speaking' : 'typing'}`) + '...'}
          inputProps={{ 'aria-label': 'start typing' }}
          value={voiceInput ? interimTranscript : q}
          onChange={onInputChange}
          onBlur={onSearchBoxBlur}
          onClick={() => (!voiceInput && !isReading && !isLoading ? setSuggestOpen(true) : null)}
          componentsProps={{
            input: {
              style: {
                fontStyle: voiceInput ? 'italic' : 'normal',
                color: voiceInput ? theme.palette.grey[400] : theme.palette.text.primary,
              },
            },
          }}
        />
        <IconButton
          type="submit"
          size="small"
          sx={{ ml: 0.5, mr: 0.5 }}
          aria-label="send"
          disabled={q.trim().length === 0}
        >
          {isLoading ? <LoadingProgress variant="circular" show={isLoading} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
}
