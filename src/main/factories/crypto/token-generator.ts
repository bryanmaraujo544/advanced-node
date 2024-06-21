import { env } from "../../config/env";
import { JwtTokenHandler } from "@/infra/crypto";

export const makeJwtTokenHandler = (): JwtTokenHandler => {
    return new JwtTokenHandler(env.jwtSecret);
};
