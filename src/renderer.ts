import { ipcRenderer } from 'electron';
import { Config } from './config/config';

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


// WEBCAM
const webcamButton = document.getElementById('webcam-toggle');
const webcamSelect: any = document.getElementById('select-webcam');

navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    videoDevices.forEach(device => {
      webcamSelect.appendChild(new Option(device.label, device.deviceId));
    });
  })
  .catch(err => {
    console.log(err);
  });

webcamButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = webcamButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send('webcam:start', webcamSelect.value);
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

webcamSelect.addEventListener('change', (e: any) => {
  ipcRenderer.send('webcam:select', e.target.value);
});

ipcRenderer.on('webcam:select', (event, deviceId) => {
  webcamSelect.value = deviceId;
});

// SCOREBOARD

const scoreboardButton = document.getElementById('scoreboard-toggle');

scoreboardButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = scoreboardButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send('scoreboard:show');
    scoreboardButton.setAttribute('data-state', 'on');
    scoreboardButton.classList.remove('green');
    scoreboardButton.classList.add('red');
    scoreboardButton.classList.add('pulse');

  } else {
    ipcRenderer.send('scoreboard:hide');
    scoreboardButton.setAttribute('data-state', 'off');
    scoreboardButton.classList.add('green');
    scoreboardButton.classList.remove('red');
    scoreboardButton.classList.remove('pulse');
  }
});


const pointsInSetSelect: any = document.getElementById('scoreboard-points-set');
const maxPointsSelect: any = document.getElementById('scoreboard-max-points');
const bestOfSelect: any = document.getElementById('scoreboard-best-of');
const disciplineSelect: any = document.getElementById('scoreboard-discipline');

const redTeamName: any = document.getElementById('red-team-name');
const blueTeamName: any = document.getElementById('blue-team-name');

const updateScoreboardButton = document.getElementById('scoreboard-names-update');

const returnCurrentScoreboardSettings = (): {} => {
  return {
    pointsInSet: pointsInSetSelect.value,
    maxPoints: maxPointsSelect.value,
    bestOfSets: bestOfSelect.value
  };
};

pointsInSetSelect.addEventListener('change', () => {
  ipcRenderer.send('scoreboard:updated', returnCurrentScoreboardSettings());
});

maxPointsSelect.addEventListener('change', () => {
  ipcRenderer.send('scoreboard:updated', returnCurrentScoreboardSettings());
});

bestOfSelect.addEventListener('change', () => {
  ipcRenderer.send('scoreboard:updated', returnCurrentScoreboardSettings());
});

disciplineSelect.addEventListener('change', () => {
  ipcRenderer.send('scoreboard:discipline:updated', disciplineSelect.value);
});

// This sets the select fields to the right values
ipcRenderer.on('scoreboard:updated', (event, settings) => {
  pointsInSetSelect.value = settings.pointsInSet;
  maxPointsSelect.value = settings.maxPoints;
  bestOfSelect.value = settings.bestOfSets;
});

ipcRenderer.on('scoreboard:discipline:updated', (event, disc) => {
  disciplineSelect.value = disc;
});

updateScoreboardButton.addEventListener('click', () => {
  const teamNames = {
    redTeam: redTeamName.value,
    blueTeam: blueTeamName.value
  };
  ipcRenderer.send(Config.actions.TEAMS_UPDATE, teamNames);
});

ipcRenderer.on(Config.events.TEAMS_UPDATED, (event, teamNames) => {
  redTeamName.value = teamNames.redTeam;
  blueTeamName.value = teamNames.blueTeam;
});