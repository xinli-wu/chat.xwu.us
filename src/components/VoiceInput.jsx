import MicIcon from '@mui/icons-material/Mic';
import { Collapse, IconButton, Box } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import Siriwave from 'react-siriwave';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { isMobile } from 'react-device-detect';

const hasGetUserMedia = () => !!navigator.mediaDevices.getUserMedia;

export default function VoiceInputIconBtn({ setQ, setInterimTranscript, voiceInput, setVoiceInput, disabled = false }) {
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  // const recognition = new SpeechRecognition();
  const recognition = useMemo(() => new SpeechRecognition() || null, [SpeechRecognition]);

  if (!SpeechRecognition) console.log('Speech Recognition Not Available');

  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    // console.log('onstart');
    setVoiceInput(true);
  };

  // recognition.onspeechstart = (e) => {
  //   console.log('onspeechstart');
  //   console.log(e);

  // };

  // recognition.onspeechend = () => {
  //   console.log('onspeechend');
  // };

  // recognition.onaudiostart = () => {
  //   console.log('onaudiostart');
  //   console.log(recognition);

  //   const audioCtx = new AudioContext();
  //   const source = audioCtx.createMediaStreamSource(recognition.stream);
  //   const analyser = audioCtx.createAnalyser();
  //   source.connect(analyser);

  //   const bufferLength = analyser.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);

  //   const getVolume = () => {
  //     requestAnimationFrame(getVolume);
  //     analyser.getByteFrequencyData(dataArray);
  //     const volume = dataArray.reduce((acc, val) => acc + val) / bufferLength;
  //     console.log('Volume: ', volume);
  //   };

  //   getVolume();

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
  // recognition.onsoundstart = (e) => {
  //   console.log('onsoundstart');
  //   console.log(e);

  // };
  // recognition.onsoundend = () => {
  //   console.log('onsoundend');
  // };

  recognition.onresult = (e) => {
    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        finalTranscript += e.results[i][0].transcript;
        recognition.stop();
        setQ(finalTranscript);
        return;
      }
      interimTranscript += e.results[i][0].transcript;
      setInterimTranscript(`${interimTranscript}...`);
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
    <>
      <IconButton disabled={disabled} aria-label="voice" size="small" onClick={toggleRecording} sx={{ ml: 0.5, mr: 0.5 }}>
        {voiceInput ? <RecordVoiceOverIcon htmlColor="rgb(46,149,118)" /> : <MicIcon />}
      </IconButton>
      <Collapse orientation="horizontal" in={voiceInput}>
        <Box
          sx={{
            width: 70,
            height: 30,
            ...(isMobile && { paddingRight: 12 }),
            visibility: voiceInput ? 'unset' : 'hidden',
          }}
        >
          <Box sx={{ position: 'relative', left: -10, top: isMobile ? 2 : 5 }}>
            {voiceInput && (
              <Siriwave
                width={70}
                height={30}
                // eslint-disable-next-line
                style={'ios9'}
                amplitude={4}
              />
            )}
          </Box>
        </Box>
      </Collapse>
    </>
  );
}
