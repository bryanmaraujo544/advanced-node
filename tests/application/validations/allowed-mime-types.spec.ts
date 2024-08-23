import { InvalidMimeTypeError } from "@/application/errors";

type Extension = "png" | "jpg";

class AllowedMimeTypes {
    constructor(
        private readonly allowed: Extension[],
        private readonly value: string
    ) {}

    validate(): Error {
        return new InvalidMimeTypeError(this.allowed);
    }
}

describe("AllowedMimeTypes", () => {
    it("should return InvalidMimeTypeError if value is invalid", () => {
        const sut = new AllowedMimeTypes(["png"], "image/png");

        const error = sut.validate();
        expect(error).toEqual(new InvalidMimeTypeError(["png"]));
    });
});
