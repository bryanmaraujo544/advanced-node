import { RequiredFieldError } from "../errors";

export class RequiredValidator {
    constructor(readonly value: any, readonly fieldName: string) {}

    validate(): Error | undefined {
        if (this.value === null || this.value === undefined) {
            return new RequiredFieldError(this.fieldName);
        }
    }
}

export class RequiredBufferValidator extends RequiredValidator {
    constructor(readonly value: Buffer, readonly fieldName: string) {
        super(value, fieldName);
    }

    validate(): Error | undefined {
        if (this.value.length === 0) {
            return new RequiredFieldError(this.fieldName);
        }
    }
}
