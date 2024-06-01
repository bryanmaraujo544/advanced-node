import { FacebookAuthentication } from "@/domain/features";
import { RequiredFieldError } from "../errors";
import { HttpResponse, badRequest, unathorized } from "../helpers";
import { AuthenticationError } from "@/domain/errors";
import { ServerError } from "../errors";

export class FacebookLoginController {
    constructor(
        private readonly facebookAuthentication: FacebookAuthentication
    ) {}

    async handle(httpRequest: any): Promise<HttpResponse> {
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

            return {
                statusCode: 200,
                data: {
                    accessToken: accessToken.value,
                },
            };
        } catch (err: any) {
            return {
                statusCode: 500,
                data: new ServerError(err),
            };
        }
    }
}
