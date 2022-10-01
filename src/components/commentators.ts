import { ipcRenderer } from 'electron';
import eventMap from '../config/events';
import gsap from 'gsap';

ipcRenderer.on(eventMap.COMMENTATORS.SHOW, () => {
  // animation
  const timeline = gsap.timeline();

  timeline.to('#commentators', {
    duration: 1,
    y: '-33vh',
    overwrite: true,
  });
});

ipcRenderer.on(eventMap.COMMENTATORS.HIDE, () => {
  // animation
  const timeline = gsap.timeline();

  timeline.to('#commentators', {
    duration: 1,
    y: '33vh',
    overwrite: true,
  });
});
