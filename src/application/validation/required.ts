import { RequiredFieldError } from "../errors";

export class RequiredValidator {
    constructor(readonly value: any, readonly fieldName: string) {}

    validate(): Error | undefined {
        if (this.value === null || this.value === undefined) {
            return new RequiredFieldError(this.fieldName);
        }
    }
}
