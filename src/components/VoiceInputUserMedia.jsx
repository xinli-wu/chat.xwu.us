import MicIcon from '@mui/icons-material/Mic';
import { IconButton } from '@mui/material';
import React, { useRef } from 'react';

const hasGetUserMedia = () => {
  return !!(navigator.mediaDevices.getUserMedia);
};

const getConnectedDevices = async (type) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === type);
};

const openMic = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints).catch(e => console.error(e.message));;
};

export default function VoiceInput({ setQ }) {
  // const inputMediaRef = useRef();
  const audioRef = useRef(null);
  let stream = null;
  let mediaRecorder = null;

  const recordedData = [];

  const saveChunkToRecording = (e) => {
    recordedData.push(e.data);
  };

  const saveRecording = () => {
    const blob = new Blob(recordedData, {
      type: 'audio/mp4; codecs=opus'
    });
    const url = URL.createObjectURL(blob);

    if (audioRef.current) audioRef.current.setAttribute('src', url);
  };

  const startRecording = () => {
    if (mediaRecorder) mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder = null;
      stream = null;
    };
  };

  //send stream to server for processing, unfinished
  const userMediaBased = async (micId) => {
    if (!stream) stream = await openMic({ audio: { deviceId: micId, echoCancellation: true } });
    if (!mediaRecorder) {
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorder.ondataavailable = saveChunkToRecording;
      mediaRecorder.onstop = saveRecording;
    }
  };

  const initMic = async () => {
    if (hasGetUserMedia()) {
      const mics = await getConnectedDevices('audioinput');
      if (mics?.length) {
        await userMediaBased(mics[0]);
      }
    }
  };

  // initMic();

  const toggleRecording = async () => {
    await initMic();
    const { state } = mediaRecorder;

    if (mediaRecorder) {
      switch (state) {
        case 'inactive':
          startRecording();
          break;
        case 'recording':
          stopRecording();
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <IconButton aria-label="voice" size='small' onMouseUp={toggleRecording}>
        <MicIcon />
      </IconButton>
      {/* <audio src="" controls ref={audioRef}>
        Your browser does not support the audio element.
      </audio> */}
    </>
  );
};