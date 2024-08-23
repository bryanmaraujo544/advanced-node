import { InvalidMimeTypeError } from "@/application/errors";

type Extension = "png" | "jpg";

class AllowedMimeTypes {
    constructor(
        private readonly allowed: Extension[],
        private readonly value: string
    ) {}

    validate(): Error | undefined {
        if (this.allowed.includes("png") && this.value !== "image/png") {
            return new InvalidMimeTypeError(this.allowed);
        }
        return undefined;
    }
}

describe("AllowedMimeTypes", () => {
    it("should return InvalidMimeTypeError if value is invalid", () => {
        const sut = new AllowedMimeTypes(["png"], "image/jpg");

        const error = sut.validate();
        expect(error).toEqual(new InvalidMimeTypeError(["png"]));
    });

    it("should return undefined if value is valid", () => {
        const sut = new AllowedMimeTypes(["png"], "image/png");

        const error = sut.validate();
        expect(error).toBeUndefined();
    });
});
