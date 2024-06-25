import { MockProxy, mock } from "jest-mock-extended";
import { UUIDGenerator } from "@/domain/contracts/gateways/uuid";
import { UploadFile } from "@/domain/contracts/gateways/file-storage";
import {
    ChangeProfilePicture,
    setupChangeProfilePicture,
} from "@/domain/use-cases/change-profile-picture";
import {
    LoadUserProfile,
    SaveUserPicture,
} from "@/domain/contracts/repos/user-profile";
import { mocked } from "jest-mock";
import { UserProfile } from "@/domain/entities/user-profile";

jest.mock("@/domain/entities/user-profile");

describe("ChangeProfilePicture", () => {
    let uuid: string;
    let fileStorage: MockProxy<UploadFile>;
    let file: Buffer;
    let crypto: MockProxy<UUIDGenerator>;
    let sut: ChangeProfilePicture;
    let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>;

    beforeAll(() => {
        uuid = "any_unique_id";
        fileStorage = mock();
        file = Buffer.from("any_buffer");
        crypto = mock();
        crypto.uuid.mockReturnValueOnce(uuid);
        userProfileRepo = mock();
        fileStorage.upload.mockResolvedValue("any_url");
        userProfileRepo.load.mockResolvedValue({
            name: "Rodrigo da Silva Manguinho",
        });
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

        expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
            mocked(UserProfile).mock.instances[0]
        );
        expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
    });

    it("should call LoadUserProfile when file is empty", async () => {
        await sut({
            userId: "any_id",
            file: undefined,
        });

        expect(userProfileRepo.load).toHaveBeenCalledWith({
            id: "any_id",
        });
        expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
    });

    it("should NOT call LoadUserProfile when file is sended", async () => {
        await sut({
            userId: "any_id",
            file,
        });

        expect(userProfileRepo.load).not.toHaveBeenCalled();
    });

    it("should return correct data on success", async () => {
        mocked(UserProfile).mockImplementationOnce((id) => ({
            setPicture: jest.fn() as any,
            id: "any_id",
            pictureUrl: "any_url",
            initials: "RM",
        }));

        const result = await sut({ userId: "any_id", file });
        expect(result).toMatchObject({
            pictureUrl: "any_url",
            initials: "RM",
        });
    });
});
