export interface UUIDGenerator {
    uuid: (input: UUIDGenerator.Input) => string;
}
export namespace UUIDGenerator {
    export type Input = {
        key: string;
    };
}
