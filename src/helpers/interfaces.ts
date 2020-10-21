export interface CommentatorObject {
    name: string;
  }
  
export interface ConfigData {
    bug: {
        path: string;
    };
    video: {
        path: string;
    };
    commentators: Array<CommentatorObject>;
    webcam: {
        device: string;
    };
    scoreboard: {
        pointsInSet: number;
        maxPoints: number;
        bestOfSets: number;
    };
    teamNames: {
        redTeam: string;
        blueTeam: string;
    };
}

export interface MatchSettings {
    pointsInSet: number;
    maxPoints: number;
    bestOfSets: number;
}