import { RequiredFieldError } from "@/application/errors";
import { HttpResponse, badRequest, ok } from "@/application/helpers";
import { ChangeProfilePicture } from "@/domain/use-cases/change-profile-picture";

type HttpRequest = {
    file: { buffer: Buffer; mimeType: string };
    userId: string;
};
type Model = Error | { initials?: string; pictureUrl?: string };

class SavePictureController {
    constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}
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

        if (file.buffer.length > 5 * 1024 * 1024) {
            return badRequest(new MaxFileSizeError(5));
        }

        const data = await this.changeProfilePicture({
            userId: "any_user_id",
            file: file.buffer,
        });

        return ok(data);
    }
}

class InvalidMimeTypeError extends Error {
    constructor(allowed: string[]) {
        super(`Unsupported file type. Allowed types: ${allowed.join(",")}`);
        this.name = "InvalidMimeTypeError";
    }
}

class MaxFileSizeError extends Error {
    constructor(sizeInMb: number) {
        super(`File size must be lower than ${sizeInMb}MB`);
        this.name = "MaxFileSizeError";
    }
}

describe("SavePictureController", () => {
    let sut: SavePictureController;
    let buffer: Buffer;
    let file: { buffer: Buffer; mimeType: string };
    let userId: string;
    let mimeType: string;
    let changeProfilePicture: jest.Mock;

    beforeAll(() => {
        buffer = Buffer.from("any_buffer");
        file = { buffer, mimeType: "image/png" };
        mimeType = "image/png";
        changeProfilePicture = jest.fn().mockResolvedValue({
            initial: "any_initials",
            pictureUrl: "any_url",
        });
        userId = "any_user_id";
    });
    beforeEach(() => {
        sut = new SavePictureController(changeProfilePicture);
    });

    it("should return 400 if file is null", async () => {
        const httpResponse = await sut.handle({
            file: undefined as any,
            userId,
        });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new RequiredFieldError("file"),
        });
    });

    it("should return 400 if file is empty", async () => {
        const httpResponse = await sut.handle({
            file: { buffer: Buffer.from(""), mimeType },
            userId,
        });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new RequiredFieldError("file"),
        });
    });

    it("should return 400 if file type is invalid", async () => {
        const httpResponse = await sut.handle({
            file: { buffer, mimeType: "invalid_type" },
            userId,
        });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new InvalidMimeTypeError(["png", "jpeg"]),
        });
    });

    it("should NOT return 400 if file type is valid", async () => {
        const httpResponse = await sut.handle({
            file: { buffer, mimeType: "image/jpg" },
            userId,
        });

        expect(httpResponse).toMatchObject({
            statusCode: 200,
        });
    });

    it("should NOT return 400 if file type is valid", async () => {
        const httpResponse = await sut.handle({
            file: { buffer, mimeType: "image/jpeg" },
            userId,
        });

        expect(httpResponse).toMatchObject({
            statusCode: 200,
        });
    });

    it("should NOT return 400 if file type is valid", async () => {
        const httpResponse = await sut.handle({
            file: { buffer, mimeType: "image/jpeg" },
            userId,
        });

        expect(httpResponse).toMatchObject({
            statusCode: 200,
        });
    });

    it("should return 400 if file size is bigger than 5MB", async () => {
        const invalidBuffer = Buffer.alloc(6 * 1024 * 1024);
        const httpResponse = await sut.handle({
            file: { buffer: invalidBuffer, mimeType: "image/jpeg" },
            userId,
        });

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new MaxFileSizeError(5),
        });
    });

    it("should call ChangeProfilePicture with correct input", async () => {
        const httpResponse = await sut.handle({
            file,
            userId,
        });

        expect(changeProfilePicture).toHaveBeenCalledWith({
            userId,
            file: buffer,
        });
        expect(changeProfilePicture).toHaveBeenCalledTimes(1);
    });

    it("should return 200 with valid data", async () => {
        const httpResponse = await sut.handle({ file, userId });

        expect(httpResponse).toEqual({
            statusCode: 200,
            data: {
                initial: "any_initials",
                pictureUrl: "any_url",
            },
        });
    });
});
