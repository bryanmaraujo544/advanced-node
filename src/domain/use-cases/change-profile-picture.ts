import { UploadFile } from "../contracts/gateways/file-storage";
import { UUIDGenerator } from "../contracts/gateways/uuid";
import { SaveUserPicture } from "../contracts/repos/user-profile";

type Setup = (
    fileStorage: UploadFile,
    crypto: UUIDGenerator,
    userProfileRepo: SaveUserPicture
) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: {
    userId: string;
    file: Buffer;
}) => Promise<void>;

export const setupChangeProfilePicture: Setup = (
    fileStorage,
    crypto,
    userProfileRepo
) => {
    return async ({ userId, file }) => {
        let pictureUrl: string | undefined;
        if (file) {
            pictureUrl = await fileStorage.upload({
                file,
                key: crypto.uuid({ key: userId }),
            });
        }
        await userProfileRepo.savePicture({ pictureUrl });
    };
};
