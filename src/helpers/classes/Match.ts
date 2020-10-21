import { MatchSettings } from '../interfaces';

export default class Match {

    currentSet: number;
    pointsInSet: number;
    maxPoints: number;
    bestOfSets: number;
    winningSets: number;
    inProgress: boolean;

    constructor(settings: MatchSettings) {
        this.currentSet = 1;
        this.pointsInSet = settings.pointsInSet;
        this.maxPoints = settings.maxPoints;
        this.bestOfSets = settings.bestOfSets;

        this.winningSets = Math.floor(this.bestOfSets / 2) + 1;

        this.inProgress = true;
    }

    restartMatch() {
        this.currentSet = 1;
        this.inProgress = true;
    }

    endMatch() {
        this.inProgress = false;
    }

    checkIfLastSet() {
        return this.currentSet === this.bestOfSets;
    }

    addSet() {
        if (!this.checkIfLastSet()) {
            this.currentSet += 1;
        }
    }

    subtractSet() {
        if (this.currentSet > 0) {
            this.currentSet -= 1;
        }
    }

}