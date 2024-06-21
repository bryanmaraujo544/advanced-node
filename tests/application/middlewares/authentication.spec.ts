import { ForbiddenError } from "@/application/errors";
import { HttpResponse, forbidden, ok } from "@/application/helpers/http";
import { RequiredStringValidator } from "@/application/validation";
import { Authorize } from "@/domain/use-cases/authorize";

type HttpRequest = { authorization: string };
type Model = Error | { userId: string };

class AuthenticationMiddleware {
    constructor(private readonly authorize: Authorize) {}
    async handle({
        authorization,
    }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
        try {
            const error = new RequiredStringValidator(
                authorization,
                "authorization"
            ).validate();
            if (error) {
                return forbidden();
            }
            const userId = await this.authorize({ token: authorization });

            return ok({ userId });
        } catch {
            return forbidden();
        }
    }
}

describe("AuthenticationMiddleware", () => {
    let sut: AuthenticationMiddleware;
    let authorize: jest.Mock;
    let authorization: string;

    beforeAll(() => {
        authorization = "any_authorization_token";
        authorize = jest.fn();
    });

    beforeEach(() => {
        sut = new AuthenticationMiddleware(authorize);
    });

    it("should return 403 if authorization is empty", async () => {
        const httpResponse = await sut.handle({ authorization: "" });

        expect(httpResponse).toEqual({
            statusCode: 403,
            data: new ForbiddenError(),
        });
    });

    it("should return 403 if authorization is null", async () => {
        const httpResponse = await sut.handle({ authorization: null as any });

        expect(httpResponse).toEqual({
            statusCode: 403,
            data: new ForbiddenError(),
        });
    });

    it("should call authorize with correct input", async () => {
        await sut.handle({ authorization });

        expect(authorize).toHaveBeenCalledWith({ token: authorization });
        expect(authorize).toHaveBeenCalledTimes(1);
    });

    it("should return 403 if authorize throws", async () => {
        authorize.mockRejectedValueOnce(new Error("any_error"));

        const httpResponse = await sut.handle({ authorization });

        expect(httpResponse).toEqual({
            statusCode: 403,
            data: new ForbiddenError(),
        });
    });

    it("should return 200 with userId on success", async () => {
        authorize.mockResolvedValue("any_user_id");

        const httpResponse = await sut.handle({ authorization });

        expect(httpResponse).toEqual({
            statusCode: 200,
            data: { userId: "any_user_id" },
        });
    });
});
