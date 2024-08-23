import { InvalidMimeTypeError } from "../errors";

type Extension = "png" | "jpg";

export class AllowedMimeTypes {
    constructor(
        private readonly allowed: Extension[],
        private readonly value: string
    ) {}

    validate(): Error | undefined {
        let isValid = false;

        if (this.value === "image/png" && this.allowed.includes("png")) {
            isValid = true;
        }
        if (/image\/jpe?g/.test(this.value) && this.allowed.includes("jpg")) {
            isValid = true;
        }
        if (this.value === "image/jpg" && this.allowed.includes("jpg")) {
            isValid = true;
        }

        if (!isValid) {
            return new InvalidMimeTypeError(this.allowed);
        }

        return undefined;
    }
}
