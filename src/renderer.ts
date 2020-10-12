import { ipcMain, ipcRenderer } from 'electron';

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

// COMMENTATORS

const commentatorsButton = document.getElementById('commentators-toggle');

commentatorsButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = commentatorsButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send('commentators-show');
    commentatorsButton.setAttribute('data-state', 'on');
    commentatorsButton.classList.remove('green');
    commentatorsButton.classList.add('red');
    commentatorsButton.classList.add('pulse');
    commentatorsButton.children[1].innerHTML = 'HIDE';
  } else {
    ipcRenderer.send('commentators-hide');
    commentatorsButton.setAttribute('data-state', 'off');
    commentatorsButton.classList.add('green');
    commentatorsButton.classList.remove('red');
    commentatorsButton.classList.remove('pulse');
    commentatorsButton.children[1].innerHTML = 'SHOW';
  }
});

const commentatorUpdateButton = document.getElementById('commentators-update');
const commentatorOneTitle: any = document.getElementById('commentator-one');
const commentatorTwoTitle: any = document.getElementById('commentator-two');

commentatorUpdateButton.addEventListener('click', (e) => {
  e.preventDefault();
  // send the values of the commentator names to ipcMain then to chroma window
  ipcRenderer.send(
    'commentator-names-update',
    commentatorOneTitle.value,
    commentatorTwoTitle.value
  );
});
