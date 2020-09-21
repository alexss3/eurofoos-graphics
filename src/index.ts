import { app, BrowserWindow, ipcMain, powerSaveBlocker } from 'electron';
import * as path from 'path';

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
  });

  const id = powerSaveBlocker.start('prevent-display-sleep');

  chromaWindow.loadFile(path.join(__dirname, '../src/windows/chroma.html'));

  chromaWindow.on('closed', () => {
    chromaWindow = null;
    powerSaveBlocker.stop(id);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

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
ipcMain.on('chroma', (e) => {
  createChromaWindow();
});
