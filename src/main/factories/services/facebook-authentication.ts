import { FacebookAuthenticationService } from "@/data/services";
import { FacebookApi } from "@/infra/apis";
import { AxiosHttpClient } from "@/infra/http";
import { env } from "../../config/env";
import { PgUserAccountRepository } from "@/infra/postgres/repos/user-account";
import { JwtTokenGenerator } from "@/infra/crypto";
import { makeFaceboookApi } from "../apis";

export const makeFaceboookAuthenticationService =
    (): FacebookAuthenticationService => {
        const fbApi = makeFaceboookApi();
        const pgUserAccountRepo = new PgUserAccountRepository();
        const jwtTokenGenerator = new JwtTokenGenerator(env.jwtSecret);
        return new FacebookAuthenticationService(
            fbApi,
            pgUserAccountRepo,
            jwtTokenGenerator
        );
    };
