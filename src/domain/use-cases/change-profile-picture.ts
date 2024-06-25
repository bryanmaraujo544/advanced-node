import { UploadFile } from "../contracts/gateways/file-storage";
import { UUIDGenerator } from "../contracts/gateways/uuid";
import {
    LoadUserProfile,
    SaveUserPicture,
} from "../contracts/repos/user-profile";
import { UserProfile } from "../entities";

type Setup = (
    fileStorage: UploadFile,
    crypto: UUIDGenerator,
    userProfileRepo: SaveUserPicture & LoadUserProfile
) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: {
    userId: string;
    file: Buffer | undefined;
}) => Promise<void>;

export const setupChangeProfilePicture: Setup = (
    fileStorage,
    crypto,
    userProfileRepo
) => {
    return async ({ userId, file }) => {
        const data: { pictureUrl?: string; name?: string } = {};

        if (file) {
            data.pictureUrl = await fileStorage.upload({
                file,
                key: crypto.uuid({ key: userId }),
            });
        } else {
            const user = await userProfileRepo.load({ id: userId });
            data.name = user?.name;
        }

        const userProfile = new UserProfile(userId);
        userProfile.setPicture(data);

        await userProfileRepo.savePicture(userProfile);
    };
};
