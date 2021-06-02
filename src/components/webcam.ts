import { ipcRenderer } from 'electron';

let streamStarted = false;

const webcamContainer: HTMLVideoElement = document.querySelector('#webcam-container');


const handleStream = (stream: any): void => {
    console.log(stream);
    webcamContainer.srcObject = stream;
    webcamContainer.style.display = 'block';
    webcamContainer.play();
    streamStarted = true;
};

const startStream = async (cons: any): Promise<any> => {
    const stream = await navigator.mediaDevices.getUserMedia(cons);
    console.log(stream.getTracks());
    handleStream(stream);
};


const stopWebcam = (): void => {
    webcamContainer.pause();
    webcamContainer.style.display = 'none';
};

// Handle incoming events

ipcRenderer.on('webcam:select', (event, cameraId) => {
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const constraints = {
            'audio': true,
            'video': {
                'deviceId': cameraId,
                'width': {'min': 1920},
                'height': {'min': 1080}
            }
        }
        startStream(constraints);
    } else {
        console.log('Something weird happened');
    }
});

ipcRenderer.on('webcam:start', (event, cameraId) => {
    if (streamStarted) {
        webcamContainer.play();
        webcamContainer.style.display = 'block';
        return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const constraints = {
            'audio': true,
            'video': {
                'deviceId': cameraId,
                'width': {'min': 1920},
                'height': {'min': 1080}
            }
        }
        startStream(constraints);
    } else {
        console.log("Can't start the stream");
    }
    // startWebcam(cameraId);
});

ipcRenderer.on('webcam:stop', () => {
    stopWebcam();
});