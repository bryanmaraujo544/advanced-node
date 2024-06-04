import { HttpResponse, badRequest, serverError } from "../helpers";
import { Validator, ValidationComposite } from "../validation";

type HttpRequest = {
    token: string;
};
export abstract class Controller {
    abstract perform(httpRequest: any): Promise<HttpResponse>;
    buildValidators(httpRequest: any): Validator[] {
        return [];
    }

    async handle(httpRequest: any): Promise<HttpResponse> {
        const error = this.validate(httpRequest);
        if (error) {
            return badRequest(error);
        }

        try {
            return await this.perform(httpRequest);
        } catch (err: any) {
            return serverError(err);
        }
    }

    private validate(httpRequest: HttpRequest): Error | undefined {
        const validators = this.buildValidators(httpRequest);
        return new ValidationComposite(validators).validate();
    }
}
