import { UploadFile } from "@/domain/contracts/gateways/file-storage";
import { config, S3 } from "aws-sdk";
import { mocked } from "jest-mock";

jest.mock("aws-sdk");

class AwsS3FileStorage {
    constructor(
        accessKey: string,
        secret: string,
        private readonly bucket: string
    ) {
        config.update({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secret,
            },
        });
    }

    async upload({ key, file }: UploadFile.Input): Promise<void> {
        const s3 = new S3();

        s3.putObject({
            Bucket: this.bucket,
            Key: key,
            Body: file,
            ACL: "public-read",
        }).promise();
    }
}

describe("AwsS3FileStorage", () => {
    let sut: AwsS3FileStorage;
    let accessKey: string;
    let secret: string;
    let bucket: string;
    let file: Buffer;
    let key: string;
    let putObjectPromiseSpy: jest.Mock;
    let putObjectSpy: jest.Mock;
    beforeAll(() => {
        accessKey = "any_access_key";
        secret = "any_secret";
        bucket = "any_bucket";
        file = Buffer.from("any_file");
        key = "any_key";

        putObjectPromiseSpy = jest.fn();
        putObjectSpy = jest
            .fn()
            .mockImplementation(() => ({ promise: putObjectPromiseSpy }));
        mocked(S3).mockImplementation(
            jest.fn().mockImplementation(() => ({
                putObject: putObjectSpy,
            }))
        );
    });

    beforeEach(() => {
        sut = new AwsS3FileStorage(accessKey, secret, bucket);
    });

    it("should config aws credentials on creation", () => {
        expect(config.update).toHaveBeenCalledWith({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secret,
            },
        });
        expect(config.update).toHaveBeenCalledTimes(1);
    });

    it("should call putObject with correct input", async () => {
        await sut.upload({
            key,
            file,
        });

        expect(putObjectSpy).toHaveBeenCalledWith({
            Bucket: bucket,
            Key: key,
            Body: file,
            ACL: "public-read",
        });
        expect(putObjectSpy).toHaveBeenCalledTimes(1);
        expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });
});
