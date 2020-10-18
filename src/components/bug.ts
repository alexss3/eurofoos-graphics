import { ipcRenderer } from 'electron';

import gsap from 'gsap';

ipcRenderer.on('bug:show', () => {
  gsap.timeline()
    .to('#bug', {
      duration: 1,
      x: "-20vw",
      ease: "sine.out"
    })
    // .to('#bug', {
    //   duration: 1,
    //   rotationX: 360,
    //   transformOrigin: '50% 50%',
    //   repeat: -1,
    //   repeatDelay: 30
    // });
});

ipcRenderer.on('bug:hide', () => {
  const bugTimeline = gsap.timeline();
  // Rotate once, then slide out right
  bugTimeline
    // .to('#bug', {
    //   duration: 1,
    //   rotationX: -360,
    //   transformOrigin: '50% 50%',
    //   overwrite: true,
    // })
    .to('#bug', {
      duration: 1,
      x: "20vw",
    });
});
