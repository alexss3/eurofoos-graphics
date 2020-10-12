import { app, BrowserWindow, ipcMain, powerSaveBlocker } from 'electron';
import * as path from 'path';
// import { HyperdeckServer } from 'hyperdeck-server-connection';

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
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
};

const createChromaWindow = (): void => {
  chromaWindow = new BrowserWindow({
    height: 400,
    width: 400,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
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

const fullscreenChromaWindow = (): void => {
  if (chromaWindow) {
    chromaWindow.setFullScreen(!checkWindowFullscreen(chromaWindow));
  }
};

// const createHyperdeckServer = () => {
//   const server = new HyperdeckServer('127.0.0.1');

//   server.onPlay = async (cmd): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       console.log('playing', cmd);
//       resolve();
//     });
//   };

// s.onGoTo = cmd =>{
// clipID = cmd.parameters['clip id'];
// return Promise.resolve()};

// s.onClipsAdd = cmd => {console.log('CLIP ADD',cmd)};
// s.onClipsClear = cmd => {console.log('CLIP CLEAR',cmd)};

// s.onClipsCount = cmd => {
//     console.log('CLIP COUNT',cmd);
// return Promise.resolve({'clip count': clips.length})};

// s.onClipsGet = cmd => {
//     var result = {}
//     let i = 1;
//     clips.forEach(
//       clip => {result[i] = " " + clip.name +" 00:00:00:00 00:24:02:00";
//       i = i + 1;
//     });
//     return Promise.resolve(result)};

// s.onConfiguration = cmd => {
// console.log('CONFIG',cmd)
// return Promise.resolve();
// };

// s.onDeviceInfo = cmd => {
//     console.log('DEV INFO',cmd);
//     return Promise.resolve();
// };

// s.onDiskList = cmd => {
//     let i = 1;
// console.log('DSK LIST',cmd);
// var res = {'slot id': 1};
// clips.forEach(clip =>{
//     res[i] = clip.name +"  QuickTimeUncompressed " + videoFormat +" 24:00:02:00";
//     i = i+1;
// })

// return Promise.resolve(res);
// };

// s.onFormat = cmd => {console.log('FORMAT',cmd)};

// s.onIdentify = cmd => {
// console.log('IDENTIFY',cmd)
// return Promise.resolve();};

// s.onJog = cmd => {console.log('JOG',cmd)};

// s.onPlayrangeClear = cmd => {console.log('Play Clear',cmd)};

// s.onPlayrangeSet = cmd => {console.log('Playrange set',cmd)};

// s.onPreview = cmd => {
//     preview = 'true'
//     return Promise.resolve();
// };
// s.onRecord = cmd => {};

// s.onRemote = cmd => {return Promise.resolve({'enabled':"true",'override':"false"})}; ;

// s.onShuttle = cmd => {console.log('SHTTL',cmd)};

// s.onSlotInfo = cmd => {console.log('INFO',cmd)
// return Promise.resolve({
// 'slot id': 1,
// 'status': "mounted",
// 'volume name': "Playout Bee",
// 'recording time': 0,
// 'video format': videoFormat
// })};

// s.onSlotSelect = cmd => {
// console.log('Slotselct',cmd);
// return Promise.resolve();};

// s.onStop = cmd => {
// status = "stopped";
// playerStop();
// return Promise.resolve();
// };

// s.onTransportInfo = cmd => {
// let res = {
//     'status': status,
//     'speed' : speed,
//     'slot id': 1,
//     'display timecode': displayTimecode,
//     'timecode': timecode,
//     'clip id' : clipID,
//     'video format': videoFormat,
//     'loop' : loop
// };
// updateTC();
// return Promise.resolve(res)};

// s.onUptime = cmd => {console.log('Recived',cmd)};
// s.onWatchdog = cmd => {console.log('Recived',cmd)};
// };

const initialSetup = () => {
  createMainWindow();
  // createHyperdeckServer();
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
  createChromaWindow();
});

ipcMain.on('fullscreen-chroma-window', () => {
  fullscreenChromaWindow();
});

ipcMain.on('bug-show', () => {
  chromaWindow.webContents.send('bug-show');
});

ipcMain.on('bug-hide', () => {
  chromaWindow.webContents.send('bug-hide');
});

ipcMain.on('video-play', () => {
  chromaWindow.webContents.send('video-play');
});

ipcMain.on('video-stop', () => {
  chromaWindow.webContents.send('video-stop');
});

ipcMain.on('commentators-show', () => {
  chromaWindow.webContents.send('commentators-show');
});

ipcMain.on('commentators-hide', () => {
  chromaWindow.webContents.send('commentators-hide');
});

ipcMain.on('commentator-names-update', (e, ...args) => {
  chromaWindow.webContents.send('commentator-names-update', ...args);
});
