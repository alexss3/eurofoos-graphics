import { ipcRenderer } from 'electron';
import eventMap from '../config/events';
import gsap from 'gsap';

ipcRenderer.on(eventMap.BUG.SHOW, () => {
  gsap.timeline().to('#bug', {
    duration: 1,
    x: '-20vw',
    ease: 'sine.out',
  });
});

ipcRenderer.on(eventMap.BUG.HIDE, () => {
  const bugTimeline = gsap.timeline();
  // Rotate once, then slide out right
  bugTimeline.to('#bug', {
    duration: 1,
    x: '20vw',
  });
});
