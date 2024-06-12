import { env } from "../../config/env";
import { JwtTokenGenerator } from "@/infra/crypto";

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
    return new JwtTokenGenerator(env.jwtSecret);
};
