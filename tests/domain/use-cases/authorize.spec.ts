import { MockProxy, mock } from "jest-mock-extended";

export interface TokenValidator {
    validateToken: (params: TokenValidator.Params) => Promise<string>;
}
export namespace TokenValidator {
    export type Params = { token: string };
}

type Setup = (crypto: TokenValidator) => Authorize;
type Authorize = (params: { token: string }) => Promise<string>;
const setupAuthorize: Setup = (crypto) => {
    return async (params) => {
        const result = await crypto.validateToken(params);
        return result;
    };
};

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
