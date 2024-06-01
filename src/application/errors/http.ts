export class ServerError extends Error {
    constructor(error?: Error) {
        super("Internal server error");
        this.name = "InternalServerError";
        this.stack = error?.stack;
    }
}

export class RequiredFieldError extends Error {
    constructor(fieldName?: string) {
        super(`The field ${fieldName} is required`);
        this.name = "RequiredFieldError";
    }
}

export class UnathorizedError extends Error {
    constructor() {
        super("Unathorized");
        this.name = "UnathorizedError";
    }
}
