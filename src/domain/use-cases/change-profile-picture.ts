import { UploadFile } from "../contracts/gateways/file-storage";
import { UUIDGenerator } from "../contracts/gateways/uuid";
import {
    LoadUserProfile,
    SaveUserPicture,
} from "../contracts/repos/user-profile";

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
        let pictureUrl: string | undefined;
        let initials: string | undefined;

        if (file) {
            pictureUrl = await fileStorage.upload({
                file,
                key: crypto.uuid({ key: userId }),
            });
        } else {
            const user = await userProfileRepo.load({ id: userId });

            if (user?.name) {
                const firstLetters = user?.name?.match(/\b(.)/g) ?? [];
                if (firstLetters?.length > 1) {
                    initials = `${firstLetters
                        .shift()
                        ?.toUpperCase()}${firstLetters.pop()?.toUpperCase()}`;
                } else {
                    initials = user?.name?.substring(0, 2)?.toUpperCase();
                }
            }
        }

        await userProfileRepo.savePicture({ pictureUrl, initials });
    };
};
