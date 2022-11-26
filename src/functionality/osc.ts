import { ipcRenderer } from 'electron';
import * as OSC from 'osc-js';
import eventMap from '../config/events';

const osc = new OSC({
  plugin: new OSC.DatagramPlugin({
    type: 'udp4',
    open: {
      host: 'localhost',
      port: 8080,
      exclusive: false,
    },
    send: {
      host: '127.0.0.1', // @param {string} Hostname of udp client for messaging
      port: 8282, // @param {number} Port of udp client for messaging
    },
  }),
});

const ROOT_PATH = '/eurofooslive';

osc.open();

osc.on('open', () => {
  console.log(`OSC running on port ${osc.options.plugin.options.open.port}`);
});

osc.on(ROOT_PATH + '/bug-toggle', () => {
  document.getElementById('bug-toggle').click();
});

osc.on(ROOT_PATH + '/play-video', () => {
  console.log('Playing the video...');
  document.getElementById('video-play').click();
});

osc.on(ROOT_PATH + '/show-comms', () => {
  document.getElementById('commentators-toggle').click();
});

osc.on(ROOT_PATH + '/show-webcam', () => {
  document.getElementById('webcam-toggle').click();
});

osc.on(ROOT_PATH + '/red/point', () => {
  ipcRenderer.send(eventMap.SCOREBOARD.POINT.RED);
});

osc.on(ROOT_PATH + '/blue/point', () => {
  ipcRenderer.send(eventMap.SCOREBOARD.POINT.BLUE);
});

osc.on(ROOT_PATH + '/red/sub', () => {
  ipcRenderer.send(eventMap.SCOREBOARD.SUBTRACT.RED);
});

osc.on(ROOT_PATH + '/blue/sub', () => {
  ipcRenderer.send(eventMap.SCOREBOARD.SUBTRACT.BLUE);
});

osc.on(ROOT_PATH + '/red/timeout', () => {
  ipcRenderer.send(eventMap.SCOREBOARD.TIMEOUT.RED);
});

osc.on(ROOT_PATH + '/blue/timeout', () => {
  ipcRenderer.send(eventMap.SCOREBOARD.TIMEOUT.BLUE);
});

osc.on(ROOT_PATH + '/scoreboard/reset', () => {
  ipcRenderer.send(eventMap.SCOREBOARD.RESET);
});

osc.on(ROOT_PATH + '/stinger/play', () => {
  document.getElementById('stinger-toggle').click();
});

osc.on(ROOT_PATH + '/countdown/show', () => {
  document.getElementById('countdown-toggle').click();
});

osc.on(ROOT_PATH + '/countdown/hide', () => {
  document.getElementById('countdown-toggle').click();
});

osc.on(ROOT_PATH + '/webcam/toggle', () => {
  document.getElementById('webcam-toggle').click();
});

osc.on(ROOT_PATH + '/rankings/toggle', () => {
  document.getElementById('rankings-toggle').click();
});
