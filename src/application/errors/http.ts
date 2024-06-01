export type HttpResponse = {
    statusCode: number;
    data: any;
};

export class ServerError extends Error {
    constructor(error?: Error) {
        super("Internal server error");
        this.name = "InternalServerError";
        this.stack = error?.stack;
    }
}

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    data: error,
});

export class RequiredFieldError extends Error {
    constructor(fieldName?: string) {
        super(`The field ${fieldName} is required`);
        this.name = "RequiredFieldError";
    }
}
