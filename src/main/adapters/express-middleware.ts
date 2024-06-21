import { Middleware } from "@/application/middlewares/middleware";
import { RequestHandler } from "express";

type Adapter = (middleware: Middleware) => RequestHandler;
export const adaptExpressMiddleware: Adapter = (middleware) => {
    return async (req, res, next) => {
        const { statusCode, data } = await middleware.handle({
            ...req.headers,
        });
        if (statusCode === 200) {
            const entries = Object.entries(data).filter(([, value]) => value);
            req.locals = { ...req.locals, ...Object.fromEntries(entries) };
            return next();
        }

        res.status(statusCode).json(data);
    };
};
