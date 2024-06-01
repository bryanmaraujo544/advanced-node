import { FacebookAuthentication } from "@/domain/features";
import { HttpResponse, RequiredFieldError, badRequest } from "../errors";
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

            const result = await this.facebookAuthentication.perform({
                token: httpRequest.token,
            });

            if (result instanceof AuthenticationError) {
                return {
                    statusCode: 401,
                    data: result,
                };
            }

            return {
                statusCode: 200,
                data: {
                    accessToken: result.value,
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
