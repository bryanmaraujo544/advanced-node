import { AccessToken } from "@/domain/entities";

describe("AccessToken", () => {
    it("should create with a value", () => {
        const sut = { accessToken: "any_value" };

        expect(sut).toEqual({ accessToken: "any_value" });
    });

    it("should expires within 1800000 ms", () => {
        const sut = { accessToken: "any_value" };

        expect(AccessToken.expirationInMs).toBe(1800000);
    });
});
