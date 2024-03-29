const getMicVolume = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);

  javascriptNode.onaudioprocess = () => {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;

    const { length } = array;
    array.forEach((value) => {
      values += value;
    });

    const average = values / length;
    return average;
  };
};

export default getMicVolume;
