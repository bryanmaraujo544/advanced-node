import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import {
    CreateFacebookAccountRepository,
    LoadUserAccountRepository,
} from "@/data/contracts/repos";
import { AuthenticationError } from "@/domain/errors";

export class FacebookAuthenticationService {
    constructor(
        private readonly loadFacebookUserApi: LoadFacebookUserApi,
        private readonly loadUserAccountRepo: LoadUserAccountRepository,
        private readonly createFacebookAccountRepo: CreateFacebookAccountRepository
    ) {}

    async perform(
        params: FacebookAuthentication.Params
    ): Promise<AuthenticationError> {
        const fbData = await this.loadFacebookUserApi.loadUser({
            token: params.token,
        });
        if (fbData) {
            await this.loadUserAccountRepo.load({
                email: fbData.email,
            });
            await this.createFacebookAccountRepo.createFromFacebook(fbData);
        }

        return new AuthenticationError();
    }
}
