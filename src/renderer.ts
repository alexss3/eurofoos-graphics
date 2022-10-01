import { ipcRenderer } from 'electron';
import { Config } from './config/config';
import { StingerData } from './functionality/storage';
import eventMap from './config/events';

// CHROMA WINDOW
const launchChromaButton = document.getElementById('launch-chroma-btn');

launchChromaButton.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('chroma');
});

// Bottom Nav Buttons
const bottomNavButtons = document.querySelectorAll('#footer-nav li a');
const pagesArray: NodeListOf<HTMLElement> =
  document.querySelectorAll('div.page');

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
    ipcRenderer.send(eventMap.BUG.SHOW);
    bugToggleButton.setAttribute('data-state', 'on');
    bugToggleButton.classList.remove('green');
    bugToggleButton.classList.add('red');
    bugToggleButton.classList.add('pulse');
  } else {
    ipcRenderer.send(eventMap.BUG.HIDE);
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
  ipcRenderer.send(eventMap.BUG.CHOOSE);
});

ipcRenderer.on(eventMap.BUG.CHOSEN, (event, path) => {
  bugFilePath.value = path.split('file:')[1];

  asyncBugImage.src = path;

  asyncBugImage.onload = (): void => {
    inlineBugPreview.src = path;
    ipcRenderer.send(eventMap.BUG.UPDATED, path);
  };

  asyncBugImage.addEventListener('error', () => {
    inlineBugPreview.src = null;
    console.log('Could not load image');
  });
});

// Countdown timer
const countdownValue: any = document.getElementById('countdown-value');
const countdownReset: any = document.getElementById('countdown-reset');

countdownValue.addEventListener('change', (event: any) => {
  ipcRenderer.send(eventMap.COUNTDOWN.UPDATED, event.target.value);
});

countdownReset.addEventListener('click', () => {
  ipcRenderer.send(eventMap.COUNTDOWN.RESET);
});

ipcRenderer.on(eventMap.COUNTDOWN.UPDATED, (event, value) => {
  countdownValue.value = value;
});

const countdownPlayButton = document.getElementById('countdown-toggle');

countdownPlayButton.addEventListener('click', (e) => {
  e.preventDefault();

  const state = countdownPlayButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send(eventMap.COUNTDOWN.SHOW);
    countdownPlayButton.setAttribute('data-state', 'on');
    countdownPlayButton.classList.remove('green');
    countdownPlayButton.classList.add('red');
    countdownPlayButton.classList.add('pulse');
  } else {
    ipcRenderer.send(eventMap.COUNTDOWN.HIDE);
    countdownPlayButton.setAttribute('data-state', 'off');
    countdownPlayButton.classList.remove('red');
    countdownPlayButton.classList.remove('pulse');
    countdownPlayButton.classList.add('green');
  }
});

// Choose Stinger File

const asyncStingerImage = new Image();

const chooseStingerButton = document.getElementById('choose-stinger');
const stingerFilePath: any = document.getElementById('stinger-path');
const stingerDuration: any = document.getElementById('stinger-duration');
const inlineStingerPreview: any = document.getElementById(
  'inline-stinger-preview'
);

chooseStingerButton.addEventListener('click', () => {
  ipcRenderer.send(eventMap.STINGER.CHOOSE);
});

stingerDuration.addEventListener('change', () => {
  ipcRenderer.send(eventMap.STINGER.UPDATED, {
    duration: stingerDuration.value,
  });
});

ipcRenderer.on(eventMap.STINGER.UPDATED, (event, data: StingerData) => {
  if (data.duration) {
    stingerDuration.value = data.duration;
  }
});

ipcRenderer.on(eventMap.STINGER.CHOSEN, (event, path) => {
  stingerFilePath.value = path.split('file:')[1];

  asyncStingerImage.src = path;

  asyncStingerImage.onload = (): void => {
    inlineStingerPreview.src = path;
    ipcRenderer.send(eventMap.STINGER.UPDATED, {
      path,
      width: asyncStingerImage.width,
      height: asyncStingerImage.height,
    });
  };

  asyncStingerImage.addEventListener('error', () => {
    inlineStingerPreview.src = null;
    console.log('Could not load image');
  });
});

// VIDEO PLAYER

const videoPlayButton = document.getElementById('video-play');
const videoChooseButton = document.getElementById('choose-video');
const videoFilePath: any = document.getElementById('video-path');

videoChooseButton.addEventListener('click', () => {
  ipcRenderer.send(eventMap.VIDEO.CHOOSE);
});

ipcRenderer.on(eventMap.VIDEO.CHOSEN, (event, path) => {
  videoFilePath.value = path.split('file:')[1];
  ipcRenderer.send(eventMap.VIDEO.UPDATED, path);
});

videoPlayButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = videoPlayButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send(eventMap.VIDEO.PLAY);
    videoPlayButton.setAttribute('data-state', 'on');
    videoPlayButton.classList.remove('green');
    videoPlayButton.classList.add('red');
    videoPlayButton.classList.add('pulse');
  } else {
    ipcRenderer.send(eventMap.VIDEO.STOP);
    videoPlayButton.setAttribute('data-state', 'off');
    videoPlayButton.classList.add('green');
    videoPlayButton.classList.remove('red');
    videoPlayButton.classList.remove('pulse');
  }
});

ipcRenderer.on(eventMap.VIDEO.ENDED, () => {
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
    ipcRenderer.send(eventMap.COMMENTATORS.SHOW);
    commentatorsButton.setAttribute('data-state', 'on');
    commentatorsButton.classList.remove('green');
    commentatorsButton.classList.add('red');
    commentatorsButton.classList.add('pulse');
  } else {
    ipcRenderer.send(eventMap.COMMENTATORS.HIDE);
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
    { name: commentatorTwoTitle.value },
  ];
  ipcRenderer.send(eventMap.COMMENTATORS.NAMES, payload);
});

ipcRenderer.on(eventMap.COMMENTATORS.UPDATED, (event, names) => {
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

navigator.mediaDevices
  .enumerateDevices()
  .then((devices) => {
    const videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    );
    videoDevices.forEach((device) => {
      webcamSelect.appendChild(new Option(device.label, device.deviceId));
    });
  })
  .catch((err) => {
    console.log(err);
  });

webcamButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = webcamButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send(eventMap.WEBCAM.START, webcamSelect.value);
    webcamButton.setAttribute('data-state', 'on');
    webcamButton.classList.remove('green');
    webcamButton.classList.add('red');
    webcamButton.classList.add('pulse');
  } else {
    ipcRenderer.send(eventMap.WEBCAM.STOP);
    webcamButton.setAttribute('data-state', 'off');
    webcamButton.classList.add('green');
    webcamButton.classList.remove('red');
    webcamButton.classList.remove('pulse');
  }
});

webcamSelect.addEventListener('change', (e: any) => {
  ipcRenderer.send(eventMap.WEBCAM.SELECT, e.target.value);
});

ipcRenderer.on(eventMap.WEBCAM.SELECT, (event, deviceId) => {
  webcamSelect.value = deviceId;
});

// SCOREBOARD

const scoreboardButton = document.getElementById('scoreboard-toggle');

scoreboardButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = scoreboardButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send(eventMap.SCOREBOARD.SHOW);
    scoreboardButton.setAttribute('data-state', 'on');
    scoreboardButton.classList.remove('green');
    scoreboardButton.classList.add('red');
    scoreboardButton.classList.add('pulse');
  } else {
    ipcRenderer.send(eventMap.SCOREBOARD.HIDE);
    scoreboardButton.setAttribute('data-state', 'off');
    scoreboardButton.classList.add('green');
    scoreboardButton.classList.remove('red');
    scoreboardButton.classList.remove('pulse');
  }
});

// STINGER

const stingerButton = document.getElementById('stinger-toggle');

stingerButton.addEventListener('click', (e) => {
  e.preventDefault();
  const state = stingerButton.getAttribute('data-state');
  if (state === 'off') {
    ipcRenderer.send(eventMap.STINGER.PLAY);
    stingerButton.setAttribute('data-state', 'on');
    stingerButton.classList.remove('green');
    stingerButton.classList.add('red');
    stingerButton.classList.add('pulse');
    setTimeout(() => {
      stingerButton.setAttribute('data-state', 'off');
      stingerButton.classList.add('green');
      stingerButton.classList.remove('red');
      stingerButton.classList.remove('pulse');
    }, stingerDuration.value);
  }
});

const pointsInSetSelect: any = document.getElementById('scoreboard-points-set');
const maxPointsSelect: any = document.getElementById('scoreboard-max-points');
const bestOfSelect: any = document.getElementById('scoreboard-best-of');
const disciplineSelect: any = document.getElementById('scoreboard-discipline');

const redTeamName: any = document.getElementById('red-team-name');
const blueTeamName: any = document.getElementById('blue-team-name');

const updateScoreboardButton = document.getElementById(
  'scoreboard-names-update'
);

const returnCurrentScoreboardSettings = (): {} => {
  return {
    pointsInSet: pointsInSetSelect.value,
    maxPoints: maxPointsSelect.value,
    bestOfSets: bestOfSelect.value,
  };
};

pointsInSetSelect.addEventListener('change', () => {
  ipcRenderer.send(
    eventMap.SCOREBOARD.UPDATED,
    returnCurrentScoreboardSettings()
  );
});

maxPointsSelect.addEventListener('change', () => {
  ipcRenderer.send(
    eventMap.SCOREBOARD.UPDATED,
    returnCurrentScoreboardSettings()
  );
});

bestOfSelect.addEventListener('change', () => {
  ipcRenderer.send(
    eventMap.SCOREBOARD.UPDATED,
    returnCurrentScoreboardSettings()
  );
});

disciplineSelect.addEventListener('change', () => {
  ipcRenderer.send(
    eventMap.SCOREBOARD.DISCIPLINE.UPDATED,
    disciplineSelect.value
  );
});

// This sets the select fields to the right values
ipcRenderer.on(eventMap.SCOREBOARD.UPDATED, (event, settings) => {
  pointsInSetSelect.value = settings.pointsInSet;
  maxPointsSelect.value = settings.maxPoints;
  bestOfSelect.value = settings.bestOfSets;
});

ipcRenderer.on(eventMap.SCOREBOARD.DISCIPLINE.UPDATED, (event, disc) => {
  disciplineSelect.value = disc;
});

updateScoreboardButton.addEventListener('click', () => {
  const teamNames = {
    redTeam: redTeamName.value,
    blueTeam: blueTeamName.value,
  };
  ipcRenderer.send(Config.actions.TEAMS_UPDATE, teamNames);
});

ipcRenderer.on(Config.events.TEAMS_UPDATED, (event, teamNames) => {
  redTeamName.value = teamNames.redTeam;
  blueTeamName.value = teamNames.blueTeam;
});
