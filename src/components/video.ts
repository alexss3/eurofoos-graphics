import { ipcRenderer } from 'electron';

ipcRenderer.on('video-play', () => {
  const player: HTMLVideoElement = document.querySelector('#video-container');
  player.style.display = 'block';
  player.play();
});
