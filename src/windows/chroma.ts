import { ipcRenderer } from 'electron';

const chromaWindow = document.getElementById('chroma');

chromaWindow.addEventListener('dblclick', () => {
  ipcRenderer.send('fullscreen-chroma-window');
});
