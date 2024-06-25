import { UserProfile } from "@/domain/entities/user-profile";

describe("UserProfile", () => {
    let sut: UserProfile;
    let userId = "any_id";

    beforeEach(() => {
        sut = new UserProfile(userId);
    });

    it("should create with empty initials when pictureUrl is provided and name is sended", async () => {
        sut.setPicture({
            name: "any name",
            pictureUrl: "any_url",
        });

        expect(sut.pictureUrl).toBe("any_url");
        expect(sut.initials).toBe(undefined);
    });

    it("should create with empty initials when pictureUrl is provided and name is not provided", async () => {
        sut.setPicture({
            name: undefined,
            pictureUrl: "any_url",
        });

        expect(sut.pictureUrl).toBe("any_url");
        expect(sut.initials).toBe(undefined);
    });

    it("should create initials with first letter of fist and last name", async () => {
        sut.setPicture({
            name: "Rodrigo da Silva Manguinho",
            pictureUrl: undefined,
        });

        expect(sut.pictureUrl).toBe(undefined);
        expect(sut.initials).toBe("RM");
    });

    it("should create initials with first 2 letters of first name", async () => {
        sut.setPicture({
            name: "Rodrigo",
            pictureUrl: undefined,
        });

        expect(sut.pictureUrl).toBe(undefined);
        expect(sut.initials).toBe("RO");
    });

    it("should create initials with first letter", async () => {
        sut.setPicture({
            name: "R",
            pictureUrl: undefined,
        });

        expect(sut.pictureUrl).toBe(undefined);
        expect(sut.initials).toBe("R");
    });

    it("should create with empty initials when name and pictureUrl are not provided", async () => {
        sut.setPicture({
            name: "",
            pictureUrl: undefined,
        });

        expect(sut.pictureUrl).toBe(undefined);
        expect(sut.initials).toBe(undefined);
    });
});
