import { RequiredFieldError } from "@/application/errors";
import {
    RequiredBufferValidator,
    RequiredValidator,
} from "@/application/validation";

describe("Required", () => {
    it("should return RequiredStringValidator if value is null", () => {
        const sut = new RequiredValidator(null as any, "any_field");
        const error = sut.validate();

        expect(error).toEqual(new RequiredFieldError("any_field"));
    });

    it("should return RequiredStringValidator if value is undefined", () => {
        const sut = new RequiredValidator(undefined as any, "any_field");
        const error = sut.validate();

        expect(error).toEqual(new RequiredFieldError("any_field"));
    });
});

describe("RequiredBufferValidator", () => {
    it("should return RequiredBufferValidator if value is null", () => {
        const sut = new RequiredBufferValidator(Buffer.from(""), "any_field");
        const error = sut.validate();

        expect(error).toEqual(new RequiredFieldError("any_field"));
    });

    it("should return undefined if value is not empty", () => {
        const sut = new RequiredBufferValidator(
            Buffer.from("123"),
            "any_field"
        );
        const error = sut.validate();

        expect(error).toBeUndefined();
    });
});
