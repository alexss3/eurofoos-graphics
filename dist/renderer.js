"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var launchChromaButton = document.getElementById('launch-chroma-btn');
launchChromaButton.addEventListener('click', function (e) {
    e.preventDefault();
    electron_1.ipcRenderer.send('chroma', 'open');
});
//# sourceMappingURL=renderer.js.map