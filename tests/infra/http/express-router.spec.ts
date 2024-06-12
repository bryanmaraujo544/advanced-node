import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock, MockProxy } from "jest-mock-extended";
import { Controller } from "@/application/controlllers";
class ExpressRouter {
    constructor(private readonly controller: Controller) {}

    async adapt(req: Request, res: Response): Promise<void> {
        const httpResponse = await this.controller.handle({ ...req.body });

        if (httpResponse.statusCode === 200) {
            res.status(200).json(httpResponse.data);
        } else {
            res.status(httpResponse.statusCode).json({
                error: httpResponse.data.message,
            });
        }
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
        controller.handle.mockResolvedValue({
            statusCode: 200,
            data: { data: "anydata" },
        });
        sut = new ExpressRouter(controller);
    });

    it("should call handle with correct request", async () => {
        const sut = new ExpressRouter(controller);

        await sut.adapt(req, res);

        expect(controller.handle).toHaveBeenCalledWith({
            any: "any",
        });
        expect(controller.handle).toHaveBeenCalledTimes(1);
    });

    it("should call handle with empty request", async () => {
        req = getMockReq({ body: undefined });

        await sut.adapt(req, res);

        expect(controller.handle).toHaveBeenCalledWith({});
        expect(controller.handle).toHaveBeenCalledTimes(1);
    });

    it("should respond with 200", async () => {
        await sut.adapt(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            data: "anydata",
        });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should respond with 400 and valid error", async () => {
        controller.handle.mockResolvedValueOnce({
            statusCode: 400,
            data: new Error("any_erro"),
        });
        await sut.adapt(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            error: "any_erro",
        });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should respond with 500 and valid error", async () => {
        controller.handle.mockResolvedValueOnce({
            statusCode: 500,
            data: new Error("any_erro"),
        });
        await sut.adapt(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            error: "any_erro",
        });
        expect(res.json).toHaveBeenCalledTimes(1);
    });
});
