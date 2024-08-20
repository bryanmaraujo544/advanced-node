import { ChangeProfilePicture } from "@/domain/use-cases/change-profile-picture";
import {
    InvalidMimeTypeError,
    MaxFileSizeError,
    RequiredFieldError,
} from "../errors";
import { HttpResponse, badRequest, ok } from "../helpers";
import { Controller } from "./controller";

type HttpRequest = {
    file: { buffer: Buffer; mimeType: string };
    userId: string;
};
type Model = Error | { initials?: string; pictureUrl?: string };

export class SavePictureController extends Controller {
    constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
        super();
    }

    async perform({ file }: HttpRequest): Promise<HttpResponse<Model>> {
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
