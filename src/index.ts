import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  powerSaveBlocker,
  OpenDialogOptions,
  Menu
} from 'electron';

import * as path from 'path';
import * as windowStateKeeper from 'electron-window-state';

// import events from './functionality/events';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow | null;
let chromaWindow: BrowserWindow | null;

const createMainWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

};

const createChromaWindow = (): void => {

  const chromaWindowState = windowStateKeeper({
    defaultHeight: 1080,
    defaultWidth: 1920,
    file: 'chroma.json'
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
      enableRemoteModule: true
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
    chromaWindow.webContents.send('window-resized');
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
      submenu: [
        { label: 'Cool beans'}
      ]
    }
  ];

  if (process.platform === 'darwin') {
    menuTemplate.unshift({});
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

const initialSetup = (): void => {
  createMainWindow();
  // Create menus
  // createMenus();
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

ipcMain.on('fullscreen-chroma-window', () => {
  chromaWindow && fullscreenBrowserWindow(chromaWindow);
});

ipcMain.on('bug:show', () => {
  chromaWindow && chromaWindow.webContents.send('bug:show');
});

ipcMain.on('bug:hide', () => {
  chromaWindow && chromaWindow.webContents.send('bug:hide');
});

ipcMain.on('video-play', () => {
  chromaWindow && chromaWindow.webContents.send('video-play');
});

ipcMain.on('video-stop', () => {
  chromaWindow && chromaWindow.webContents.send('video-stop');
});

ipcMain.on('video-ended', () => {
  mainWindow.webContents.send('video-ended');
});

ipcMain.on('webcam:start', (event, deviceId) => {
  chromaWindow && chromaWindow.webContents.send('webcam:start', deviceId);
});

ipcMain.on('webcam:stop', () => {
  chromaWindow && chromaWindow.webContents.send('webcam:stop');
});


ipcMain.on('commentators-show', () => {
  chromaWindow && chromaWindow.webContents.send('commentators-show');
});

ipcMain.on('commentators-hide', () => {
  chromaWindow && chromaWindow.webContents.send('commentators-hide');
});

ipcMain.on('commentator-names-update', (event, names) => {
  chromaWindow && chromaWindow.webContents.send('commentator-names-update', names);
  event.sender.send('comms:updated', names);
});

ipcMain.on('scoreboard:show', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:show');
});

ipcMain.on('scoreboard:hide', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:hide');
});


// Choose Logo File
ipcMain.on('bug:choose', (event) => {
  const options: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
  };

  dialog
    .showOpenDialog(mainWindow, options)
    .then((result) => {
      const path = `file:${result.filePaths[0]}`;
      event.sender.send('bug:chosen', path);
    })
    .catch((err) => {
      console.error(err);
    });
});


ipcMain.on('bug:updated', (event, path) => {
  chromaWindow && chromaWindow.webContents.send('bug:updated', path);
  event.sender.send('bug:updated', path);
});


// Choose Video File
ipcMain.on('video:choose', (event) => {
  const options: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [{ name: 'Movies', extensions: ['mov', 'mp4', 'avi', 'mpeg', 'mpg', 'mkv'] }],
  };

  dialog
    .showOpenDialog(mainWindow, options)
    .then((result) => {
      const path = `file:${result.filePaths[0]}`;
      event.sender.send('video:chosen', path);
    })
    .catch((err) => {
      console.error(err);
    });
});

ipcMain.on('video:updated', (event, path) => {
  chromaWindow && chromaWindow.webContents.send('video:updated', path);
  event.sender.send('video:updated', path);
});

// Overlay

ipcMain.on('overlay:add', (event) => {
  const options: OpenDialogOptions = {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
  };

  dialog
    .showOpenDialog(mainWindow, options)
    .then((result) => {
      const paths = result.filePaths.map(path => {
        return `file:${path}`;
      }) ;
      event.sender.send('overlay:chosen', paths);
    })
    .catch((err) => {
      console.error(err);
    });
});

ipcMain.on('overlay:updated', (event, paths) => {
//   const filesArray = [];
//   paths.forEach((path, index) => {
//     let imagePath = `file:${path}`;
//     let currentLength = document.querySelectorAll(".images_holder__image").length;
//     let order;

//     if (currentLength == 0) {
//     order = index;
//     } else {
//     order = currentLength + index;
//     }
//     downloadImage(imagePath, order);

//     filesArray.push(imagePath);
//   });

//  return addImages(filesArray);
});

// Webcam
ipcMain.on('webcam:select', (event, deviceId) => {
  chromaWindow && chromaWindow.webContents.send('webcam:updated', deviceId);
  event.sender.send('webcam:updated', deviceId);
});

// Scoreboard

ipcMain.on('scoreboard:updated', (event, settings) => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:updated', settings);
  event.sender.send('scoreboard:updated', settings);
});

ipcMain.on('scoreboard:discipline:updated', (event, disc) => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:discipline:updated', disc);
  event.sender.send('scoreboard:discipline:updated', disc);
});

ipcMain.on('scoreboard:point:red', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:point:red');
});

ipcMain.on('scoreboard:point:blue', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:point:blue');
});

ipcMain.on('scoreboard:sub:red', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:sub:red');
});

ipcMain.on('scoreboard:sub:blue', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:sub:blue');
});

ipcMain.on('scoreboard:timeout:red', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:timeout:red');
});

ipcMain.on('scoreboard:timeout:blue', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:timeout:blue');
});

ipcMain.on('scoreboard:reset', () => {
  chromaWindow && chromaWindow.webContents.send('scoreboard:reset');
});

// Team Names
ipcMain.on('teams:updated', (event, teamNames) => {
  chromaWindow && chromaWindow.webContents.send('teams:updated', teamNames);
  event.sender.send('teams:updated', teamNames);
})