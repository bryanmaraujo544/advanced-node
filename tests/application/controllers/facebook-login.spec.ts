import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import { MockProxy, mock } from "jest-mock-extended";
import { FacebookLoginController } from "@/application/controlllers";
import { ServerError, UnathorizedError } from "@/application/errors";
import { RequiredStringValidator } from "@/application/validation/required-string";

describe("FacebookLoginController", () => {
    let sut: FacebookLoginController;
    let facebookAuth: MockProxy<FacebookAuthentication>;
    let token: string;

    beforeAll(() => {
        token = "any_token";
        facebookAuth = mock();
        facebookAuth.perform.mockResolvedValue(new AccessToken("any_value"));
    });
    beforeEach(() => {
        sut = new FacebookLoginController(facebookAuth);
    });

    it("should build validators correctly", async () => {
        const validators = sut.buildValidators({ token });

        expect(validators).toEqual([
            new RequiredStringValidator(token, "token"),
        ]);
    });

    it("should call FacebookAuthentication with correct params", async () => {
        await sut.handle({ token: "any_token" });

        expect(facebookAuth.perform).toHaveBeenCalledWith({
            token: "any_token",
        });
        expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
    });

    it("should return 401 if authentication fails", async () => {
        facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
        const httpResponse = await sut.handle({ token });

        expect(httpResponse).toEqual({
            statusCode: 401,
            data: new UnathorizedError(),
        });
    });

    it("should return 200 if authentication succeeds", async () => {
        const httpResponse = await sut.handle({ token });

        expect(httpResponse).toEqual({
            statusCode: 200,
            data: {
                accessToken: "any_value",
            },
        });
    });

    it("should return 500 if authentication throws", async () => {
        const error = new Error("infra_error");

        facebookAuth.perform.mockRejectedValueOnce(error);
        const httpResponse = await sut.handle({ token });

        expect(httpResponse).toEqual({
            statusCode: 500,
            data: new ServerError(error),
        });
    });
});
