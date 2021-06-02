export default class Team {

    points: number;
    sets: number;
    timeouts: number;
    title: string;

    constructor(title: string) {
        this.title = title;
        this.points = 0;
        this.sets = 0;
        this.timeouts = 0;
    }

}