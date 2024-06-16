import { Request, RequestHandler, Response } from "express";
import { Controller } from "@/application/controlllers";

type Adapter = (controller: Controller) => RequestHandler;

export const adaptExpressRouter: Adapter = (controller) => {
    return async (req, res) => {
        const httpResponse = await controller.handle({ ...req.body });

        if (httpResponse.statusCode === 200) {
            res.status(200).json(httpResponse.data);
        } else {
            res.status(httpResponse.statusCode).json({
                error: httpResponse.data.message,
            });
        }
    };
};
