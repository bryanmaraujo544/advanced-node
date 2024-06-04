import { FacebookAuthentication } from "@/domain/features";
import { HttpResponse, ok, unathorized } from "../helpers";
import { AuthenticationError } from "@/domain/errors";
import { ValidationBuilder, Validator } from "../validation";
import { Controller } from "./";

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
        const accessToken = await this.facebookAuthentication.perform({
            token: httpRequest.token,
        });

        if (accessToken instanceof AuthenticationError) {
            return unathorized();
        }

        return ok({
            accessToken: accessToken.value,
        });
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
