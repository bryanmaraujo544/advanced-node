import { UploadFile } from "../contracts/gateways/file-storage";
import { UUIDGenerator } from "../contracts/gateways/uuid";

type Setup = (
    fileStorage: UploadFile,
    crypto: UUIDGenerator
) => ChangeProfilePicture;
export type ChangeProfilePicture = (input: {
    userId: string;
    file: Buffer;
}) => Promise<void>;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => {
    return async ({ userId, file }) => {
        if (file) {
            await fileStorage.upload({
                file,
                key: crypto.uuid({ key: userId }),
            });
        }
    };
};
