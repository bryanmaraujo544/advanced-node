export class ServerError extends Error {
    constructor(error?: Error) {
        super("Internal server error");
        this.name = "InternalServerError";
        this.stack = error?.stack;
    }
}

export class UnathorizedError extends Error {
    constructor() {
        super("Unathorized");
        this.name = "UnathorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor() {
        super("Access denied");
        this.name = "ForbiddenError";
    }
}
