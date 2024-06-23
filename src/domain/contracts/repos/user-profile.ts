export interface SaveUserPicture {
    savePicture: (input: SaveUserPicture.Input) => Promise<void>;
}

export namespace SaveUserPicture {
    export type Input = {
        pictureUrl?: string;
        initials?: string;
    };
}

export interface LoadUserProfile {
    load: (params: LoadUserProfile.Params) => Promise<LoadUserProfile.Result>;
}

export namespace LoadUserProfile {
    export type Params = {
        id: string;
    };

    export type Result =
        | undefined
        | {
              name?: string;
          };
}
