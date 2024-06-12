import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock, MockProxy } from "jest-mock-extended";
import { Controller } from "@/application/controlllers";
class ExpressRouter {
    constructor(private readonly controller: Controller) {}

    async adapt(req: Request, res: Response): Promise<void> {
        await this.controller.handle({ ...req.body });
    }
}

describe("ExpressRouter", () => {
    let req: Request;
    let res: Response;
    let controller: MockProxy<Controller>;
    let sut: ExpressRouter;
    beforeEach(() => {
        req = getMockReq({ body: { any: "any" } });
        res = getMockRes().res;
        controller = mock<Controller>();
        sut = new ExpressRouter(controller);
    });

    it("should call handle with correct request", async () => {
        const sut = new ExpressRouter(controller);

        await sut.adapt(req, res);

        expect(controller.handle).toHaveBeenCalledWith({
            any: "any",
        });
    });

    it("should call handle with empty request", async () => {
        req = getMockReq({ body: undefined });

        await sut.adapt(req, res);

        expect(controller.handle).toHaveBeenCalledWith({});
    });
});
