import { adaptExpressMiddleware } from "../adapters/express-middleware";
import { makeAuthenticationMiddleware } from "../factories/middlewares";

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware());
