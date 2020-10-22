import * as storage from 'electron-json-storage';
import { ipcRenderer, remote } from 'electron';
import * as os from 'os';
import { ConfigData } from '../helpers/interfaces';
import { Config } from '../config/config';


const initialData: ConfigData = {
  bug: {
    path: '',
  },
  video: {
    path: '',
  },
  commentators: [{ name: 'Comm. One' }, { name: 'Comm. Two' }],
  webcam: {
    device: ''
  },
  scoreboard: {
    pointsInSet: undefined,
    maxPoints: undefined,
    bestOfSets: undefined
  },
  discipline: 'Open Singles',
  teamNames: {
    redTeam: 'Red Team',
    blueTeam: 'Blue Team'
  }
};

const key = Config.settings.key;

const throwIfStorageError = (err: Error): void => {
  if (err) throw new Error(`Storage error: ${err.message}`);
};

const updateFromConfigData = (data: ConfigData): void => {
  const rendererProcess = remote.getCurrentWindow();
  
  rendererProcess.webContents.send('bug:chosen', data.bug.path);
  rendererProcess.webContents.send('video:chosen', data.video.path);
  rendererProcess.webContents.send('comms:updated', data.commentators);
  rendererProcess.webContents.send('webcam:select', data.webcam.device);
  rendererProcess.webContents.send('scoreboard:updated', data.scoreboard);
  rendererProcess.webContents.send('scoreboard:discipline:updated', data.discipline);
  rendererProcess.webContents.send('teams:updated', data.teamNames);
};

const updateSettingsFile = (data: ConfigData): void => {
  storage.set(key, data, (err) => {
    if (err) console.error(err);
  });
};

storage.setDataPath(os.homedir());

storage.has(key, (error, hasKey) => {
  throwIfStorageError(error);

  if (hasKey) {
    storage.get(key, (error, data: ConfigData) => {
      // console.log('Data loaded from config file', data);
      throwIfStorageError(error);

      updateFromConfigData(data);
    });
  } else {
    storage.set(key, initialData, (error) => {
      throwIfStorageError(error);
    });

    updateFromConfigData(initialData);
  }
});

ipcRenderer.on('bug:updated', (event, data) => {
  initialData.bug.path = data;
  updateSettingsFile(initialData);
});

ipcRenderer.on('video:updated', (event, data) => {
  initialData.video.path = data;
  updateSettingsFile(initialData);
});

ipcRenderer.on('comms:updated', (event, data) => {
  initialData.commentators = data;
  updateSettingsFile(initialData);
});

ipcRenderer.on('webcam:updated', (event, deviceId) => {
  initialData.webcam.device = deviceId;
  updateSettingsFile(initialData);
});

ipcRenderer.on('scoreboard:updated', (event, settings) => {
  initialData.scoreboard = {
    pointsInSet: parseInt(settings.pointsInSet),
    maxPoints: parseInt(settings.maxPoints),
    bestOfSets: parseInt(settings.bestOfSets)
  };
  updateSettingsFile(initialData);
});

ipcRenderer.on('scoreboard:discipline:updated', (event, disc) => {
  initialData.discipline = disc;
  updateSettingsFile(initialData);
});

ipcRenderer.on('teams:updated', (event, teamNames) => {
  initialData.teamNames = teamNames;
  updateSettingsFile(initialData);
});