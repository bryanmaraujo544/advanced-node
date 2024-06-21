import { TokenGenerator, TokenValidator } from "@/domain/contracts/crypto";
import jwt, { JwtPayload, verify } from "jsonwebtoken";

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
    constructor(private readonly secret: string) {}

    async generateToken(
        params: TokenGenerator.Params
    ): Promise<TokenGenerator.Result> {
        const expirationInSeconds = params.expirationInMs / 1000;

        const token = jwt.sign({ key: params.key }, this.secret, {
            expiresIn: expirationInSeconds,
        });
        return token;
    }

    async validateToken(
        params: TokenValidator.Params
    ): Promise<TokenValidator.Result> {
        const payload = verify(params.token, this.secret) as JwtPayload;
        return payload.key;
    }
}
