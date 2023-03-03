import MicIcon from '@mui/icons-material/Mic';
import { IconButton } from '@mui/material';
import React, { useEffect, useMemo } from 'react';

const hasGetUserMedia = () => {
  return !!(navigator.mediaDevices.getUserMedia);
};



export default function VoiceInputIconBtn({ setQ, setInterimTranscript, voiceInput, setVoiceInput }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = useMemo(() => new SpeechRecognition() || null, [SpeechRecognition]);

  if (!SpeechRecognition) console.log("Speech Recognition Not Available");

  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    // console.log('onstart');
    setVoiceInput(true);
  };

  // recognition.onspeechstart = () => {
  //   console.log('onspeechstart');
  // };

  // recognition.onspeechend = () => {
  //   console.log('onspeechend');
  // };


  // recognition.onaudiostart = () => {
  //   console.log('onaudiostart');
  // };

  // recognition.onaudioend = () => {
  //   console.log('onaudioend');
  // };

  recognition.onend = () => {
    // console.log('onend');
    setVoiceInput(false);
    setInterimTranscript('');
    // setFocus();
  };
  // recognition.onsoundstart = () => {
  //   console.log('onsoundstart');
  // };
  // recognition.onsoundend = () => {
  //   console.log('onsoundend');
  // };

  recognition.onresult = (e) => {
    let final_transcript = '', interim_transcript = '';
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        final_transcript += e.results[i][0].transcript;
        recognition.stop();
        setQ(final_transcript);
        return;
      } else {
        interim_transcript += e.results[i][0].transcript;
        setInterimTranscript(interim_transcript + '...');
      }
    }
  };

  const toggleRecording = () => {
    if (voiceInput) {
      setVoiceInput(false);
    } else {
      setVoiceInput(true);
      if (hasGetUserMedia() && !voiceInput) {
        recognition.start();
      }
    }
  };



  useEffect(() => {
    if (!voiceInput) recognition.stop();
  }, [voiceInput, recognition]);

  return (
    <IconButton aria-label="voice" size='small' onClick={toggleRecording}>
      <MicIcon />
    </IconButton>
  );
};