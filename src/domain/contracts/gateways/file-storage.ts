export interface UploadFile {
    upload: (input: UploadFile.Input) => Promise<string>;
}
export namespace UploadFile {
    export type Input = {
        file: Buffer;
        key: string;
    };
}

export interface DeleteFile {
    delete: (input: DeleteFile.Input) => Promise<void>;
}
export namespace DeleteFile {
    export type Input = {
        key: string;
    };
}
