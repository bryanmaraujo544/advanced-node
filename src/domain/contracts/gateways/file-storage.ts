export interface UploadFile {
    upload: (input: UploadFile.Input) => Promise<string>;
}
export namespace UploadFile {
    export type Input = {
        file: Buffer;
        key: string;
    };
}
