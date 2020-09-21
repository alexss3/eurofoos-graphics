import { ipcRenderer } from 'electron';

const bug = document.getElementById('bug');

ipcRenderer.on('bug-show', () => {
  console.log('Show the bug!');

  bug.style.display = 'block';
});
