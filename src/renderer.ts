import { ipcRenderer } from 'electron';

const launchChromaButton = document.getElementById('launch-chroma-btn');

launchChromaButton.addEventListener('click', (e) => {
  e.preventDefault();

  ipcRenderer.send('chroma', 'open');
});
