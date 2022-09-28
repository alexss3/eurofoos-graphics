import { ipcRenderer } from 'electron';
import gsap from 'gsap';

ipcRenderer.on('stinger:play', () => {
    // animation
    const timeline = gsap.timeline();
    // get the current value for duration
    const stingerEl = document.getElementById('stinger');
    const imageEl = stingerEl.getElementsByTagName('img')[0];
    const duration = parseInt(stingerEl.dataset.duration, 10);
    const width = imageEl.width;
  
    timeline.to('#stinger', {
      duration: duration / 1000, // convert to seconds
      x: width * 2, // calculate based on the width of the image
      overwrite: true,
      onComplete: function () {
        this.pause(0);
      }
    });
  });
