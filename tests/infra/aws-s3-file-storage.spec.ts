import { AwsS3FileStorage } from "@/domain/contracts/gateways/aws-s3-file-storage";
import { config, S3 } from "aws-sdk";
import { mocked } from "jest-mock";

jest.mock("aws-sdk");

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
    });

    beforeEach(() => {
        putObjectPromiseSpy = jest.fn();
        putObjectSpy = jest
            .fn()
            .mockImplementation(() => ({ promise: putObjectPromiseSpy }));
        mocked(S3).mockImplementation(
            jest.fn().mockImplementation(() => ({
                putObject: putObjectSpy,
            }))
        );

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

    it("should return imageUrl", async () => {
        const imageUrl = await sut.upload({
            key,
            file,
        });

        expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`);
    });

    it("should return encoded imageUrl", async () => {
        const imageUrl = await sut.upload({
            key: "any key",
            file,
        });

        expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`);
    });
});
