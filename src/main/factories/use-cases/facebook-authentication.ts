import {
    setupFacebookAuthentication,
    FacebookAuthentication,
} from "@/domain/use-cases";
import { makeFaceboookApi } from "../apis";
import { makePgUserAccountRepo } from "../repos";
import { makeJwtTokenHandler } from "../crypto";

export const makeFaceboookAuthentication = (): FacebookAuthentication => {
    const fbApi = makeFaceboookApi();
    const pgUserAccountRepo = makePgUserAccountRepo();
    const JwtTokenHandler = makeJwtTokenHandler();
    return setupFacebookAuthentication(
        fbApi,
        pgUserAccountRepo,
        JwtTokenHandler
    );
};
