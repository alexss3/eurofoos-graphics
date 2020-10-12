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

// Commentators
// const commentatorsWrapper = document.getElementById('commentators');
const commentatorOne = document.querySelector(
  '#commentator-title-one svg text'
);
const commentatorTwo = document.querySelector(
  '#commentator-title-two svg text'
);

// commentatorOne.innerHTML = 'Test One';
// commentatorTwo.innerHTML = 'Test Two';
ipcRenderer.on('commentator-names-update', (e, ...args) => {
  commentatorOne.innerHTML = args[0];
  commentatorTwo.innerHTML = args[1];
});
