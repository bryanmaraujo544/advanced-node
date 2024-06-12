import { FacebookLoginController } from "@/application/controlllers";
import { FacebookAuthenticationService } from "@/data/services";
import { FacebookApi } from "@/infra/apis";
import { AxiosHttpClient } from "@/infra/http";
import { env } from "../../config/env";
import { PgUserAccountRepository } from "@/infra/postgres/repos/user-account";
import { JwtTokenGenerator } from "@/infra/crypto";

export const makeFaceboookLoginController = (): FacebookLoginController => {
    const axiosClient = new AxiosHttpClient();
    const fbApi = new FacebookApi(
        axiosClient,
        env.facebookApi.clientId,
        env.facebookApi.clientSecret
    );
    const pgUserAccountRepo = new PgUserAccountRepository();
    const jwtTokenGenerator = new JwtTokenGenerator(env.jwtSecret);
    const fbAuthService = new FacebookAuthenticationService(
        fbApi,
        pgUserAccountRepo,
        jwtTokenGenerator
    );
    return new FacebookLoginController(fbAuthService);
};
