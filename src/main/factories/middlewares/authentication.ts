import { AuthenticationMiddleware } from "@/application/middlewares/authentication";
import { makeJwtTokenHandler } from "../crypto";

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
    const jwt = makeJwtTokenHandler();
    return new AuthenticationMiddleware(jwt.validateToken.bind(jwt));
};
