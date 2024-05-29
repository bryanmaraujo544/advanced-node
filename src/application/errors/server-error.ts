export class ServerError extends Error {
    constructor(error?: Error) {
        super("Internal server error");
        this.name = "InternalServerError";
        this.stack = error?.stack;
    }
}
