import * as storage from 'electron-json-storage';
import { ipcRenderer, remote } from 'electron';
import * as os from 'os';
import { ConfigData } from '../helpers/interfaces';
import { Config } from '../config/config';
import eventMap from '../config/events';

const initialData: ConfigData = {
  bug: {
    path: '',
  },
  countdown: {
    value: 5,
  },
  video: {
    path: '',
  },
  commentators: [{ name: 'Comm. One' }, { name: 'Comm. Two' }],
  webcam: {
    device: '',
  },
  scoreboard: {
    pointsInSet: undefined,
    maxPoints: undefined,
    bestOfSets: undefined,
  },
  discipline: 'Open Singles',
  teamNames: {
    redTeam: 'Red Team',
    blueTeam: 'Blue Team',
  },
  stinger: {
    path: '',
    duration: 1000,
    width: 0,
    height: 0,
  },
};

const key = Config.settings.key;

const throwIfStorageError = (err: Error): void => {
  if (err) throw new Error(`Storage error: ${err.message}`);
};

const updateFromConfigData = (data: ConfigData): void => {
  const rendererProcess = remote.getCurrentWindow();

  rendererProcess.webContents.send(eventMap.BUG.CHOSEN, data.bug.path);
  rendererProcess.webContents.send(
    eventMap.COUNTDOWN.UPDATED,
    data.countdown.value
  );
  rendererProcess.webContents.send(eventMap.VIDEO.CHOSEN, data.video.path);
  rendererProcess.webContents.send(
    eventMap.COMMENTATORS.UPDATED,
    data.commentators
  );
  rendererProcess.webContents.send(eventMap.STINGER.CHOSEN, data.stinger.path);
  rendererProcess.webContents.send(eventMap.STINGER.UPDATED, data.stinger);
  rendererProcess.webContents.send(eventMap.WEBCAM.SELECT, data.webcam.device);
  rendererProcess.webContents.send(
    eventMap.SCOREBOARD.UPDATED,
    data.scoreboard
  );
  rendererProcess.webContents.send(
    eventMap.SCOREBOARD.DISCIPLINE.UPDATED,
    data.discipline
  );
  rendererProcess.webContents.send(Config.events.TEAMS_UPDATED, data.teamNames);
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

ipcRenderer.on(eventMap.BUG.UPDATED, (event, data) => {
  initialData.bug.path = data;
  updateSettingsFile(initialData);
});

ipcRenderer.on(eventMap.COUNTDOWN.UPDATED, (event, data) => {
  initialData.countdown.value = data;
  console.log('Storage updating', initialData);
  updateSettingsFile(initialData);
});

ipcRenderer.on(eventMap.VIDEO.UPDATED, (event, data) => {
  initialData.video.path = data;
  updateSettingsFile(initialData);
});

ipcRenderer.on(eventMap.COMMENTATORS.UPDATED, (event, data) => {
  initialData.commentators = data;
  updateSettingsFile(initialData);
});

export type StingerData = {
  path?: string;
  duration?: number;
  width?: number;
  height?: number;
};

ipcRenderer.on(eventMap.STINGER.UPDATED, (event, data: StingerData) => {
  if (data.path) {
    initialData.stinger.path = data.path;
  }

  if (data.duration) {
    initialData.stinger.duration = data.duration;
  }

  if (data.width) {
    initialData.stinger.width = data.width;
  }

  if (data.height) {
    initialData.stinger.height = data.height;
  }

  updateSettingsFile(initialData);
});

ipcRenderer.on(eventMap.WEBCAM.UPDATED, (event, deviceId) => {
  initialData.webcam.device = deviceId;
  updateSettingsFile(initialData);
});

ipcRenderer.on(eventMap.SCOREBOARD.UPDATED, (event, settings) => {
  initialData.scoreboard = {
    pointsInSet: parseInt(settings.pointsInSet),
    maxPoints: parseInt(settings.maxPoints),
    bestOfSets: parseInt(settings.bestOfSets),
  };
  updateSettingsFile(initialData);
});

ipcRenderer.on(eventMap.SCOREBOARD.DISCIPLINE.UPDATED, (event, disc) => {
  initialData.discipline = disc;
  updateSettingsFile(initialData);
});

ipcRenderer.on(Config.events.TEAMS_UPDATED, (event, teamNames) => {
  initialData.teamNames = teamNames;
  updateSettingsFile(initialData);
});
