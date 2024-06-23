import { mocked } from "jest-mock";
import { mock, MockProxy } from "jest-mock-extended";

import { LoadFacebookUser } from "@/domain/contracts/gateways";
import { SaveFacebookAccount, LoadUserAccount } from "@/domain/contracts/repos";
import {
    FacebookAuthentication,
    setupFacebookAuthentication,
} from "@/domain/use-cases";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";
import { TokenGenerator } from "@/domain/contracts/crypto";

jest.mock("@/domain/entities/facebook-account");

describe("FacebookAuthenticationUseCase", () => {
    let facebookApi: MockProxy<LoadFacebookUser>;
    let crypto: MockProxy<TokenGenerator>;
    let userAccountRepo: MockProxy<LoadUserAccount & SaveFacebookAccount>;
    let sut: FacebookAuthentication;

    let token: string;

    beforeAll(() => {
        token = "any_token";

        facebookApi = mock();
        facebookApi.loadUser.mockResolvedValue({
            name: "any_fb_name",
            email: "any_fb_email",
            facebookId: "any_fb_id",
        });

        userAccountRepo = mock();
        userAccountRepo.load.mockResolvedValue(undefined);
        userAccountRepo.saveWithFacebook.mockResolvedValue({
            id: "any_account_id",
        });

        crypto = mock();
        crypto.generateToken.mockResolvedValue("any_generated_token");
    });
    beforeEach(() => {
        jest.clearAllMocks();

        sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto);
    });

    it("should call LoadFacebookUser with correct params", async () => {
        await sut({ token });

        expect(facebookApi.loadUser).toHaveBeenCalledWith({
            token,
        });
        expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
    });

    it("should throw AuthenticationError when LoadFacebookUser returns undefined", async () => {
        facebookApi.loadUser.mockResolvedValueOnce(undefined);

        const authResult = sut({ token });

        expect(authResult).rejects.toThrow(new AuthenticationError());
    });

    it("should call LoadUserAccountRepo when LoadFacebookUser returns data", async () => {
        await sut({ token });
        expect(userAccountRepo.load).toHaveBeenCalledWith({
            email: "any_fb_email",
        });
        expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
    });

    it("should call SaveFacebookAccount with FacebookAcount", async () => {
        // here the purpose is just test the integration between facebookAuthenticationService and
        //  FacebookAccountModel
        // I'm just testing if the FacebookAccountModel is being called with the correct data
        const FacebookAccountStub = jest.fn().mockImplementation(() => ({
            any: "any",
        }));
        mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

        await sut({ token });

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            any: "any",
        });
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
    });

    it("should call TokenGenerator with correct params", async () => {
        await sut({ token });

        expect(crypto.generateToken).toHaveBeenCalledWith({
            key: "any_account_id",
            expirationInMs: AccessToken.expirationInMs,
        });
        expect(crypto.generateToken).toHaveBeenCalledTimes(1);
    });

    it("should return an AccessToken on success", async () => {
        const authResult = await sut({ token });

        expect(authResult).toEqual({ accessToken: "any_generated_token" });
    });

    it("should rethrow if LoadFacebookUser throws", async () => {
        facebookApi.loadUser.mockRejectedValueOnce(new Error("fb_error"));
        const authResultPromise = sut({ token });

        expect(authResultPromise).rejects.toThrow(new Error("fb_error"));
    });

    it("should rethrow if LoadUserAccount throws", async () => {
        userAccountRepo.load.mockRejectedValueOnce(
            new Error("load_user_error")
        );
        const authResultPromise = sut({ token });

        expect(authResultPromise).rejects.toThrow(new Error("load_user_error"));
    });

    it("should rethrow if SaveFacebookAccount throws", async () => {
        userAccountRepo.saveWithFacebook.mockRejectedValueOnce(
            new Error("save_user_error")
        );
        const authResultPromise = sut({ token });

        expect(authResultPromise).rejects.toThrow(new Error("save_user_error"));
    });

    it("should rethrow if TokenGenerator throws", async () => {
        crypto.generateToken.mockRejectedValueOnce(new Error("crypto_error"));
        const authResultPromise = sut({ token });

        expect(authResultPromise).rejects.toThrow(new Error("crypto_error"));
    });
});
