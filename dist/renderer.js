"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var launchChromaButton = document.getElementById('launch-chroma-btn');
launchChromaButton.addEventListener('click', function (e) {
    e.preventDefault();
    electron_1.ipcRenderer.send('chroma');
});
var bugShowButton = document.getElementById('bug-show');
bugShowButton.addEventListener('click', function (e) {
    e.preventDefault();
    electron_1.ipcRenderer.send('bug-show');
});
//# sourceMappingURL=renderer.js.map