import { Validator } from "./";

export class ValidationComposite implements Validator {
    constructor(private readonly validators: Validator[]) {}

    validate(): undefined | Error {
        for (const validator of this.validators) {
            const error = validator.validate();
            if (error) {
                return error;
            }
        }
    }
}
