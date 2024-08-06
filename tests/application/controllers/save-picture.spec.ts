import { RequiredFieldError } from "@/application/errors";
import { HttpResponse, badRequest } from "@/application/helpers";

type HttpRequest = { file: { buffer: Buffer; mimeType: string } };
type Model = Error | null;

class SavePictureController {
    async handle({ file }: HttpRequest): Promise<HttpResponse<Model>> {
        if (!file) {
            return badRequest(new RequiredFieldError("file"));
        }

        if (file.buffer.length === 0) {
            return badRequest(new RequiredFieldError("file"));
        }

        const validTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (!validTypes.includes(file.mimeType)) {
            return badRequest(new InvalidMimeTypeError(["png", "jpeg"]));
        }

        return { data: null, statusCode: 200 };
    }
}

class InvalidMimeTypeError extends Error {
    constructor(allowed: string[]) {
        super(`Unsupported file type. Allowed types: ${allowed.join(",")}`);
        this.name = "InvalidMimeTypeError";
    }
}

describe("SavePictureController", () => {
    let sut: SavePictureController;
    let buffer: Buffer;
    let file: { buffer: Buffer };
    let mimeType: string;

    beforeAll(() => {
        buffer = Buffer.from("any_buffer");
        file = { buffer };
        mimeType = "image/png";
    });
    beforeEach(() => {
        sut = new SavePictureController();
    });

    it("should return 400 if file is null", async () => {
        const httpResponse = await sut.handle({
            file: undefined as any,
        });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new RequiredFieldError("file"),
        });
    });

    it("should return 400 if file is empty", async () => {
        const httpResponse = await sut.handle({
            file: { buffer: Buffer.from(""), mimeType },
        });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new RequiredFieldError("file"),
        });
    });

    it("should return 400 if file type is invalid", async () => {
        const httpResponse = await sut.handle({
            file: { buffer, mimeType: "invalid_type" },
        });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new InvalidMimeTypeError(["png", "jpeg"]),
        });
    });

    it("should NOT return 400 if file type is valid", async () => {
        const httpResponse = await sut.handle({
            file: { buffer, mimeType: "image/jpg" },
        });

        expect(httpResponse).toMatchObject({
            statusCode: 200,
        });
    });

    it("should NOT return 400 if file type is valid", async () => {
        const httpResponse = await sut.handle({
            file: { buffer, mimeType: "image/jpeg" },
        });

        expect(httpResponse).toMatchObject({
            statusCode: 200,
        });
    });

    it("should NOT return 400 if file type is valid", async () => {
        const httpResponse = await sut.handle({
            file: { buffer, mimeType: "image/jpeg" },
        });

        expect(httpResponse).toMatchObject({
            statusCode: 200,
        });
    });
});
