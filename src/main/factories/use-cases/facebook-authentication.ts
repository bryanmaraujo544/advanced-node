import {
    setupFacebookAuthentication,
    FacebookAuthentication,
} from "@/domain/use-cases";
import { makeFaceboookApi } from "../apis";
import { makePgUserAccountRepo } from "../repos";
import { makeJwtTokenGenerator } from "../crypto";

export const makeFaceboookAuthentication = (): FacebookAuthentication => {
    const fbApi = makeFaceboookApi();
    const pgUserAccountRepo = makePgUserAccountRepo();
    const jwtTokenGenerator = makeJwtTokenGenerator();
    return setupFacebookAuthentication(
        fbApi,
        pgUserAccountRepo,
        jwtTokenGenerator
    );
};
