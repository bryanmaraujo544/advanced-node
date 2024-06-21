import { ForbiddenError } from "@/application/errors";
import { HttpResponse, forbidden } from "@/application/helpers/http";

type HttpRequest = { authorization: string };

class AuthenticationMiddleware {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse<Error>> {
        return forbidden();
    }
}

describe("AuthenticationMiddleware", () => {
    it("should return 403 if authorization is empty", async () => {
        const sut = new AuthenticationMiddleware();
        const httpResponse = await sut.handle({ authorization: "" });

        expect(httpResponse).toEqual({
            statusCode: 403,
            data: new ForbiddenError(),
        });
    });

    it("should return 403 if authorization is null", async () => {
        const sut = new AuthenticationMiddleware();
        const httpResponse = await sut.handle({ authorization: null as any });

        expect(httpResponse).toEqual({
            statusCode: 403,
            data: new ForbiddenError(),
        });
    });
});
