import { UniqueId } from "@/infra/gateways";

describe("UniqueId", () => {
    it("should call uuid.v4", () => {
        const sut = new UniqueId(new Date(2021, 9, 3, 10, 10, 10));

        const uuid = sut.uuid({ key: "any_key" });

        expect(uuid).toBe("any_key_202110031010");
    });

    it("should call uuid.v4", () => {
        const sut = new UniqueId(new Date(2018, 9, 3, 10, 10, 10));

        const uuid = sut.uuid({ key: "any_key" });

        expect(uuid).toBe("any_key_201810031010");
    });
});
