import Scoreboard from '../helpers/classes/Scoreboard';
import { MatchSettings, ConfigData } from '../helpers/interfaces';
import * as storage from 'electron-json-storage';
import { Config } from '../config/config';
import { ipcRenderer } from 'electron';
import gsap from 'gsap';

// Handle showing/hiding the scoreboard
const scoreboardWrapper = document.getElementById('scoreboard');
const scoreboardDiscipline = document.querySelector('#discipline span');

ipcRenderer.on('scoreboard:show', () => {
    scoreboardWrapper.style.display = 'block';
    gsap.timeline()
        .to('#scoreboard', {
            duration: 0.5,
            ease: "sine.out",
            top: '75%'
        });
});

ipcRenderer.on('scoreboard:hide', () => {
    gsap.timeline()
    .to('#scoreboard', {
        duration: 0.5,
        ease: "sine.out",
        top: '130%'
    });
    // scoreboardWrapper.style.display = 'none';
});

ipcRenderer.on('scoreboard:discipline:updated', (event, disc) => {
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
const blueTeamTimeouts: any = document.querySelector('#blue-team-timeouts span');


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

    console.log(scoreboard);

    const values = {
        teamNames: {
            redTeam: scoreboard.redTeam.title,
            blueTeam: scoreboard.blueTeam.title
        },
        points: [scoreboard.redTeam.points, scoreboard.blueTeam.points],
        sets: [scoreboard.redTeam.sets, scoreboard.blueTeam.sets],
        timeouts: [scoreboard.redTeam.timeouts, scoreboard.blueTeam.timeouts]
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
    scoreboard = new Scoreboard(scoreboardSettings, data.teamNames.redTeam, data.teamNames.blueTeam);

    updateAllValues(scoreboard);

    // Listen for actions
    ipcRenderer.on('scoreboard:point:red', () => {
        scoreboard.addPoint('red');
        updateAllValues(scoreboard);
    });
    
    ipcRenderer.on('scoreboard:point:blue', () => {
        scoreboard.addPoint('blue');
        updateAllValues(scoreboard);
    });

    ipcRenderer.on('scoreboard:sub:red', () => {
        scoreboard.subtractPoint('red');
        updateAllValues(scoreboard);
    });
    
    ipcRenderer.on('scoreboard:sub:blue', () => {
        scoreboard.subtractPoint('blue');
        updateAllValues(scoreboard);
    });

    ipcRenderer.on('scoreboard:timeout:red', () => {
        scoreboard.callTimeout('red');
        updateAllValues(scoreboard);
    });
    
    ipcRenderer.on('scoreboard:timeout:blue', () => {
        scoreboard.callTimeout('blue');
        updateAllValues(scoreboard);
    });
    
    ipcRenderer.on('scoreboard:reset', () => {
        scoreboard.resetMatch();
        updateAllValues(scoreboard);
    });

    ipcRenderer.on(Config.events.TEAMS_UPDATED, (event, teamNames) => {
        updateTeamNames(teamNames);
    });

});


