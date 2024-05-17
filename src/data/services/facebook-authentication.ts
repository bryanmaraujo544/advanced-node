import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import {
    CreateFacebookAccountRepository,
    LoadUserAccountRepository,
    UpdateFacebookAccountRepository,
} from "@/data/contracts/repos";
import { AuthenticationError } from "@/domain/errors";

export class FacebookAuthenticationService {
    constructor(
        private readonly facebookApi: LoadFacebookUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository &
            CreateFacebookAccountRepository &
            UpdateFacebookAccountRepository
    ) {}

    async perform(
        params: FacebookAuthentication.Params
    ): Promise<AuthenticationError> {
        const fbData = await this.facebookApi.loadUser({
            token: params.token,
        });
        if (fbData) {
            const accountData = await this.userAccountRepo.load({
                email: fbData.email,
            });
            if (accountData?.name) {
                console.log({ accountData });
                await this.userAccountRepo.updateWithFacebook({
                    id: accountData.id,
                    name: accountData.name,
                    facebookId: fbData.facebookId,
                });
            } else {
                await this.userAccountRepo.createFromFacebook(fbData);
            }
        }

        return new AuthenticationError();
    }
}
