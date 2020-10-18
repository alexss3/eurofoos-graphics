"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
// CHROMA WINDOW
var launchChromaButton = document.getElementById('launch-chroma-btn');
launchChromaButton.addEventListener('click', function (e) {
    e.preventDefault();
    electron_1.ipcRenderer.send('chroma');
});
// Bottom Nav Buttons
var bottomNavButtons = document.querySelectorAll('#footer-nav li a');
var pagesArray = document.querySelectorAll('div.page');
bottomNavButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        pagesArray.forEach(function (page, index) {
            var btnId = button.parentElement.id;
            var btnMatch = 'page-' + btnId.split('bottom-nav-')[1];
            console.log(btnMatch);
            if ("" + page.id !== btnMatch) {
                // hide
                pagesArray[index].style.display = 'none';
                bottomNavButtons[index].parentElement.classList.remove('selected');
                bottomNavButtons[index].parentElement.setAttribute('data-state', 'off');
            }
            else {
                // show
                pagesArray[index].style.display = 'block';
                bottomNavButtons[index].parentElement.classList.add('selected');
                bottomNavButtons[index].parentElement.setAttribute('data-state', 'on');
            }
        });
    });
});
// BUG
var bugToggleButton = document.getElementById('bug-toggle');
bugToggleButton.addEventListener('click', function (e) {
    e.preventDefault();
    var state = bugToggleButton.getAttribute('data-state');
    if (state === 'off') {
        electron_1.ipcRenderer.send('bug:show');
        bugToggleButton.setAttribute('data-state', 'on');
        bugToggleButton.classList.remove('green');
        bugToggleButton.classList.add('red');
        bugToggleButton.classList.add('pulse');
    }
    else {
        electron_1.ipcRenderer.send('bug:hide');
        bugToggleButton.setAttribute('data-state', 'off');
        bugToggleButton.classList.remove('red');
        bugToggleButton.classList.remove('pulse');
        bugToggleButton.classList.add('green');
    }
});
// Choose Bug File
var asyncBugImage = new Image();
var chooseBugButton = document.getElementById('choose-bug');
var bugFilePath = document.getElementById('bug-path');
var inlineBugPreview = document.getElementById('inline-bug-preview');
chooseBugButton.addEventListener('click', function () {
    electron_1.ipcRenderer.send('bug:choose');
});
electron_1.ipcRenderer.on('bug:chosen', function (event, path) {
    bugFilePath.value = path.split('file:')[1];
    asyncBugImage.src = path;
    asyncBugImage.onload = function () {
        inlineBugPreview.src = path;
        electron_1.ipcRenderer.send('bug:updated', path);
    };
    asyncBugImage.addEventListener('error', function () {
        inlineBugPreview.src = null;
        console.log('Could not load image');
    });
});
// VIDEO PLAYER
var videoPlayButton = document.getElementById('video-play');
var videoChooseButton = document.getElementById('choose-video');
var videoFilePath = document.getElementById('video-path');
videoChooseButton.addEventListener('click', function () {
    electron_1.ipcRenderer.send('video:choose');
});
electron_1.ipcRenderer.on('video:chosen', function (event, path) {
    videoFilePath.value = path.split('file:')[1];
    electron_1.ipcRenderer.send('video:updated', path);
});
videoPlayButton.addEventListener('click', function (e) {
    e.preventDefault();
    var state = videoPlayButton.getAttribute('data-state');
    if (state === 'off') {
        electron_1.ipcRenderer.send('video-play');
        videoPlayButton.setAttribute('data-state', 'on');
        videoPlayButton.classList.remove('green');
        videoPlayButton.classList.add('red');
        videoPlayButton.classList.add('pulse');
    }
    else {
        electron_1.ipcRenderer.send('video-stop');
        videoPlayButton.setAttribute('data-state', 'off');
        videoPlayButton.classList.add('green');
        videoPlayButton.classList.remove('red');
        videoPlayButton.classList.remove('pulse');
    }
});
electron_1.ipcRenderer.on('video-ended', function () {
    videoPlayButton.setAttribute('data-state', 'off');
    videoPlayButton.classList.add('green');
    videoPlayButton.classList.remove('red');
    videoPlayButton.classList.remove('pulse');
});
// WEBCAM
var webcamButton = document.getElementById('webcam-toggle');
webcamButton.addEventListener('click', function (e) {
    e.preventDefault();
    var state = webcamButton.getAttribute('data-state');
    if (state === 'off') {
        electron_1.ipcRenderer.send('webcam:start');
        webcamButton.setAttribute('data-state', 'on');
        webcamButton.classList.remove('green');
        webcamButton.classList.add('red');
        webcamButton.classList.add('pulse');
    }
    else {
        electron_1.ipcRenderer.send('webcam:stop');
        webcamButton.setAttribute('data-state', 'off');
        webcamButton.classList.add('green');
        webcamButton.classList.remove('red');
        webcamButton.classList.remove('pulse');
    }
});
// ipcRenderer.on('video-ended', () => {
//   webcamButton.setAttribute('data-state', 'off');
//   webcamButton.classList.add('green');
//   webcamButton.classList.remove('red');
//   webcamButton.classList.remove('pulse');
//   webcamButton.children[1].innerHTML = 'PLAY';
// });
// COMMENTATORS
var commentatorsButton = document.getElementById('commentators-toggle');
commentatorsButton.addEventListener('click', function (e) {
    e.preventDefault();
    var state = commentatorsButton.getAttribute('data-state');
    if (state === 'off') {
        electron_1.ipcRenderer.send('commentators-show');
        commentatorsButton.setAttribute('data-state', 'on');
        commentatorsButton.classList.remove('green');
        commentatorsButton.classList.add('red');
        commentatorsButton.classList.add('pulse');
    }
    else {
        electron_1.ipcRenderer.send('commentators-hide');
        commentatorsButton.setAttribute('data-state', 'off');
        commentatorsButton.classList.add('green');
        commentatorsButton.classList.remove('red');
        commentatorsButton.classList.remove('pulse');
    }
});
var commentatorUpdateButton = document.getElementById('commentators-update');
var commentatorOneTitle = document.getElementById('commentator-one');
var commentatorTwoTitle = document.getElementById('commentator-two');
commentatorUpdateButton.addEventListener('click', function (e) {
    e.preventDefault();
    // send the values of the commentator names to ipcMain then to chroma window
    var payload = [
        { name: commentatorOneTitle.value },
        { name: commentatorTwoTitle.value }
    ];
    electron_1.ipcRenderer.send('commentator-names-update', payload);
});
electron_1.ipcRenderer.on('comms:updated', function (event, names) {
    commentatorOneTitle.value = names[0].name;
    commentatorTwoTitle.value = names[1].name;
});
// Overlay
var chooseOverlayButton = document.getElementById('overlay-add');
chooseOverlayButton.addEventListener('click', function () {
    electron_1.ipcRenderer.send('overlay:add');
});
electron_1.ipcRenderer.on('overlay:chosen', function (event, paths) {
    electron_1.ipcRenderer.send('overlay:updated', paths);
});
//# sourceMappingURL=renderer.js.map