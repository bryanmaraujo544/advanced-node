import { AuthenticationError } from "@/domain/entities/errors";
import {
    Controller,
    FacebookLoginController,
} from "@/application/controlllers";
import { ServerError, UnathorizedError } from "@/application/errors";
import { RequiredStringValidator } from "@/application/validation/required-string";

describe("FacebookLoginController", () => {
    let sut: FacebookLoginController;
    let facebookAuth: jest.Mock;
    let token: string;

    beforeAll(() => {
        token = "any_token";
        facebookAuth = jest.fn();
        facebookAuth.mockResolvedValue({ accessToken: "any_value" });
    });
    beforeEach(() => {
        sut = new FacebookLoginController(facebookAuth);
    });

    it("should extend Controller", async () => {
        expect(sut).toBeInstanceOf(Controller);
    });

    it("should build validators correctly", async () => {
        const validators = sut.buildValidators({ token });

        expect(validators).toEqual([
            new RequiredStringValidator(token, "token"),
        ]);
    });

    it("should call FacebookAuthentication with correct params", async () => {
        await sut.handle({ token: "any_token" });

        expect(facebookAuth).toHaveBeenCalledWith({
            token: "any_token",
        });
        expect(facebookAuth).toHaveBeenCalledTimes(1);
    });

    it("should return 401 if authentication fails", async () => {
        facebookAuth.mockRejectedValueOnce(new AuthenticationError());
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
});
