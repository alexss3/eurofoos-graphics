import * as storage from 'electron-json-storage';
import { ipcRenderer, remote } from 'electron';
import * as os from 'os';
import { ConfigData } from '../helpers/interfaces';


const initialData: ConfigData = {
  bug: {
    path: '',
  },
  video: {
    path: '',
  },
  commentators: [{ name: 'Comm. One' }, { name: 'Comm. Two' }],
};

const key = 'eurofooslive-graphics-settings';

const throwIfStorageError = (err: Error): void => {
  if (err) throw new Error(`Storage error: ${err.message}`);
};

const updateFromConfigData = (data: ConfigData): void => {
  const rendererProcess = remote.getCurrentWindow();
  
  rendererProcess.webContents.send('bug:chosen', data.bug.path);
  rendererProcess.webContents.send('video:chosen', data.video.path);
  rendererProcess.webContents.send('comms:updated', data.commentators);
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
      console.log('Data loaded from config file', data);
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
