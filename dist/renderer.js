"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
// CHROMA WINDOW
var launchChromaButton = document.getElementById('launch-chroma-btn');
launchChromaButton.addEventListener('click', function (e) {
    e.preventDefault();
    electron_1.ipcRenderer.send('chroma');
});
// BUG
var bugToggleButton = document.getElementById('bug-toggle');
bugToggleButton.addEventListener('click', function (e) {
    e.preventDefault();
    var state = bugToggleButton.getAttribute('data-state');
    if (state === 'off') {
        electron_1.ipcRenderer.send('bug-show');
        bugToggleButton.setAttribute('data-state', 'on');
        bugToggleButton.classList.remove('green');
        bugToggleButton.classList.add('red');
        bugToggleButton.classList.add('pulse');
        bugToggleButton.children[1].innerHTML = 'HIDE';
    }
    else {
        electron_1.ipcRenderer.send('bug-hide');
        bugToggleButton.setAttribute('data-state', 'off');
        bugToggleButton.classList.remove('red');
        bugToggleButton.classList.remove('pulse');
        bugToggleButton.classList.add('green');
        bugToggleButton.children[1].innerHTML = 'SHOW';
    }
});
// VIDEO PLAYER
var videoPlayButton = document.getElementById('video-play');
videoPlayButton.addEventListener('click', function (e) {
    e.preventDefault();
    var state = videoPlayButton.getAttribute('data-state');
    if (state === 'off') {
        electron_1.ipcRenderer.send('video-play');
        videoPlayButton.setAttribute('data-state', 'on');
        videoPlayButton.classList.remove('green');
        videoPlayButton.classList.add('red');
        videoPlayButton.classList.add('pulse');
        videoPlayButton.children[1].innerHTML = 'STOP';
    }
    else {
        electron_1.ipcRenderer.send('video-stop');
        videoPlayButton.setAttribute('data-state', 'off');
        videoPlayButton.classList.add('green');
        videoPlayButton.classList.remove('red');
        videoPlayButton.classList.remove('pulse');
        videoPlayButton.children[1].innerHTML = 'PLAY';
    }
});
//# sourceMappingURL=renderer.js.map