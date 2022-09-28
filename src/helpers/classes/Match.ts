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

    restartMatch(): void {
        this.currentSet = 1;
        this.inProgress = true;
    }

    endMatch(): void {
        this.inProgress = false;
    }

    checkIfLastSet(): boolean {
        return this.currentSet === this.bestOfSets;
    }

    addSet(): void {
        if (!this.checkIfLastSet()) {
            this.currentSet += 1;
        }
    }

    subtractSet(): void {
        if (this.currentSet > 0) {
            this.currentSet -= 1;
        }
    }

}