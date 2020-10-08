import { ipcRenderer } from 'electron';

const chromaWindow = document.getElementById('chroma');

chromaWindow.addEventListener('dblclick', () => {
  ipcRenderer.send('fullscreen-chroma-window');
});

ipcRenderer.on('window-resized', () => {
  const player: HTMLVideoElement = document.querySelector('#video-container');
  player.style.width = '100%';
  player.style.height = '100%';
});
