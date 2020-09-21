"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    electron_1.app.quit();
}
var mainWindow;
var chromaWindow;
var createMainWindow = function () {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 1200,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
};
var createChromaWindow = function () {
    chromaWindow = new electron_1.BrowserWindow({
        height: 400,
        width: 400,
        autoHideMenuBar: true
    });
    var id = electron_1.powerSaveBlocker.start('prevent-display-sleep');
    chromaWindow.loadFile(path.join(__dirname, '../src/windows/chroma.html'));
    chromaWindow.on('closed', function () {
        chromaWindow = null;
        electron_1.powerSaveBlocker.stop(id);
    });
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createMainWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
electron_1.ipcMain.on('chroma', function (e) {
    createChromaWindow();
});
//# sourceMappingURL=index.js.map