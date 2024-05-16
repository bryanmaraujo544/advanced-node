import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import {
    CreateFacebookAccountRepository,
    LoadUserAccountRepository,
} from "@/data/contracts/repos";
import { AuthenticationError } from "@/domain/errors";

export class FacebookAuthenticationService {
    constructor(
        private readonly facebookApi: LoadFacebookUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository &
            CreateFacebookAccountRepository
    ) {}

    async perform(
        params: FacebookAuthentication.Params
    ): Promise<AuthenticationError> {
        const fbData = await this.facebookApi.loadUser({
            token: params.token,
        });
        if (fbData) {
            await this.userAccountRepo.load({
                email: fbData.email,
            });
            await this.userAccountRepo.createFromFacebook(fbData);
        }

        return new AuthenticationError();
    }
}
