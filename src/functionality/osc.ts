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