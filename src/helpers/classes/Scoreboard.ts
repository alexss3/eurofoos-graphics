import { MatchSettings } from '../interfaces';
import Team from './Team';
import Match from './Match';

export default class Scoreboard {

    redTeam: Team;
    blueTeam: Team;
    match: Match;

    constructor(settings: MatchSettings, redTeam: string, blueTeam: string) {
        this.redTeam = new Team(redTeam);
        this.blueTeam = new Team(blueTeam);

        this.match = new Match(settings);
    }

    // Helper methods
    returnTeamFromString(team: string): Team {
        if (team === 'red') {
            return this.redTeam;
        } else if (team === 'blue') {
            return this.blueTeam;
        }
    }

    returnTeamObjects() {
        return {
            redTeam: this.redTeam,
            blueTeam: this.blueTeam
        }
    }

    evaluateScores(team: string) {

        const teamPointer = this.returnTeamFromString(team);
        let newSets = teamPointer.sets;
        let newTeamPoints = teamPointer.points;
        const currOtherTeamPoints = (team === 'red') ? this.blueTeam.points : this.redTeam.points;

        // Check if last set or not
        if (this.match.checkIfLastSet()) {
            newTeamPoints += 1;

            if (newTeamPoints >= this.match.pointsInSet) {
                // need a two-point margin to win
                if (Math.abs(newTeamPoints - currOtherTeamPoints) > 1 || newTeamPoints === this.match.maxPoints) {
                    newSets += 1;
                    // newBluePoints--;
                    this.match.endMatch();
                }
            }
        } else {
            console.log(`Current set ${this.match.currentSet}`);
            newTeamPoints += 1;

            // All other sets
            if (newTeamPoints === this.match.pointsInSet) {
                newSets += 1;

                if (newSets !== this.match.winningSets) {
                    newTeamPoints = 0;
                } else {
                    // end match
                    this.match.endMatch();
                }
            }
        }

        if (newSets > teamPointer.sets) {
            teamPointer.sets = newSets;
            this.match.addSet();
            if (this.match.currentSet < this.match.bestOfSets) {
                this.resetPoints();
                this.resetTimeouts();
            }
        }

        if (newTeamPoints > teamPointer.points || newTeamPoints === 0) {
            // Add a point
            teamPointer.points = newTeamPoints;
        }
    }

    // Add Methods

    // Add Point
    addPoint(team: string): {} {
        if (this.match.inProgress) {
            this.evaluateScores(team);
        }

        return this.returnTeamObjects();
    }

    // Add Set
    addSet(team: string): {} {
        if (this.match.inProgress) {
            const teamPointer = this.returnTeamFromString(team);
            teamPointer.sets += 1;
            this.match.addSet();
        }
        return this.returnTeamObjects();
    }

    // Call Timeout
    callTimeout(team: string): {} {
        if (this.match.inProgress) {
            const teamPointer = this.returnTeamFromString(team);
            // max 2 timeouts per set
            if (teamPointer.timeouts < 2) {
                teamPointer.timeouts += 1;
            }
        }
        return this.returnTeamObjects();
    }

    // Subtract Methods

    // Subtract Point
    subtractPoint(team: string): {} {
        if (this.match.inProgress) {
            const teamPointer = this.returnTeamFromString(team);
            if (teamPointer.points > 0) {
                teamPointer.points -= 1;
            }
        }
        return this.returnTeamObjects();
    }

    // Subtract Set
    subtractSet(team: string): {} {
        if (this.match.inProgress) {
            const teamPointer = this.returnTeamFromString(team);
            if (teamPointer.sets > 0) {
                teamPointer.sets -= 1;
                this.match.subtractSet();
            }
        }
        return this.returnTeamObjects();
    }

    // Reset Methods

    // Reset Match
    resetMatch() {
        this.resetPoints();
        this.resetSets();
        this.resetTimeouts();
        this.match.restartMatch();
    }

    // Reset Points
    resetPoints() {
        this.redTeam.points = 0;
        this.blueTeam.points = 0;
    }

    // Reset Sets
    resetSets() {
        this.redTeam.sets = 0;
        this.blueTeam.sets = 0;
    }

    // Reset Timeouts
    resetTimeouts() {
        this.redTeam.timeouts = 0;
        this.blueTeam.timeouts = 0;
    }

    
}