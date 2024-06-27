import { mocked } from "jest-mock";
import { v4 } from "uuid";
import { UUIDHandler } from "@/infra/gateways";

jest.mock("uuid");

describe("UUIDHandler", () => {
    let sut: UUIDHandler;

    beforeAll(() => {
        mocked(v4).mockReturnValue("1");
    });
    beforeEach(() => {
        sut = new UUIDHandler();
    });

    it("should call uuid.v4", () => {
        sut.uuid({ key: "any_key" });
        expect(v4).toHaveBeenCalledTimes(1);
    });

    it("should return correct uuid", () => {
        const uuid = sut.uuid({ key: "any_key" });
        expect(uuid).toBe(`any_key_1`);
    });
});
