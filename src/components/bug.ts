import { ipcRenderer } from 'electron';

import gsap from 'gsap';

ipcRenderer.on('bug:show', () => {
  gsap.timeline()
    .to('#bug', {
      duration: 1,
      x: "-20vw",
      ease: "sine.out"
    })
});

ipcRenderer.on('bug:hide', () => {
  const bugTimeline = gsap.timeline();
  // Rotate once, then slide out right
  bugTimeline
    .to('#bug', {
      duration: 1,
      x: "20vw",
    });
});
