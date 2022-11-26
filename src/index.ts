import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  powerSaveBlocker,
  OpenDialogOptions,
  Menu,
  session,
  systemPreferences,
  desktopCapturer,
} from 'electron';

import * as path from 'path';
import * as windowStateKeeper from 'electron-window-state';
import { Config } from './config/config';
import { StingerData } from './functionality/storage';
import eventMap from './config/events';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow | null;
let chromaWindow: BrowserWindow | null;

let mainSession;

const createMainWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

  mainSession = mainWindow.webContents.session;
};

const createChromaWindow = (): void => {
  const chromaWindowState = windowStateKeeper({
    defaultHeight: 1080,
    defaultWidth: 1920,
    file: 'chroma.json',
  });

  chromaWindow = new BrowserWindow({
    height: chromaWindowState.height,
    width: chromaWindowState.width,
    x: chromaWindowState.x,
    y: chromaWindowState.y,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
      enableRemoteModule: true,
    },
  });

  // Hide the cursor from view, else it will
  // appear in the chroma key
  chromaWindow.webContents.on('dom-ready', () => {
    const css = '* {cursor: none !important; }';
    chromaWindow.webContents.insertCSS(css);
  });

  const id = powerSaveBlocker.start('prevent-display-sleep');

  chromaWindow.loadFile(path.join(__dirname, '../src/windows/chroma.html'));

  chromaWindowState.manage(chromaWindow);

  chromaWindow.on('resize', () => {
    chromaWindow.webContents.send(eventMap.CHROMA.RESIZE);
  });

  chromaWindow.on('closed', () => {
    chromaWindow = null;
    powerSaveBlocker.stop(id);
  });
};

const checkWindowFullscreen = (window: BrowserWindow): boolean => {
  return window && window.isFullScreen();
};

const fullscreenBrowserWindow = (window: BrowserWindow): void => {
  window && window.setFullScreen(!checkWindowFullscreen(window));
};

const createMenus = (): void => {
  /* eslint-disable-next-line */
  const menuTemplate: Array<any> = [
    {
      label: 'File',
      submenu: [{ label: 'Cool beans' }],
    },
  ];

  if (process.platform === 'darwin') {
    menuTemplate.unshift({});
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

const initialSetup = (): void => {
  createMainWindow();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initialSetup);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('chroma', () => {
  if (!chromaWindow) {
    createChromaWindow();
  } else {
    chromaWindow.focus();
  }
});

ipcMain.on(eventMap.CHROMA.FULLSCREEN, () => {
  chromaWindow && fullscreenBrowserWindow(chromaWindow);
});

ipcMain.on(eventMap.BUG.SHOW, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.BUG.SHOW);
});

ipcMain.on(eventMap.BUG.HIDE, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.BUG.HIDE);
});

ipcMain.on(eventMap.COUNTDOWN.SHOW, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.COUNTDOWN.SHOW);
});

ipcMain.on(eventMap.COUNTDOWN.HIDE, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.COUNTDOWN.HIDE);
});

ipcMain.on(eventMap.STINGER.PLAY, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.STINGER.PLAY);
});

ipcMain.on(eventMap.VIDEO.PLAY, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.VIDEO.PLAY);
});

ipcMain.on(eventMap.VIDEO.STOP, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.VIDEO.STOP);
});

ipcMain.on(eventMap.VIDEO.ENDED, () => {
  mainWindow.webContents.send(eventMap.VIDEO.ENDED);
});

ipcMain.on(eventMap.WEBCAM.START, (event, deviceId) => {
  systemPreferences
    .askForMediaAccess('camera')
    .then((access) => {
      console.log('Access: ', access);
    })
    .catch((err) => {
      console.log(err);
    });
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.WEBCAM.START, deviceId);
});

ipcMain.on(eventMap.WEBCAM.STOP, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.WEBCAM.STOP);
});

ipcMain.on(eventMap.COMMENTATORS.SHOW, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.COMMENTATORS.SHOW);
});

ipcMain.on(eventMap.COMMENTATORS.HIDE, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.COMMENTATORS.HIDE);
});

ipcMain.on(eventMap.COMMENTATORS.NAMES, (event, names) => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.COMMENTATORS.NAMES, names);
  event.sender.send(eventMap.COMMENTATORS.UPDATED, names);
});

ipcMain.on(eventMap.SCOREBOARD.SHOW, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.SCOREBOARD.SHOW);
});

ipcMain.on(eventMap.SCOREBOARD.HIDE, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.SCOREBOARD.HIDE);
});

// Choose Logo File
ipcMain.on(eventMap.BUG.CHOOSE, (event) => {
  const options: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: Config.bug.formats }],
  };

  dialog
    .showOpenDialog(mainWindow, options)
    .then((result) => {
      const path = `file:${result.filePaths[0]}`;
      event.sender.send(eventMap.BUG.CHOSEN, path);
    })
    .catch((err) => {
      console.error(err);
    });
});

ipcMain.on(eventMap.BUG.UPDATED, (event, path) => {
  chromaWindow && chromaWindow.webContents.send(eventMap.BUG.UPDATED, path);
  event.sender.send(eventMap.BUG.UPDATED, path);
});

// Countdown value updated
ipcMain.on(eventMap.COUNTDOWN.UPDATED, (event, value) => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.COUNTDOWN.UPDATED, value);
  event.sender.send(eventMap.COUNTDOWN.UPDATED, value);
});

// Choose Stinger File
ipcMain.on(eventMap.STINGER.CHOOSE, (event) => {
  const options: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: Config.stinger.formats }],
  };

  dialog
    .showOpenDialog(mainWindow, options)
    .then((result) => {
      const path = `file:${result.filePaths[0]}`;
      event.sender.send(eventMap.STINGER.CHOSEN, path);
    })
    .catch((err) => {
      console.error(err);
    });
});

ipcMain.on(eventMap.STINGER.UPDATED, (event, data: StingerData) => {
  chromaWindow && chromaWindow.webContents.send(eventMap.STINGER.UPDATED, data);
  event.sender.send(eventMap.STINGER.UPDATED, data);
});

// Choose Video File
ipcMain.on(eventMap.VIDEO.CHOOSE, (event) => {
  const options: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [{ name: 'Movies', extensions: Config.video.formats }],
  };

  dialog
    .showOpenDialog(mainWindow, options)
    .then((result) => {
      const path = `file:${result.filePaths[0]}`;
      event.sender.send(eventMap.VIDEO.CHOSEN, path);
    })
    .catch((err) => {
      console.error(err);
    });
});

ipcMain.on(eventMap.VIDEO.UPDATED, (event, path) => {
  chromaWindow && chromaWindow.webContents.send(eventMap.VIDEO.UPDATED, path);
  event.sender.send(eventMap.VIDEO.UPDATED, path);
});

// Overlay

ipcMain.on('overlay:add', (event) => {
  const options: OpenDialogOptions = {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: Config.overlay.formats }],
  };

  dialog
    .showOpenDialog(mainWindow, options)
    .then((result) => {
      const paths = result.filePaths.map((path) => {
        return `file:${path}`;
      });
      event.sender.send('overlay:chosen', paths);
    })
    .catch((err) => {
      console.error(err);
    });
});

ipcMain.on('overlay:updated', (event, paths) => {
  console.log(paths);
});

// Webcam
ipcMain.on(eventMap.WEBCAM.SELECT, (event, deviceId) => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.WEBCAM.UPDATED, deviceId);
  event.sender.send(eventMap.WEBCAM.UPDATED, deviceId);
});

// Scoreboard

ipcMain.on(eventMap.SCOREBOARD.UPDATED, (event, settings) => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.SCOREBOARD.UPDATED, settings);
  event.sender.send(eventMap.SCOREBOARD.UPDATED, settings);
});

ipcMain.on(eventMap.SCOREBOARD.DISCIPLINE.UPDATED, (event, disc) => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.SCOREBOARD.DISCIPLINE.UPDATED, disc);
  event.sender.send(eventMap.SCOREBOARD.DISCIPLINE.UPDATED, disc);
});

ipcMain.on(eventMap.SCOREBOARD.POINT.RED, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.SCOREBOARD.POINT.RED);
});

ipcMain.on(eventMap.SCOREBOARD.POINT.BLUE, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.SCOREBOARD.POINT.BLUE);
});

ipcMain.on(eventMap.SCOREBOARD.SUBTRACT.RED, () => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.SCOREBOARD.SUBTRACT.RED);
});

ipcMain.on(eventMap.SCOREBOARD.SUBTRACT.BLUE, () => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.SCOREBOARD.SUBTRACT.BLUE);
});

ipcMain.on(eventMap.SCOREBOARD.TIMEOUT.RED, () => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.SCOREBOARD.TIMEOUT.RED);
});

ipcMain.on(eventMap.SCOREBOARD.TIMEOUT.BLUE, () => {
  chromaWindow &&
    chromaWindow.webContents.send(eventMap.SCOREBOARD.TIMEOUT.BLUE);
});

ipcMain.on(eventMap.SCOREBOARD.RESET, () => {
  chromaWindow && chromaWindow.webContents.send(eventMap.SCOREBOARD.RESET);
});

// Team Names
ipcMain.on(Config.actions.TEAMS_UPDATE, (event, teamNames) => {
  chromaWindow &&
    chromaWindow.webContents.send(Config.events.TEAMS_UPDATED, teamNames);
  event.sender.send(Config.events.TEAMS_UPDATED, teamNames);
});

// Rankings
ipcMain.on(eventMap.RANKING.UPDATED, (event, data) => {
  // console.log('Rankings updated', data);
  chromaWindow && chromaWindow.webContents.send(eventMap.RANKING.UPDATED, data);
});

ipcMain.on(eventMap.RANKING.HIDE, (event) => {
  chromaWindow && chromaWindow.webContents.send(eventMap.RANKING.HIDE);
});
