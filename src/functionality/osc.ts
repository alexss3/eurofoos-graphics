import { ipcRenderer } from 'electron';
import * as OSC from 'osc-js';

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

osc.open();

osc.on('open', () => {
  console.log(`OSC running on port ${osc.options.plugin.options.open.port}`);
});

osc.on('/eurofooslive/bug-toggle', () => {
  document.getElementById('bug-toggle').click();
});

osc.on('/eurofooslive/play-video', () => {
  console.log('Playing the video...');
  document.getElementById('video-play').click();
});

osc.on('/eurofooslive/show-comms', () => {
  document.getElementById('commentators-toggle').click();
});

osc.on('/eurofooslive/show-webcam', () => {
  document.getElementById('webcam-toggle').click();
});

osc.on('/eurofooslive/red/point', () => {
  ipcRenderer.send('scoreboard:point:red');
});

osc.on('/eurofooslive/blue/point', () => {
  ipcRenderer.send('scoreboard:point:blue');
});

osc.on('/eurofooslive/red/sub', () => {
  ipcRenderer.send('scoreboard:sub:red');
});

osc.on('/eurofooslive/blue/sub', () => {
  ipcRenderer.send('scoreboard:sub:blue');
});

osc.on('/eurofooslive/red/timeout', () => {
  ipcRenderer.send('scoreboard:timeout:red');
});

osc.on('/eurofooslive/blue/timeout', () => {
  ipcRenderer.send('scoreboard:timeout:blue');
});

osc.on('/eurofooslive/scoreboard/reset', () => {
  ipcRenderer.send('scoreboard:reset');
});