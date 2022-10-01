export interface CommentatorObject {
  name: string;
}

export interface ConfigData {
  bug: {
    path: string;
  };
  countdown: {
    value: number;
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
  discipline: string;
  teamNames: {
    redTeam: string;
    blueTeam: string;
  };
  stinger: {
    path: string;
    duration: number;
    width: number;
    height: number;
  };
}

export interface MatchSettings {
  pointsInSet: number;
  maxPoints: number;
  bestOfSets: number;
}
