import { TokenGenerator } from "@/data/contracts/crypto";
import jwt from "jsonwebtoken";
jest.mock("jsonwebtoken");

class JwtTokenGenerator {
    constructor(private readonly secret: string) {}

    async generateToken(
        params: TokenGenerator.Params
    ): Promise<TokenGenerator.Result> {
        const expirationInSeconds = params.expirationInMs / 1000;

        const token = jwt.sign({ key: params.key }, this.secret, {
            expiresIn: expirationInSeconds,
        });
        return token;
    }
}

describe("JwtTokenGenerator", () => {
    let sut: JwtTokenGenerator;
    let fakeJwt: jest.Mocked<typeof jwt>;

    beforeAll(() => {
        fakeJwt = jwt as jest.Mocked<typeof jwt>;

        /* mock return value does not work well because sign method has many overload an many return types
            fakeJwt.sign.mockReturnValue("any_value");
        */

        // Here I'm sending a new implementaion and returning value I want
        fakeJwt.sign.mockImplementation(() => "any_token");
    });

    beforeEach(() => {
        sut = new JwtTokenGenerator("any_secret");
    });

    it("should call sign with correct params", async () => {
        await sut.generateToken({
            key: "any_key",
            expirationInMs: 1000,
        });

        expect(fakeJwt.sign).toHaveBeenCalledWith(
            { key: "any_key" },
            "any_secret",
            {
                expiresIn: 1,
            }
        );
    });

    it("shoul return a token", async () => {
        const token = await sut.generateToken({
            key: "any_key",
            expirationInMs: 1000,
        });

        expect(token).toBe("any_token");
    });
});
