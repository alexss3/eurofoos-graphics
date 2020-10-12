import { ipcRenderer } from 'electron';

import gsap from 'gsap';

ipcRenderer.on('commentators-show', () => {
  // animation
  const timeline = gsap.timeline();

  timeline.to('#commentators', {
    duration: 1,
    y: '-33vh',
    overwrite: true,
  });
});

ipcRenderer.on('commentators-hide', () => {
  // animation
  const timeline = gsap.timeline();

  timeline.to('#commentators', {
    duration: 1,
    y: '33vh',
    overwrite: true,
  });
});
