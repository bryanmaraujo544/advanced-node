import { FacebookAuthentication } from "@/domain/features";
import { RequiredFieldError } from "../errors";
import {
    HttpResponse,
    badRequest,
    ok,
    serverError,
    unathorized,
} from "../helpers";
import { AuthenticationError } from "@/domain/errors";
import {
    RequiredStringValidator,
    ValidationBuilder,
    ValidationComposite,
} from "../validation";

type HttpRequest = {
    token: string;
};

type Model =
    | Error
    | {
          accessToken: string;
      };
export class FacebookLoginController {
    constructor(
        private readonly facebookAuthentication: FacebookAuthentication
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
        try {
            const error = this.validate(httpRequest);
            if (error) {
                return badRequest(error);
            }

            const accessToken = await this.facebookAuthentication.perform({
                token: httpRequest.token,
            });

            if (accessToken instanceof AuthenticationError) {
                return unathorized();
            }

            return ok({
                accessToken: accessToken.value,
            });
        } catch (err: any) {
            return serverError(err);
        }
    }

    private validate(httpRequest: HttpRequest): Error | undefined {
        return new ValidationComposite([
            ...ValidationBuilder.of({
                value: httpRequest.token,
                fieldName: "token",
            })
                .required()
                .build(),
        ]).validate();
    }
}
