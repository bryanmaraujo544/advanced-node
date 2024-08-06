import { ChangeProfilePicture } from "@/domain/use-cases/change-profile-picture";

type HttpRequest = { userId: string };

class DeletePictureController {
    constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}
    async handle(httpRequest: HttpRequest): Promise<void> {
        await this.changeProfilePicture({ userId: httpRequest.userId });
    }
}

describe("DeletePictureController", () => {
    it("should call ChangeProfilePicture with correct input", async () => {
        const changeProfilePicture = jest.fn();
        const sut = new DeletePictureController(changeProfilePicture);

        await sut.handle({ userId: "any_user_id" });

        expect(changeProfilePicture).toHaveBeenCalledWith({
            userId: "any_user_id",
        });
        expect(changeProfilePicture).toHaveBeenCalledTimes(1);
    });
});
