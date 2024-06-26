import { RequiredFieldError } from "../errors";

export class RequiredStringValidator {
    constructor(
        private readonly value: string,
        private readonly fieldName: string
    ) {}

    validate(): Error | undefined {
        if (!this.value) {
            return new RequiredFieldError(this.fieldName);
        }
    }
}
