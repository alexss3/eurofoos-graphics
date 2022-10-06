import { ipcRenderer } from 'electron';
import eventMap from '../config/events';

let timer: NodeJS.Timeout;

const countdown = document.getElementById('countdown');

ipcRenderer.on(eventMap.COUNTDOWN.SHOW, () => {
  const countdownFrom = parseInt(countdown.dataset.value, 10);
  let remainingSeconds: number = countdownFrom * 60;

  timer = setInterval(() => {
    if (remainingSeconds >= 0) {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      countdown.innerText = `${minutes}:${paddedSeconds}`;
      remainingSeconds -= 1;
    } else {
      clearInterval(timer);
    }
  }, 1000);
});

ipcRenderer.on(eventMap.COUNTDOWN.HIDE, () => {
  countdown.innerText = '';
  clearInterval(timer);
});
