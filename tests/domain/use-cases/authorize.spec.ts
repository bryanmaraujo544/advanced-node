import { MockProxy, mock } from "jest-mock-extended";
import { TokenValidator } from "@/domain/contracts/crypto";
import { Authorize, setupAuthorize } from "@/domain/use-cases/authorize";

describe("Authorize", () => {
    let crypto: MockProxy<TokenValidator>;
    let sut: Authorize;

    let token: string;

    beforeAll(() => {
        token = "any_token";
        crypto = mock();
        crypto.validateToken.mockResolvedValue("any_value");
    });
    beforeEach(() => {
        jest.clearAllMocks();
        sut = setupAuthorize(crypto);
    });

    it("should call TokenValidator with correct params", async () => {
        await sut({ token });

        expect(crypto.validateToken).toHaveBeenCalledWith({ token });
        expect(crypto.validateToken).toHaveBeenCalledTimes(1);
    });

    it("should return the correct acccessToken", async () => {
        const userId = await sut({ token });

        expect(userId).toBe("any_value");
    });
});
