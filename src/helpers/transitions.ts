import gsap from 'gsap';

const bug = document.getElementById('bug_transition');

const reset = (side: HTMLElement, ease: string): void => {
  gsap.to(side, {
    opacity: 0,
    clipPath: `inset(0%, 0%, 0%, 0%)`,
    transform: `translateX(0px)`,
    ease,
  });
};

const transition = (state: string, position: string): void => {
  let side: HTMLElement;
  let wipeDirection: string;

  if (position === 'bug') {
    side = bug;
    wipeDirection = `0% 0% 100% 0%`;
  }

  const ease = Power2.easeInOut;
  const slideDirection = '50px';

  if (state === 'ON') {
    gsap.to(side, {
      opacity: '1',
      clipPath: `inset(${wipeDirection})`,
      ease,
    });
    gsap.to(side, {
      clipPath: `inset(0% 0% 0% 0%)`,
      ease,
    });
  } else {
    gsap.to(side, {
      opacity: '1',
      clipPath: `inset(${wipeDirection})`,
      ease,
      onComplete: reset,
      onCompleteParams: [side, wipeDirection, slideDirection, ease],
    });
  }
};

export default transition;
