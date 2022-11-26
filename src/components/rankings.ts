import { ipcRenderer } from 'electron';
import eventMap from '../config/events';
import gsap from 'gsap';

type RankLine = {
  rank: number;
  name: string;
};

// default 30 seconds
const DELAY_BETWEEN_LISTS = 30;

const rankingContainer = document.getElementById('rankings');

const addRow = (line: RankLine): void => {
  const row = document.createElement('div');
  row.innerHTML = `<div class='rank'>${line.rank}</div><div class='name'>${line.name}</div>`;
  row.classList.add('line');
  rankingContainer.appendChild(row);

  gsap.timeline().from(row, {
    x: -1100,
    duration: 1,
    ease: 'easeInOut',
    delay: line.rank,
  });
};

const addRowAndRemove = (line: RankLine): void => {
  const row = document.createElement('div');
  row.innerHTML = `<div class='rank'>${line.rank}</div><div class='name'>${line.name}</div>`;
  row.classList.add('line');
  rankingContainer.appendChild(row);

  gsap.timeline().from(row, {
    x: -1100,
    duration: 1,
    ease: 'easeInOut',
    delay: line.rank,
  });

  gsap.timeline().to(row, {
    x: 1100,
    duration: 1,
    ease: 'easeInOut',
    delay: line.rank + (10 - line.rank + 5),
  });
};

const fullRankList: Array<Array<RankLine>> = [];

ipcRenderer.on(eventMap.RANKING.UPDATED, (event, data: string[]) => {
  if (data.length) {
    // console.log(data);
    // let stack: Array<RankLine> = [];
    data.forEach((line, index) => {
      // if ((index + 1) % 10) {
      //   console.log('1-9', line);
      //   // 1 - 9
      //   // push to stack
      //   stack.push({ rank: index + 1, name: line });
      // } else {
      //   console.log('10: ', line);
      //   // tenth item
      //   // dump stack
      //   stack.push({ rank: index + 1, name: line });
      //   fullRankList.push(stack);
      //   stack = [];
      // }
      addRow({ rank: index + 1, name: line });
    });

    // console.log(fullRankList);

    // if (fullRankList.length < 2) {
    //   fullRankList[0].forEach((row: RankLine) => {
    //     addRow(row);
    //   });
    // } else {
    //   fullRankList.forEach((rankList: Array<RankLine>, index) => {
    //     if (index > 0) {
    //       // add a delay
    //       setTimeout(() => {
    //         rankList.forEach((row: RankLine) => {
    //           addRowAndRemove(row);
    //         });
    //       }, DELAY_BETWEEN_LISTS * 1000);
    //     } else {
    //       rankList.forEach((row: RankLine) => {
    //         addRowAndRemove(row);
    //       });
    //     }
    //   });
    // }
  }
});

ipcRenderer.on(eventMap.RANKING.HIDE, () => {
  console.log('Hiding the rankings');
  rankingContainer.innerHTML = '';
});
