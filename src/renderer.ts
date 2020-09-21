import { ipcRenderer } from 'electron';

const launchChromaButton = document.getElementById('launch-chroma-btn');

launchChromaButton.addEventListener('click', (e) => {
  e.preventDefault();

  ipcRenderer.send('chroma');
});

const bugShowButton = document.getElementById('bug-show');

bugShowButton.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('bug-show');
});

const bugHideButton = document.getElementById('bug-hide');

bugHideButton.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('bug-hide');
});
