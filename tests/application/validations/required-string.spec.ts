import { RequiredFieldError } from "@/application/errors";
import {
    RequiredStringValidator,
    RequiredValidator,
} from "@/application/validation";

describe("RequiredStringValidator", () => {
    it("should extend Required", () => {
        const sut = new RequiredStringValidator("", "any_field");

        expect(sut).toBeInstanceOf(RequiredValidator);
    });

    it("should return RequiredStringValidator if value is empty", () => {
        const sut = new RequiredStringValidator("", "any_field");
        const error = sut.validate();

        expect(error).toEqual(new RequiredFieldError("any_field"));
    });

    it("should return undefined if value is not empty", () => {
        const sut = new RequiredStringValidator("any_value", "any_field");
        const error = sut.validate();

        expect(error).toBeUndefined();
    });
});
