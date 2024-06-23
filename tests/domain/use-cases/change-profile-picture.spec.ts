import { MockProxy, mock } from "jest-mock-extended";
import { UUIDGenerator } from "@/domain/contracts/gateways/uuid";
import { UploadFile } from "@/domain/contracts/gateways/file-storage";
import {
    ChangeProfilePicture,
    setupChangeProfilePicture,
} from "@/domain/use-cases/change-profile-picture";
import { SaveUserPicture } from "@/domain/contracts/repos/user-profile";

describe("ChangeProfilePicture", () => {
    let uuid: string;
    let fileStorage: MockProxy<UploadFile>;
    let file: Buffer;
    let crypto: MockProxy<UUIDGenerator>;
    let sut: ChangeProfilePicture;
    let userProfileRepo: MockProxy<SaveUserPicture>;

    beforeAll(() => {
        uuid = "any_unique_id";
        fileStorage = mock();
        file = Buffer.from("any_buffer");
        crypto = mock();
        crypto.uuid.mockReturnValueOnce(uuid);
        userProfileRepo = mock();
        fileStorage.upload.mockResolvedValue("any_url");
    });

    beforeEach(() => {
        sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo);
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

    it("should not call UploadFile when file is undefined", async () => {
        await sut({
            userId: "any_id",
            file: undefined as any,
        });

        expect(fileStorage.upload).not.toHaveBeenCalled();
    });

    it("should call SaveUserPicture with correct input", async () => {
        await sut({
            userId: "any_id",
            file,
        });

        expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
            pictureUrl: "any_url",
        });
        expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
    });

    it("should call SaveUserPicture with correct input when file empty", async () => {
        await sut({
            userId: "any_id",
            file: undefined as any,
        });

        expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
            pictureUrl: undefined,
        });
        expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
    });
});
