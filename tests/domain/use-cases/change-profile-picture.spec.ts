import { mock } from "jest-mock-extended";

type Setup = (fileStorage: UploadFile) => ChangeProfilePicture;
type ChangeProfilePicture = (input: {
    userId: string;
    file: Buffer;
}) => Promise<void>;

const setupChangeProfilePicture: Setup = (fileStorage) => {
    return async ({ userId, file }) => {
        await fileStorage.upload({
            file,
            key: userId,
        });
    };
};

interface UploadFile {
    upload: (input: UploadFile.Input) => Promise<void>;
}
namespace UploadFile {
    export type Input = {
        file: Buffer;
        key: string;
    };
}
describe("ChangeProfilePicture", () => {
    it("should call UploadFile with correct input", async () => {
        const fileStorage = mock<UploadFile>();
        const file = Buffer.from("any_buffer");
        const sut = setupChangeProfilePicture(fileStorage);
        await sut({
            userId: "any_id",
            file,
        });

        expect(fileStorage.upload).toHaveBeenCalledWith({
            file,
            key: "any_id",
        });
        expect(fileStorage.upload).toHaveBeenCalledTimes(1);
    });
});
