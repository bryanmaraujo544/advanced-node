import { LoadFacebookUser } from "../contracts/gateways";
import { LoadUserAccount, SaveFacebookAccount } from "@/domain/contracts/repos";
import { AuthenticationError } from "@/domain/entities/errors";
import { AccessToken, FacebookAccount } from "@/domain/entities";
import { TokenGenerator } from "../contracts/crypto";

type Params = { token: string };
type Result = { accessToken: string };
export type FacebookAuthentication = (params: Params) => Promise<Result>;

export const setupFacebookAuthentication = (
    facebook: LoadFacebookUser,
    userAccountRepo: LoadUserAccount & SaveFacebookAccount,
    crypto: TokenGenerator
): FacebookAuthentication => {
    return async (params) => {
        const fbData = await facebook.loadUser({
            token: params.token,
        });
        if (fbData) {
            const accountData = await userAccountRepo.load({
                email: fbData.email,
            });
            const fbAccount = new FacebookAccount(fbData, accountData);
            const accountSaved = await userAccountRepo.saveWithFacebook(
                fbAccount
            );
            const tokenGenerated = await crypto.generateToken({
                key: accountSaved.id,
                expirationInMs: AccessToken.expirationInMs,
            });

            return { accessToken: tokenGenerated };
        }

        throw new AuthenticationError();
    };
};
