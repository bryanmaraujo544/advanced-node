import { TokenValidator } from "../contracts/crypto";

type Setup = (crypto: TokenValidator) => Authorize;
export type Authorize = (params: { token: string }) => Promise<string>;
export const setupAuthorize: Setup = (crypto) => {
    return async (params) => {
        const result = await crypto.validateToken(params);
        return result;
    };
};
