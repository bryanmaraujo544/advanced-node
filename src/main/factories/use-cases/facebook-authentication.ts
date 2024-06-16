import { FacebookAuthenticationUseCase } from "@/domain/use-cases";
import { env } from "../../config/env";
import { PgUserAccountRepository } from "@/infra/postgres/repos/user-account";
import { JwtTokenGenerator } from "@/infra/crypto";
import { makeFaceboookApi } from "../apis";
import { makePgUserAccountRepo } from "../repos";
import { makeJwtTokenGenerator } from "../crypto";

export const makeFaceboookAuthenticationUseCase =
    (): FacebookAuthenticationUseCase => {
        const fbApi = makeFaceboookApi();
        const pgUserAccountRepo = makePgUserAccountRepo();
        const jwtTokenGenerator = makeJwtTokenGenerator();
        return new FacebookAuthenticationUseCase(
            fbApi,
            pgUserAccountRepo,
            jwtTokenGenerator
        );
    };
