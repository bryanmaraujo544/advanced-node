import { Router } from "express";
import { makeFaceboookLoginController } from "../factories/controllers";
import { adaptExpressRouter } from "@/infra/http";

export default (router: Router): void => {
    const controller = makeFaceboookLoginController();
    const adapter = adaptExpressRouter(controller);
    router.post("/login/facebook", adapter);
};
