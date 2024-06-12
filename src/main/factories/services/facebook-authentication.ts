import { FacebookAuthenticationService } from "@/data/services";
import { env } from "../../config/env";
import { PgUserAccountRepository } from "@/infra/postgres/repos/user-account";
import { JwtTokenGenerator } from "@/infra/crypto";
import { makeFaceboookApi } from "../apis";
import { makePgUserAccountRepo } from "../repos";
import { makeJwtTokenGenerator } from "../crypto";

export const makeFaceboookAuthenticationService =
    (): FacebookAuthenticationService => {
        const fbApi = makeFaceboookApi();
        const pgUserAccountRepo = makePgUserAccountRepo();
        const jwtTokenGenerator = makeJwtTokenGenerator();
        return new FacebookAuthenticationService(
            fbApi,
            pgUserAccountRepo,
            jwtTokenGenerator
        );
    };
