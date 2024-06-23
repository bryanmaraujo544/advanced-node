import { mock } from "jest-mock-extended";

type Setup = (
    fileStorage: UploadFile,
    crypto: UUIDGenerator
) => ChangeProfilePicture;
type ChangeProfilePicture = (input: {
    userId: string;
    file: Buffer;
}) => Promise<void>;

const setupChangeProfilePicture: Setup = (fileStorage, crypto) => {
    return async ({ userId, file }) => {
        await fileStorage.upload({
            file,
            key: crypto.uuid({ key: userId }),
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

interface UUIDGenerator {
    uuid: (input: UUIDGenerator.Input) => string;
}
namespace UUIDGenerator {
    export type Input = {
        key: string;
    };
}
describe("ChangeProfilePicture", () => {
    it("should call UploadFile with correct input", async () => {
        const uuid = "any_unique_id";
        const fileStorage = mock<UploadFile>();
        const file = Buffer.from("any_buffer");
        const crypto = mock<UUIDGenerator>();
        crypto.uuid.mockReturnValueOnce(uuid);
        const sut = setupChangeProfilePicture(fileStorage, crypto);
        await sut({
            userId: "any_id",
            file,
        });

        expect(fileStorage.upload).toHaveBeenCalledWith({
            file,
            key: uuid,
        });
        expect(fileStorage.upload).toHaveBeenCalledTimes(1);
    });
});
