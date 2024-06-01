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

type HttpRequest = {
    token: string | undefined | null;
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
            if (!httpRequest.token) {
                return badRequest(new RequiredFieldError("token"));
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
}
