import { JwtTokenHandler } from "@/infra/crypto";
import jwt from "jsonwebtoken";
jest.mock("jsonwebtoken");

describe("JwtTokenHandler", () => {
    let sut: JwtTokenHandler;
    let fakeJwt: jest.Mocked<typeof jwt>;
    let token = "";

    beforeAll(() => {
        fakeJwt = jwt as jest.Mocked<typeof jwt>;
        token = token;
    });

    beforeEach(() => {
        sut = new JwtTokenHandler("any_secret");
    });

    describe("generateToken", () => {
        let key: string;
        beforeAll(() => {
            key = "any_key";
            /* mock return value does not work well because sign method has many overload an many return types
            fakeJwt.sign.mockReturnValue("any_value");
        */
            // Here I'm sending a new implementaion and returning value I want
            fakeJwt.sign.mockImplementation(() => token);
        });

        it("should call sign with correct params", async () => {
            await sut.generateToken({
                key,
                expirationInMs: 1000,
            });

            expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, "any_secret", {
                expiresIn: 1,
            });
        });

        it("should return a token", async () => {
            const token = await sut.generateToken({
                key,
                expirationInMs: 1000,
            });

            expect(token).toBe(token);
        });

        it("should rethrow if sign throws", async () => {
            fakeJwt.sign.mockImplementationOnce(() => {
                throw new Error("token_error");
            });

            const promise = sut.generateToken({
                key,
                expirationInMs: 1000,
            });

            expect(promise).rejects.toThrow(new Error("token_error"));
        });
    });

    describe("validateToken", () => {
        let token = "any_token";
        let key = "key";

        beforeAll(() => {
            /* mock return value does not work well because sign method has many overload an many return types
            fakeJwt.sign.mockReturnValue("any_value");
        */
            // Here I'm sending a new implementaion and returning value I want
            fakeJwt.verify.mockImplementation(() => ({ key }));
        });

        it("should call sign with correct params", async () => {
            await sut.validateToken({
                token,
            });

            expect(fakeJwt.verify).toHaveBeenCalledWith(token, "any_secret");
            expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
        });

        it("should return the key used to sign", async () => {
            const generatedKey = await sut.validateToken({
                token,
            });

            expect(generatedKey).toBe(key);
            expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
        });
    });
});
