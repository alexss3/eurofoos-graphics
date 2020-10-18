import { ipcRenderer } from 'electron';

const webcamContainer: HTMLVideoElement = document.querySelector('#webcam-container');
// console.log(navigator.mediaDevices.enumerateDevices());

const startWebcam = (): void => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then((stream: MediaStream) => {
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

ipcRenderer.on('webcam:start', () => {
    startWebcam();
});

ipcRenderer.on('webcam:stop', () => {
    stopWebcam();
});