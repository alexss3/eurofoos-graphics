import { ipcRenderer } from 'electron';

const player: HTMLVideoElement = document.querySelector('#video-container');

ipcRenderer.on('video-play', () => {
  player.style.display = 'block';
  player.play();
});

ipcRenderer.on('video-stop', () => {
  player.pause();
  player.style.display = 'none';
  player.currentTime = 0;
});

player.addEventListener('ended', () => {
  player.style.display = 'none';
  ipcRenderer.send('video-ended');
});