import { UUIDGenerator } from "@/domain/contracts/gateways/uuid";
import { mocked } from "jest-mock";
import { v4 } from "uuid";

jest.mock("uuid");

export class UUIDHandler implements UUIDGenerator {
    uuid({ key }: UUIDGenerator.Input): string {
        return `${key}_${v4()}`;
    }
}
describe("UUIDHandler", () => {
    it("should call uuid.v4", () => {
        const sut = new UUIDHandler();

        sut.uuid({ key: "any_key" });
        expect(v4).toHaveBeenCalledTimes(1);
    });

    it("should return correct uuid", () => {
        mocked(v4).mockReturnValueOnce("1");
        const sut = new UUIDHandler();

        const uuid = sut.uuid({ key: "any_key" });
        expect(uuid).toBe(`any_key_1`);
    });
});
