import { ipcRenderer } from 'electron';
import eventMap from '../config/events';

const player: HTMLVideoElement = document.querySelector('#video-container');

ipcRenderer.on(eventMap.VIDEO.PLAY, () => {
  player.style.display = 'block';
  player.play();
});

ipcRenderer.on(eventMap.VIDEO.STOP, () => {
  player.pause();
  player.style.display = 'none';
  player.currentTime = 0;
});

player.addEventListener('ended', () => {
  player.style.display = 'none';
  ipcRenderer.send(eventMap.VIDEO.ENDED);
});
