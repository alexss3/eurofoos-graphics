"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var windowStateKeeper = require("electron-window-state");
// import events from './functionality/events';
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
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
};
var createChromaWindow = function () {
    var chromaWindowState = windowStateKeeper({
        defaultHeight: 1080,
        defaultWidth: 1920,
        file: 'chroma.json'
    });
    chromaWindow = new electron_1.BrowserWindow({
        height: chromaWindowState.height,
        width: chromaWindowState.width,
        x: chromaWindowState.x,
        y: chromaWindowState.y,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            backgroundThrottling: false,
            enableRemoteModule: true
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
    chromaWindowState.manage(chromaWindow);
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
var fullscreenBrowserWindow = function (window) {
    window && window.setFullScreen(!checkWindowFullscreen(window));
};
var createMenus = function () {
    /* eslint-disable-next-line */
    var menuTemplate = [
        {
            label: 'File',
            submenu: [
                { label: 'Cool beans' }
            ]
        }
    ];
    if (process.platform === 'darwin') {
        menuTemplate.unshift({});
    }
    var menu = electron_1.Menu.buildFromTemplate(menuTemplate);
    electron_1.Menu.setApplicationMenu(menu);
};
var initialSetup = function () {
    createMainWindow();
    // Create menus
    // createMenus();
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
    if (!chromaWindow) {
        createChromaWindow();
    }
    else {
        chromaWindow.focus();
    }
});
electron_1.ipcMain.on('fullscreen-chroma-window', function () {
    chromaWindow && fullscreenBrowserWindow(chromaWindow);
});
electron_1.ipcMain.on('bug:show', function () {
    chromaWindow && chromaWindow.webContents.send('bug:show');
});
electron_1.ipcMain.on('bug:hide', function () {
    chromaWindow && chromaWindow.webContents.send('bug:hide');
});
electron_1.ipcMain.on('video-play', function () {
    chromaWindow && chromaWindow.webContents.send('video-play');
});
electron_1.ipcMain.on('video-stop', function () {
    chromaWindow && chromaWindow.webContents.send('video-stop');
});
electron_1.ipcMain.on('video-ended', function () {
    mainWindow.webContents.send('video-ended');
});
electron_1.ipcMain.on('webcam:start', function (event, deviceId) {
    chromaWindow && chromaWindow.webContents.send('webcam:start', deviceId);
});
electron_1.ipcMain.on('webcam:stop', function () {
    chromaWindow && chromaWindow.webContents.send('webcam:stop');
});
electron_1.ipcMain.on('commentators-show', function () {
    chromaWindow && chromaWindow.webContents.send('commentators-show');
});
electron_1.ipcMain.on('commentators-hide', function () {
    chromaWindow && chromaWindow.webContents.send('commentators-hide');
});
electron_1.ipcMain.on('commentator-names-update', function (event, names) {
    chromaWindow && chromaWindow.webContents.send('commentator-names-update', names);
    event.sender.send('comms:updated', names);
});
electron_1.ipcMain.on('scoreboard:show', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:show');
});
electron_1.ipcMain.on('scoreboard:hide', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:hide');
});
// Choose Logo File
electron_1.ipcMain.on('bug:choose', function (event) {
    var options = {
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
    };
    electron_1.dialog
        .showOpenDialog(mainWindow, options)
        .then(function (result) {
        var path = "file:" + result.filePaths[0];
        event.sender.send('bug:chosen', path);
    })["catch"](function (err) {
        console.error(err);
    });
});
electron_1.ipcMain.on('bug:updated', function (event, path) {
    chromaWindow && chromaWindow.webContents.send('bug:updated', path);
    event.sender.send('bug:updated', path);
});
// Choose Video File
electron_1.ipcMain.on('video:choose', function (event) {
    var options = {
        properties: ['openFile'],
        filters: [{ name: 'Movies', extensions: ['mov', 'mp4', 'avi', 'mpeg', 'mpg', 'mkv'] }]
    };
    electron_1.dialog
        .showOpenDialog(mainWindow, options)
        .then(function (result) {
        var path = "file:" + result.filePaths[0];
        event.sender.send('video:chosen', path);
    })["catch"](function (err) {
        console.error(err);
    });
});
electron_1.ipcMain.on('video:updated', function (event, path) {
    chromaWindow && chromaWindow.webContents.send('video:updated', path);
    event.sender.send('video:updated', path);
});
// Overlay
electron_1.ipcMain.on('overlay:add', function (event) {
    var options = {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
    };
    electron_1.dialog
        .showOpenDialog(mainWindow, options)
        .then(function (result) {
        var paths = result.filePaths.map(function (path) {
            return "file:" + path;
        });
        event.sender.send('overlay:chosen', paths);
    })["catch"](function (err) {
        console.error(err);
    });
});
electron_1.ipcMain.on('overlay:updated', function (event, paths) {
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
electron_1.ipcMain.on('webcam:select', function (event, deviceId) {
    chromaWindow && chromaWindow.webContents.send('webcam:updated', deviceId);
    event.sender.send('webcam:updated', deviceId);
});
// Scoreboard
electron_1.ipcMain.on('scoreboard:updated', function (event, settings) {
    chromaWindow && chromaWindow.webContents.send('scoreboard:updated', settings);
    event.sender.send('scoreboard:updated', settings);
});
electron_1.ipcMain.on('scoreboard:discipline:updated', function (event, disc) {
    chromaWindow && chromaWindow.webContents.send('scoreboard:discipline:updated', disc);
    event.sender.send('scoreboard:discipline:updated', disc);
});
electron_1.ipcMain.on('scoreboard:point:red', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:point:red');
});
electron_1.ipcMain.on('scoreboard:point:blue', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:point:blue');
});
electron_1.ipcMain.on('scoreboard:sub:red', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:sub:red');
});
electron_1.ipcMain.on('scoreboard:sub:blue', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:sub:blue');
});
electron_1.ipcMain.on('scoreboard:timeout:red', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:timeout:red');
});
electron_1.ipcMain.on('scoreboard:timeout:blue', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:timeout:blue');
});
electron_1.ipcMain.on('scoreboard:reset', function () {
    chromaWindow && chromaWindow.webContents.send('scoreboard:reset');
});
// Team Names
electron_1.ipcMain.on('teams:updated', function (event, teamNames) {
    chromaWindow && chromaWindow.webContents.send('teams:updated', teamNames);
    event.sender.send('teams:updated', teamNames);
});
//# sourceMappingURL=index.js.map