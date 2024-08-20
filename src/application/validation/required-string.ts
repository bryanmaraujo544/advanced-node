import { RequiredFieldError } from "../errors";
import { RequiredValidator } from "./required";

export class RequiredStringValidator extends RequiredValidator {
    constructor(
        override readonly value: string,
        override readonly fieldName: string
    ) {
        super(value, fieldName);
    }

    validate(): Error | undefined {
        if (!this.value) {
            return new RequiredFieldError(this.fieldName);
        }
    }
}
