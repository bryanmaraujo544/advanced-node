import { MockProxy, mock } from "jest-mock-extended";
import { UUIDGenerator } from "@/domain/contracts/gateways/uuid";
import { UploadFile } from "@/domain/contracts/gateways/file-storage";
import {
    ChangeProfilePicture,
    setupChangeProfilePicture,
} from "@/domain/use-cases/change-profile-picture";

describe("ChangeProfilePicture", () => {
    let uuid: string;
    let fileStorage: MockProxy<UploadFile>;
    let file: Buffer;
    let crypto: MockProxy<UUIDGenerator>;
    let sut: ChangeProfilePicture;

    beforeAll(() => {
        uuid = "any_unique_id";
        fileStorage = mock<UploadFile>();
        file = Buffer.from("any_buffer");
        crypto = mock<UUIDGenerator>();
        crypto.uuid.mockReturnValueOnce(uuid);
    });

    beforeEach(() => {
        sut = setupChangeProfilePicture(fileStorage, crypto);
    });

    it("should call UploadFile with correct input", async () => {
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
