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
}