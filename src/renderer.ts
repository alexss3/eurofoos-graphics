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
    bugToggleButton.classList.add('pulse');
    bugToggleButton.children[1].innerHTML = 'HIDE';
  } else {
    ipcRenderer.send('bug-hide');
    bugToggleButton.setAttribute('data-state', 'off');
    bugToggleButton.classList.remove('red');
    bugToggleButton.classList.remove('pulse');
    bugToggleButton.classList.add('green');
    bugToggleButton.children[1].innerHTML = 'SHOW';
  }
});

// VIDEO PLAYER

const videoPlayButton = document.getElementById('video-play');

videoPlayButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = videoPlayButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send('video-play');
    videoPlayButton.setAttribute('data-state', 'on');
    videoPlayButton.classList.remove('green');
    videoPlayButton.classList.add('red');
    videoPlayButton.classList.add('pulse');
    videoPlayButton.children[1].innerHTML = 'STOP';
  } else {
    ipcRenderer.send('video-stop');
    videoPlayButton.setAttribute('data-state', 'off');
    videoPlayButton.classList.add('green');
    videoPlayButton.classList.remove('red');
    videoPlayButton.classList.remove('pulse');
    videoPlayButton.children[1].innerHTML = 'PLAY';
  }
});
