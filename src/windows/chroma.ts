import { ipcRenderer } from 'electron';
import * as storage from 'electron-json-storage';
import * as os from 'os';
import { ConfigData } from '../helpers/interfaces';
import { Config } from '../config/config';
import { StingerData } from '../functionality/storage';
import eventMap from '../config/events';

const chromaWindow = document.getElementById('chroma');

chromaWindow.addEventListener('dblclick', () => {
  ipcRenderer.send(eventMap.CHROMA.FULLSCREEN);
});

ipcRenderer.on(eventMap.CHROMA.RESIZE, () => {
  const player: HTMLVideoElement = document.querySelector('#video-container');
  player.style.width = '100%';
  player.style.height = '100%';

  const stingerEl: any = document.getElementById('stinger');
  const stingerImgEl: any = document.getElementById('stinger-image');
  stingerEl.style.left = `-${stingerImgEl.width}px`;
});

// Commentators
const updateCommNames = (names: any): void => {
  const commentatorOne = document.querySelector(
    '#commentator-title-one svg text'
  );
  const commentatorTwo = document.querySelector(
    '#commentator-title-two svg text'
  );
  commentatorOne.innerHTML = names[0].name;
  commentatorTwo.innerHTML = names[1].name;
};

ipcRenderer.on(eventMap.COMMENTATORS.NAMES, (e, names) => {
  updateCommNames(names);
});

// Bug

const updateBug = (path: string): void => {
  const bugEl: any = document.getElementById('bug-image');
  bugEl.src = path.split('file:')[1];
};

ipcRenderer.on(eventMap.BUG.UPDATED, (event, path) => {
  updateBug(path);
});

// Countdown
const updateCountdown = (value: number): void => {
  const countdownEl = document.getElementById('countdown');
  countdownEl.dataset.value = value.toString();
};

ipcRenderer.on(eventMap.COUNTDOWN.UPDATED, (event, value) => {
  updateCountdown(value);
});

// Stinger

const updateStinger = (data: StingerData): void => {
  const stingerEl: any = document.getElementById('stinger');
  const stingerImgEl: any = document.getElementById('stinger-image');

  if (data.duration) {
    stingerEl.dataset.duration = data.duration;
  }

  if (data.path) {
    stingerImgEl.src = data.path.split('file:')[1];
  }

  if (data.width) {
    stingerEl.dataset.width = data.width;
    stingerEl.style.left = `-${data.width}px`;
  }

  if (data.height) {
    stingerEl.dataset.height = data.height;
  }
};

ipcRenderer.on(eventMap.STINGER.UPDATED, (event, data: StingerData) => {
  updateStinger(data);
});

// Video

const updateVideo = (path: string): void => {
  const videoEl: any = document.getElementById('video-container');
  videoEl.src = path.split('file:')[1];
};

ipcRenderer.on(eventMap.VIDEO.UPDATED, (event, path) => {
  updateVideo(path);
});

// Team Names
const updateTeamNames = (teamNames: any): void => {
  // ipcRenderer.send('teams:updated', teamNames);
  const redTeamName: any = document.querySelector('#red-team-name');
  const blueTeamName: any = document.querySelector('#blue-team-name');

  redTeamName.innerHTML = teamNames.redTeam;
  blueTeamName.innerHTML = teamNames.blueTeam;
};

ipcRenderer.on(Config.events.TEAMS_UPDATED, (event, teamNames) => {
  updateTeamNames(teamNames);
});

// Webcam

const updateWebcam = (deviceId: string): void => {
  ipcRenderer.send(eventMap.WEBCAM.SELECT, deviceId);
};

// Scoreboard
// const updateScoreboard = (settings: any): void => {
//   ipcRenderer.send('scoreboard:updated', settings);
// };

// const updateDiscipline = (disc: string): void => {
//   ipcRenderer.send('scoreboard:discipline:updated', disc);
// }

// Load settings from config file

storage.setDataPath(os.homedir());

storage.get(Config.settings.key, (err, data: ConfigData) => {
  if (err) console.error(err);
  updateBug(data.bug.path);
  updateCountdown(data.countdown.value);
  updateVideo(data.video.path);
  updateCommNames(data.commentators);
  updateWebcam(data.webcam.device);
  // updateScoreboard(data.scoreboard);
  updateTeamNames(data.teamNames);
  // updateDiscipline(data.discipline);
  updateStinger(data.stinger);
});
