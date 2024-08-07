import { Controller } from "@/application/controlllers/controller";
import { DeletePictureController } from "@/application/controlllers";

describe("DeletePictureController", () => {
    let changeProfilePicture: jest.Mock;
    let sut: DeletePictureController;

    beforeAll(() => {
        changeProfilePicture = jest.fn();
    });
    beforeEach(() => {
        sut = new DeletePictureController(changeProfilePicture);
    });

    it("should extend Controller", async () => {
        expect(sut).toBeInstanceOf(Controller);
    });

    it("should call ChangeProfilePicture with correct input", async () => {
        await sut.handle({ userId: "any_user_id" });

        expect(changeProfilePicture).toHaveBeenCalledWith({
            userId: "any_user_id",
        });
        expect(changeProfilePicture).toHaveBeenCalledTimes(1);
    });

    it("should return 204", async () => {
        const httpResponse = await sut.handle({ userId: "any_user_id" });
        expect(httpResponse).toEqual({
            statusCode: 204,
            data: null,
        });
    });
});
