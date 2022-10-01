const eventMap = {
  CHROMA: {
    FULLSCREEN: 'fullscreen-chroma-window',
    RESIZE: 'chroma:resize',
    CLOSED: 'chroma:closed',
  },
  BUG: {
    SHOW: 'bug:show',
    HIDE: 'bug:hide',
    CHOOSE: 'bug:choose',
    CHOSEN: 'bug:chosen',
    UPDATED: 'bug:updated',
  },
  STINGER: {
    PLAY: 'stinger:play',
    CHOOSE: 'stinger:choose',
    CHOSEN: 'stinger:chosen',
    UPDATED: 'stinger:updated',
  },
  VIDEO: {
    PLAY: 'video:play',
    STOP: 'video:stop',
    ENDED: 'video:ended',
    CHOOSE: 'video:choose',
    CHOSEN: 'video:chosen',
    UPDATED: 'video:updated',
  },
  WEBCAM: {
    START: 'webcam:start',
    STOP: 'webcam:stop',
    SELECT: 'webcam:select',
    UPDATED: 'webcam:updated',
  },
  COMMENTATORS: {
    SHOW: 'commentators:show',
    HIDE: 'commentators:hide',
    TOGGLE: 'commentators:toggle',
    NAMES: 'commentators:names:updated',
    UPDATED: 'commentators:updated',
  },
  SCOREBOARD: {
    SHOW: 'scoreboard:show',
    HIDE: 'scoreboard:hide',
    UPDATED: 'scoreboard:updated',
    DISCIPLINE: {
      UPDATED: 'scoreboard:discipline:updated',
    },
    POINT: {
      RED: 'scoreboard:point:red',
      BLUE: 'scoreboard:point:blue',
    },
    SUBTRACT: {
      RED: 'scoreboard:sub:red',
      BLUE: 'scoreboard:sub:blue',
    },
    TIMEOUT: {
      RED: 'scoreboard:timeout:red',
      BLUE: 'scoreboard:timeout:blue',
    },
    RESET: 'scoreboard:reset',
  },
  COUNTDOWN: {
    SHOW: 'countdown:show',
    HIDE: 'countdown:hide',
    UPDATED: 'countdown:updated',
    RESET: 'countdown:reset',
  },
};

export default eventMap;
