import { ipcRenderer } from 'electron';
import { Config } from '../config/config';
import eventMap from '../config/events';

let streamStarted = false;

const webcamContainer: HTMLVideoElement =
  document.querySelector('#webcam-container');

const buildConstraints = (deviceId: string): MediaStreamConstraints => {
  return {
    audio: Config.webcam.constraints.audio,
    video: {
      deviceId: deviceId,
      width: Config.webcam.constraints.video.width,
      height: Config.webcam.constraints.video.height,
    },
  };
};

const handleStream = (stream: MediaStream): void => {
  stream.getVideoTracks()[0].applyConstraints({
    width: Config.webcam.constraints.video.width,
    height: Config.webcam.constraints.video.height,
  });
  webcamContainer.srcObject = stream;
  webcamContainer.style.display = 'block';
  webcamContainer.play();
  streamStarted = true;
};

const startStream = async (cons: MediaStreamConstraints): Promise<any> => {
  const stream = await navigator.mediaDevices.getUserMedia(cons);
  handleStream(stream);
};

const stopWebcam = (): void => {
  webcamContainer.pause();
  webcamContainer.style.display = 'none';
};

// Handle incoming events

// SELECT
ipcRenderer.on(eventMap.WEBCAM.SELECT, (event, cameraId) => {
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const constraints = buildConstraints(cameraId);
    startStream(constraints);
  } else {
    console.log('Something weird happened');
  }
});

// START
ipcRenderer.on(eventMap.WEBCAM.START, (event, cameraId) => {
  if (streamStarted) {
    webcamContainer.play();
    webcamContainer.style.display = 'block';
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const constraints = buildConstraints(cameraId);
    startStream(constraints);
  } else {
    console.log("Can't start the stream");
  }
});

// STOP
ipcRenderer.on(eventMap.WEBCAM.STOP, () => {
  stopWebcam();
});
