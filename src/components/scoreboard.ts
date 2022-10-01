import Scoreboard from '../helpers/classes/Scoreboard';
import { MatchSettings, ConfigData } from '../helpers/interfaces';
import * as storage from 'electron-json-storage';
import { Config } from '../config/config';
import eventMap from '../config/events';
import { ipcRenderer } from 'electron';
import gsap from 'gsap';

// Handle showing/hiding the scoreboard
const scoreboardWrapper = document.getElementById('scoreboard');
const scoreboardDiscipline = document.querySelector('#discipline span');

ipcRenderer.on(eventMap.SCOREBOARD.SHOW, () => {
  scoreboardWrapper.style.display = 'block';
  gsap.timeline().to('#scoreboard', {
    duration: 0.5,
    ease: 'sine.out',
    top: '75%',
  });
});

ipcRenderer.on(eventMap.SCOREBOARD.HIDE, () => {
  gsap.timeline().to('#scoreboard', {
    duration: 0.5,
    ease: 'sine.out',
    top: '130%',
  });
});

ipcRenderer.on(eventMap.SCOREBOARD.DISCIPLINE.UPDATED, (event, disc) => {
  scoreboardDiscipline.innerHTML = disc;
});

// Names
const redTeamName: any = document.querySelector('#red-team-name span');
const blueTeamName: any = document.querySelector('#blue-team-name span');

// Points
const redTeamPoints: any = document.querySelector('#red-team-points span');
const blueTeamPoints: any = document.querySelector('#blue-team-points span');

// Sets
const redTeamSets: any = document.querySelector('#red-team-sets span');
const blueTeamSets: any = document.querySelector('#blue-team-sets span');

// Timeouts
const redTeamTimeouts: any = document.querySelector('#red-team-timeouts span');
const blueTeamTimeouts: any = document.querySelector(
  '#blue-team-timeouts span'
);

const updateTeamNames = (teamNames: any): void => {
  redTeamName.innerHTML = teamNames.redTeam;
  blueTeamName.innerHTML = teamNames.blueTeam;
};

const updateTeamPoints = (red: number, blue: number): void => {
  redTeamPoints.innerHTML = red;
  blueTeamPoints.innerHTML = blue;
};

const updateTeamSets = (red: number, blue: number): void => {
  redTeamSets.innerHTML = red;
  blueTeamSets.innerHTML = blue;
};

const updateTeamTimeouts = (red: number, blue: number): void => {
  redTeamTimeouts.innerHTML = red;
  blueTeamTimeouts.innerHTML = blue;
};

const updateAllValues = (scoreboard: Scoreboard): void => {
  const values = {
    teamNames: {
      redTeam: scoreboard.redTeam.title,
      blueTeam: scoreboard.blueTeam.title,
    },
    points: [scoreboard.redTeam.points, scoreboard.blueTeam.points],
    sets: [scoreboard.redTeam.sets, scoreboard.blueTeam.sets],
    timeouts: [scoreboard.redTeam.timeouts, scoreboard.blueTeam.timeouts],
  };

  updateTeamNames(values.teamNames);
  updateTeamPoints(values.points[0], values.points[1]);
  updateTeamSets(values.sets[0], values.sets[1]);
  updateTeamTimeouts(values.timeouts[0], values.timeouts[1]);
};

// Scoreboard logic, must be done after loading settings
const configKey = Config.settings.key;
let scoreboardSettings: MatchSettings;
let scoreboard: Scoreboard;

storage.get(configKey, (err, data: ConfigData) => {
  if (err) throw Error(err);
  scoreboardSettings = data.scoreboard;
  scoreboard = new Scoreboard(
    scoreboardSettings,
    data.teamNames.redTeam,
    data.teamNames.blueTeam
  );

  updateAllValues(scoreboard);

  // Listen for actions
  ipcRenderer.on(eventMap.SCOREBOARD.POINT.RED, () => {
    scoreboard.addPoint('red');
    updateAllValues(scoreboard);
  });

  ipcRenderer.on(eventMap.SCOREBOARD.POINT.BLUE, () => {
    scoreboard.addPoint('blue');
    updateAllValues(scoreboard);
  });

  ipcRenderer.on(eventMap.SCOREBOARD.SUBTRACT.RED, () => {
    scoreboard.subtractPoint('red');
    updateAllValues(scoreboard);
  });

  ipcRenderer.on(eventMap.SCOREBOARD.SUBTRACT.BLUE, () => {
    scoreboard.subtractPoint('blue');
    updateAllValues(scoreboard);
  });

  ipcRenderer.on(eventMap.SCOREBOARD.TIMEOUT.RED, () => {
    scoreboard.callTimeout('red');
    updateAllValues(scoreboard);
  });

  ipcRenderer.on(eventMap.SCOREBOARD.TIMEOUT.BLUE, () => {
    scoreboard.callTimeout('blue');
    updateAllValues(scoreboard);
  });

  ipcRenderer.on(eventMap.SCOREBOARD.RESET, () => {
    scoreboard.resetMatch();
    updateAllValues(scoreboard);
  });

  ipcRenderer.on(Config.events.TEAMS_UPDATED, (event, teamNames) => {
    updateTeamNames(teamNames);
  });
});
