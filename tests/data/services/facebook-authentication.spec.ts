import { mocked } from "jest-mock";
import { mock, MockProxy } from "jest-mock-extended";

import { LoadFacebookUserApi } from "@/data/contracts/apis";
import {
    SaveFacebookAccountRepository,
    LoadUserAccountRepository,
} from "@/data/contracts/repos";
import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAccount } from "@/domain/models";
import { TokenGenerator } from "@/data/contracts/crypto";

jest.mock("@/domain/models/facebook-account");

describe("FacebookAuthenticationService", () => {
    let facebookApi: MockProxy<LoadFacebookUserApi>;
    let crypto: MockProxy<TokenGenerator>;
    let userAccountRepo: MockProxy<
        LoadUserAccountRepository & SaveFacebookAccountRepository
    >;

    let sut: FacebookAuthenticationService;

    const token = "any_token";
    beforeEach(() => {
        facebookApi = mock();
        userAccountRepo = mock();
        crypto = mock();

        facebookApi.loadUser.mockResolvedValue({
            name: "any_fb_name",
            email: "any_fb_email",
            facebookId: "any_fb_id",
        });
        userAccountRepo.load.mockResolvedValue(undefined);
        userAccountRepo.saveWithFacebook.mockResolvedValue({
            id: "any_account_id",
        });

        sut = new FacebookAuthenticationService(
            facebookApi,
            userAccountRepo,
            crypto
        );
    });

    it("should call LoadFacebookUserApi with correct params", async () => {
        await sut.perform({ token });

        expect(facebookApi.loadUser).toHaveBeenCalledWith({
            token,
        });
        expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
    });

    it("should return AuthenticationError when LoadFacebookUserApi returns undefined", async () => {
        facebookApi.loadUser.mockResolvedValueOnce(undefined);

        const authResult = await sut.perform({ token });

        expect(authResult).toEqual(new AuthenticationError());
    });

    it("should call LoadUserAccountRepo when LoadFacebookUserApi returns data", async () => {
        await sut.perform({ token });
        expect(userAccountRepo.load).toHaveBeenCalledWith({
            email: "any_fb_email",
        });
        expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
    });

    it("should call SaveFacebookAccountRepository with FacebookAcount", async () => {
        // here the purpose is just test the integration between facebookAuthenticationService and
        //  FacebookAccountModel
        // I'm just testing if the FacebookAccountModel is being called with the correct data
        const FacebookAccountStub = jest.fn().mockImplementation(() => ({
            any: "any",
        }));
        mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

        await sut.perform({ token });

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            any: "any",
        });
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
    });

    it("should call TokenGenerator with correct params", async () => {
        await sut.perform({ token });

        expect(crypto.generateToken).toHaveBeenCalledWith({
            key: "any_account_id",
        });
        expect(crypto.generateToken).toHaveBeenCalledTimes(1);
    });
});
