"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
// import { HyperdeckServer } from 'hyperdeck-server-connection';
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
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Hide the cursor from view, else it will
    // appear in the chroma key
    chromaWindow.webContents.on('dom-ready', function () {
        var css = '* {cursor: none !important; }';
        chromaWindow.webContents.insertCSS(css);
    });
    var id = electron_1.powerSaveBlocker.start('prevent-display-sleep');
    chromaWindow.loadFile(path.join(__dirname, '../src/windows/chroma.html'));
    chromaWindow.on('resize', function () {
        chromaWindow.webContents.send('window-resized');
    });
    chromaWindow.on('closed', function () {
        chromaWindow = null;
        electron_1.powerSaveBlocker.stop(id);
    });
};
var checkWindowFullscreen = function (window) {
    return window && window.isFullScreen();
};
var fullscreenChromaWindow = function () {
    if (chromaWindow) {
        chromaWindow.setFullScreen(!checkWindowFullscreen(chromaWindow));
    }
};
var initialSetup = function () {
    createMainWindow();
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', initialSetup);
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
electron_1.ipcMain.on('chroma', function () {
    createChromaWindow();
});
electron_1.ipcMain.on('fullscreen-chroma-window', function () {
    fullscreenChromaWindow();
});
electron_1.ipcMain.on('bug-show', function () {
    chromaWindow.webContents.send('bug-show');
});
electron_1.ipcMain.on('bug-hide', function () {
    chromaWindow.webContents.send('bug-hide');
});
electron_1.ipcMain.on('video-play', function () {
    chromaWindow.webContents.send('video-play');
});
electron_1.ipcMain.on('video-stop', function () {
    chromaWindow.webContents.send('video-stop');
});
electron_1.ipcMain.on('video-ended', function () {
    mainWindow.webContents.send('video-ended');
});
electron_1.ipcMain.on('commentators-show', function () {
    chromaWindow.webContents.send('commentators-show');
});
electron_1.ipcMain.on('commentators-hide', function () {
    chromaWindow.webContents.send('commentators-hide');
});
electron_1.ipcMain.on('commentator-names-update', function (e) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = chromaWindow.webContents).send.apply(_a, __spreadArrays(['commentator-names-update'], args));
});
//# sourceMappingURL=index.js.map