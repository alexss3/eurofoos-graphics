import { ipcRenderer } from 'electron';

// CHROMA WINDOW
const launchChromaButton = document.getElementById('launch-chroma-btn');

launchChromaButton.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('chroma');
});

// BUG

const bugToggleButton = document.getElementById('bug-toggle');

bugToggleButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = bugToggleButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send('bug-show');
    bugToggleButton.setAttribute('data-state', 'on');
    bugToggleButton.classList.remove('green');
    bugToggleButton.classList.add('red');
    bugToggleButton.children[1].innerHTML = 'HIDE';
  } else {
    ipcRenderer.send('bug-hide');
    bugToggleButton.setAttribute('data-state', 'off');
    bugToggleButton.classList.remove('red');
    bugToggleButton.classList.add('green');
    bugToggleButton.children[1].innerHTML = 'SHOW';
  }
});

// VIDEO PLAYER

const videoPlayButton = document.getElementById('video-play');

videoPlayButton.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('video-play');
});
