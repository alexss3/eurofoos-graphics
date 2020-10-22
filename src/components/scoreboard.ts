import Scoreboard from '../helpers/classes/Scoreboard';
import { MatchSettings, ConfigData } from '../helpers/interfaces';
import * as storage from 'electron-json-storage';
import { Config } from '../config/config';
import { ipcRenderer } from 'electron';
import gsap from 'gsap';

// Handle showing/hiding the scoreboard
const scoreboardWrapper = document.getElementById('scoreboard');
const scoreboardDiscipline = document.getElementById('discipline');

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
const redTeamName: any = document.getElementById('red-team-name');
const blueTeamName: any = document.getElementById('blue-team-name');

// Points
const redTeamPoints: any = document.getElementById('red-team-points');
const blueTeamPoints: any = document.getElementById('blue-team-points');

// Sets
const redTeamSets: any = document.getElementById('red-team-sets');
const blueTeamSets: any = document.getElementById('blue-team-sets');

// Timeouts
const redTeamTimeouts: any = document.getElementById('red-team-timeouts');
const blueTeamTimeouts: any = document.getElementById('blue-team-timeouts');


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
    
    ipcRenderer.on('scoreboard:reset', () => {
        scoreboard.resetMatch();
        updateAllValues(scoreboard);
    });

    // TODO
    // listen for names update

});


