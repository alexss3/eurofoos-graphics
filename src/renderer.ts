import { ipcRenderer } from 'electron';

// CHROMA WINDOW
const launchChromaButton = document.getElementById('launch-chroma-btn');

launchChromaButton.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('chroma');
});


// Bottom Nav Buttons
const bottomNavButtons = document.querySelectorAll('#footer-nav li a');
const pagesArray: NodeListOf<HTMLElement> = document.querySelectorAll('div.page');

bottomNavButtons.forEach((button) => {
  button.addEventListener('click', () => {
    pagesArray.forEach((page, index) => {
      const btnId = button.parentElement.id;
      const btnMatch = 'page-' + btnId.split('bottom-nav-')[1];
      console.log(btnMatch);

      if (`${page.id}` !== btnMatch) {
        // hide
        pagesArray[index].style.display = 'none';
        bottomNavButtons[index].parentElement.classList.remove('selected');
        bottomNavButtons[index].parentElement.setAttribute('data-state', 'off');
      } else {
        // show
        pagesArray[index].style.display = 'block';
        bottomNavButtons[index].parentElement.classList.add('selected');
        bottomNavButtons[index].parentElement.setAttribute('data-state', 'on');
      }
    });
  });
});


// BUG

const bugToggleButton = document.getElementById('bug-toggle');

bugToggleButton.addEventListener('click', (e) => {
  e.preventDefault();

  const state = bugToggleButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send('bug:show');
    bugToggleButton.setAttribute('data-state', 'on');
    bugToggleButton.classList.remove('green');
    bugToggleButton.classList.add('red');
    bugToggleButton.classList.add('pulse');

  } else {
    ipcRenderer.send('bug:hide');
    bugToggleButton.setAttribute('data-state', 'off');
    bugToggleButton.classList.remove('red');
    bugToggleButton.classList.remove('pulse');
    bugToggleButton.classList.add('green');

  }
});

// Choose Bug File

const asyncBugImage = new Image();

const chooseBugButton = document.getElementById('choose-bug');
const bugFilePath: any = document.getElementById('bug-path');
const inlineBugPreview: any = document.getElementById('inline-bug-preview');

chooseBugButton.addEventListener('click', () => {
  ipcRenderer.send('bug:choose');
});

ipcRenderer.on('bug:chosen', (event, path) => {
  
  bugFilePath.value = path.split('file:')[1];

  asyncBugImage.src = path;

  asyncBugImage.onload = (): void => {
    inlineBugPreview.src = path;
    ipcRenderer.send('bug:updated', path);
  };

  asyncBugImage.addEventListener('error', () => {
    inlineBugPreview.src = null;
    console.log('Could not load image');
  });
});

// VIDEO PLAYER

const videoPlayButton = document.getElementById('video-play');
const videoChooseButton = document.getElementById('choose-video');
const videoFilePath: any = document.getElementById('video-path');

videoChooseButton.addEventListener('click', () => {
  ipcRenderer.send('video:choose');
});

ipcRenderer.on('video:chosen', (event, path) => {
  videoFilePath.value = path.split('file:')[1];
  ipcRenderer.send('video:updated', path);
});

videoPlayButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = videoPlayButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send('video-play');
    videoPlayButton.setAttribute('data-state', 'on');
    videoPlayButton.classList.remove('green');
    videoPlayButton.classList.add('red');
    videoPlayButton.classList.add('pulse');

  } else {
    ipcRenderer.send('video-stop');
    videoPlayButton.setAttribute('data-state', 'off');
    videoPlayButton.classList.add('green');
    videoPlayButton.classList.remove('red');
    videoPlayButton.classList.remove('pulse');

  }
});

ipcRenderer.on('video-ended', () => {
  videoPlayButton.setAttribute('data-state', 'off');
  videoPlayButton.classList.add('green');
  videoPlayButton.classList.remove('red');
  videoPlayButton.classList.remove('pulse');

});

// WEBCAM
const webcamButton = document.getElementById('webcam-toggle');

webcamButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = webcamButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send('webcam:start');
    webcamButton.setAttribute('data-state', 'on');
    webcamButton.classList.remove('green');
    webcamButton.classList.add('red');
    webcamButton.classList.add('pulse');

  } else {
    ipcRenderer.send('webcam:stop');
    webcamButton.setAttribute('data-state', 'off');
    webcamButton.classList.add('green');
    webcamButton.classList.remove('red');
    webcamButton.classList.remove('pulse');

  }
});

// ipcRenderer.on('video-ended', () => {
//   webcamButton.setAttribute('data-state', 'off');
//   webcamButton.classList.add('green');
//   webcamButton.classList.remove('red');
//   webcamButton.classList.remove('pulse');
//   webcamButton.children[1].innerHTML = 'PLAY';
// });


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

  } else {
    ipcRenderer.send('commentators-hide');
    commentatorsButton.setAttribute('data-state', 'off');
    commentatorsButton.classList.add('green');
    commentatorsButton.classList.remove('red');
    commentatorsButton.classList.remove('pulse');

  }
});

const commentatorUpdateButton = document.getElementById('commentators-update');
const commentatorOneTitle: any = document.getElementById('commentator-one');
const commentatorTwoTitle: any = document.getElementById('commentator-two');

commentatorUpdateButton.addEventListener('click', (e) => {
  e.preventDefault();
  // send the values of the commentator names to ipcMain then to chroma window
  const payload = [
    { name: commentatorOneTitle.value }, 
    { name: commentatorTwoTitle.value } 
  ]
  ipcRenderer.send('commentator-names-update', payload);
});

ipcRenderer.on('comms:updated', (event, names) => {
  commentatorOneTitle.value = names[0].name;
  commentatorTwoTitle.value = names[1].name;
});


// Overlay

const chooseOverlayButton = document.getElementById('overlay-add');

chooseOverlayButton.addEventListener('click', () => {
  ipcRenderer.send('overlay:add');
});

ipcRenderer.on('overlay:chosen', (event, paths) => {
  ipcRenderer.send('overlay:updated', paths);
});