import { HttpResponse, ok, unathorized } from "../helpers";
import { AuthenticationError } from "@/domain/entities/errors";
import { ValidationBuilder, Validator } from "../validation";
import { Controller } from "./";
import { AccessToken } from "@/domain/entities";
import { FacebookAuthentication } from "@/domain/use-cases";

type HttpRequest = {
    token: string;
};

type Output =
    | Error
    | {
          accessToken: string;
      };

export class FacebookLoginController extends Controller {
    constructor(
        private readonly facebookAuthentication: FacebookAuthentication
    ) {
        super();
    }

    async perform(httpRequest: HttpRequest): Promise<HttpResponse<Output>> {
        try {
            const { accessToken } = await this.facebookAuthentication({
                token: httpRequest.token,
            });

            return ok({
                accessToken,
            });
        } catch (err) {
            return unathorized();
        }
    }

    override buildValidators(httpRequest: HttpRequest): Validator[] {
        return [
            ...ValidationBuilder.of({
                value: httpRequest.token,
                fieldName: "token",
            })
                .required()
                .build(),
        ];
    }
}
