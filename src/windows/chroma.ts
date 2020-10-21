import { ipcRenderer } from 'electron';
import * as storage from 'electron-json-storage';
import * as os from 'os';
import { ConfigData } from '../helpers/interfaces';
import { Config } from '../config/config';

const chromaWindow = document.getElementById('chroma');

chromaWindow.addEventListener('dblclick', () => {
  ipcRenderer.send('fullscreen-chroma-window');
});

ipcRenderer.on('window-resized', () => {
  const player: HTMLVideoElement = document.querySelector('#video-container');
  player.style.width = '100%';
  player.style.height = '100%';
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

ipcRenderer.on('commentator-names-update', (e, names) => {
  updateCommNames(names);
});

// Bug

const updateBug = (path: string): void => {
  const bugEl: any = document.getElementById('bug-image');
  bugEl.src = path.split('file:')[1];
};

ipcRenderer.on('bug:updated', (event, path) => {
  updateBug(path);
});

// Video

const updateVideo = (path: string): void => {
  const videoEl: any = document.getElementById('video-container');
  videoEl.src = path.split('file:')[1];
};

ipcRenderer.on('video:updated', (event, path) => {
  updateVideo(path);
});

// Webcam

const updateWebcam = (deviceId: string): void => {
  ipcRenderer.send('webcam:select', deviceId);
};

// Scoreboard
const updateScoreboard = (settings: any): void => {
  ipcRenderer.send('scoreboard:updated', settings);
};

// Team Names
const updateTeamNames = (teamNames: any): void => {
  ipcRenderer.send('teams:updated', teamNames);
};


// Load settings from config file

storage.setDataPath(os.homedir());

storage.get(Config.settings.key, (err, data: ConfigData) => {
  if (err) console.error(err);
  updateBug(data.bug.path);
  updateVideo(data.video.path);
  updateCommNames(data.commentators);
  updateWebcam(data.webcam.device);
  updateScoreboard(data.scoreboard);
  updateTeamNames(data.teamNames);
});

