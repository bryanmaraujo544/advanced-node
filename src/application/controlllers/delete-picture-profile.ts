import { ChangeProfilePicture } from "@/domain/use-cases/change-profile-picture";
import { HttpResponse, noContent } from "@/application/helpers/http";
import { Controller } from "@/application/controlllers/controller";

type HttpRequest = { userId: string };

export class DeletePictureController extends Controller {
    constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
        super();
    }

    async perform(httpRequest: HttpRequest): Promise<HttpResponse> {
        await this.changeProfilePicture({ userId: httpRequest.userId });

        return noContent();
    }
}
