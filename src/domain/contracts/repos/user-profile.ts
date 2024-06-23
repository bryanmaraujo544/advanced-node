export interface SaveUserPicture {
    savePicture: (input: SaveUserPicture.Input) => Promise<void>;
}

export namespace SaveUserPicture {
    export type Input = {
        pictureUrl: string | undefined;
    };
}

export interface LoadUserProfile {
    load: (params: LoadUserProfile.Params) => Promise<void>;
}

export namespace LoadUserProfile {
    export type Params = {
        id: string;
    };

    export type Result =
        | undefined
        | {
              id: string;
              name?: string;
          };
}
