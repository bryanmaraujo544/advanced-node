import { NextFunction, Request, RequestHandler, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock, MockProxy } from "jest-mock-extended";
import { Controller } from "@/application/controlllers";
import { adaptExpressRouter } from "@/infra/http";

describe("ExpressRouter", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let controller: MockProxy<Controller>;
    let sut: RequestHandler;

    beforeEach(() => {
        req = getMockReq({ body: { any: "any" } });
        res = getMockRes().res;
        next = getMockRes().next;
        controller = mock<Controller>();
        controller.handle.mockResolvedValue({
            statusCode: 200,
            data: { data: "anydata" },
        });
        sut = adaptExpressRouter(controller);
    });

    it("should call handle with correct request", async () => {
        const sut = adaptExpressRouter(controller);

        await sut(req, res, next);

        expect(controller.handle).toHaveBeenCalledWith({
            any: "any",
        });
        expect(controller.handle).toHaveBeenCalledTimes(1);
    });

    it("should call handle with empty request", async () => {
        req = getMockReq({ body: undefined });

        await sut(req, res, next);

        expect(controller.handle).toHaveBeenCalledWith({});
        expect(controller.handle).toHaveBeenCalledTimes(1);
    });

    it("should respond with 200", async () => {
        await sut(req, res, next);

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
        await sut(req, res, next);

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
        await sut(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            error: "any_erro",
        });
        expect(res.json).toHaveBeenCalledTimes(1);
    });
});
