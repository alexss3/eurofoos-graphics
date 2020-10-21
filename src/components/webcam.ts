import { ipcRenderer } from 'electron';

let streamStarted = false;

const webcamContainer: HTMLVideoElement = document.querySelector('#webcam-container');
// console.log(navigator.mediaDevices.enumerateDevices());

const constraints = {
    video: true,
    audio: true
};

const handleStream = (stream: any): void => {
    console.log(stream);
    webcamContainer.srcObject = stream;
    webcamContainer.style.display = 'block';
    webcamContainer.play();
    streamStarted = true;
};

const startStream = async (constraits: any): Promise<any> => {
    console.log(constraints);
    const stream = await navigator.mediaDevices.getUserMedia(constraits);
    handleStream(stream);
};



const startWebcam = (deviceId: string): void => {
    console.log(deviceId);
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream: MediaStream) => {
            console.log(stream);
            webcamContainer.srcObject = stream;
            webcamContainer.controls = false;

            webcamContainer.onloadedmetadata = (e): void => {
                webcamContainer.play();
                webcamContainer.style.display = 'block';
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const stopWebcam = (): void => {
    webcamContainer.pause();
    webcamContainer.style.display = 'none';
};

// Handle incoming events

ipcRenderer.on('webcam:select', (event, cameraId) => {
    console.log(cameraId);
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
            ...constraints,
            deviceId: {
                exact: cameraId
            }
        }
        startStream(updatedConstraints);
    } else {
        console.log('Something weird happened');
    }
});

ipcRenderer.on('webcam:start', (event, cameraId) => {
    console.log('Starting webcam...');
    if (streamStarted) {
        webcamContainer.play();
        webcamContainer.style.display = 'block';
        return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        console.log('going to start the stream');
        console.log(cameraId);
        const updatedConstraints = {
            ...constraints,
            deviceId: {
                exact: 'd276d179f1eb7bdc5992c0579106d2793dad9b55a89e61f19c6fa542518120b8'
            }
        }
        startStream(updatedConstraints);
    } else {
        console.log("Can't start the stream");
    }
    // startWebcam(cameraId);
});

ipcRenderer.on('webcam:stop', () => {
    console.log('Stopping webcam');
    stopWebcam();
});

// import { ipcRenderer } from 'electron';

// const webcamContainer: HTMLVideoElement = document.querySelector('#webcam-container');
// // console.log(navigator.mediaDevices.enumerateDevices());

// const startWebcam = (): void => {
//     navigator.mediaDevices.getUserMedia({ audio: true, video: true })
//         .then((stream: MediaStream) => {
//             webcamContainer.srcObject = stream;
//             webcamContainer.controls = false;

//             webcamContainer.onloadedmetadata = (e): void => {
//             webcamContainer.play();
//             webcamContainer.style.display = 'block';
//             }
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

// const stopWebcam = (): void => {
//     webcamContainer.pause();
//     webcamContainer.style.display = 'none';
// };

// ipcRenderer.on('webcam:start', () => {
//     startWebcam();
// });

// ipcRenderer.on('webcam:stop', () => {
//     stopWebcam();
// });