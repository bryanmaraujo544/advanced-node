import { HttpResponse, forbidden, ok } from "@/application/helpers/http";
import { RequiredStringValidator } from "@/application/validation";
import { Authorize } from "@/domain/use-cases/authorize";

type HttpRequest = { authorization: string };
type Model = Error | { userId: string };

export class AuthenticationMiddleware {
    constructor(private readonly authorize: Authorize) {}
    async handle({
        authorization,
    }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
        try {
            if (!this.validate({ authorization })) {
                return forbidden();
            }

            const userId = await this.authorize({ token: authorization });

            return ok({ userId });
        } catch {
            return forbidden();
        }
    }

    private validate({ authorization }: HttpRequest): boolean {
        const error = new RequiredStringValidator(
            authorization,
            "authorization"
        ).validate();
        if (error) {
            return false;
        }
        return true;
    }
}
