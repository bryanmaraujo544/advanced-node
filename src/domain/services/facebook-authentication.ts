import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import {
    LoadUserAccountRepository,
    SaveFacebookAccountRepository,
} from "@/domain/contracts/repos";
import { AuthenticationError } from "@/domain/errors";
import { AccessToken, FacebookAccount } from "@/domain/models";
import { TokenGenerator } from "../contracts/crypto";

export class FacebookAuthenticationService implements FacebookAuthentication {
    constructor(
        private readonly facebookApi: LoadFacebookUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository &
            SaveFacebookAccountRepository,
        private readonly crypto: TokenGenerator
    ) {}

    async perform(
        params: FacebookAuthentication.Params
    ): Promise<FacebookAuthentication.Result> {
        const fbData = await this.facebookApi.loadUser({
            token: params.token,
        });
        if (fbData) {
            const accountData = await this.userAccountRepo.load({
                email: fbData.email,
            });
            const fbAccount = new FacebookAccount(fbData, accountData);
            const accountSaved = await this.userAccountRepo.saveWithFacebook(
                fbAccount
            );
            const tokenGenerated = await this.crypto.generateToken({
                key: accountSaved.id,
                expirationInMs: AccessToken.expirationInMs,
            });

            return new AccessToken(tokenGenerated);
        }

        return new AuthenticationError();
    }
}
