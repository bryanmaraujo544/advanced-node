import { config } from "aws-sdk";

jest.mock("aws-sdk");

class AwsS3FileStorage {
    constructor(
        private readonly accessKey: string,
        private readonly secret: string
    ) {
        config.update({
            credentials: {
                accessKeyId: "",
                secretAccessKey: "",
            },
        });
    }
}

describe("AwsS3FileStorage", () => {
    it("should config aws credentials on creation", () => {
        const accessKey = "any_access_key";
        const secret = "any_secret";
        const sut = new AwsS3FileStorage(accessKey, secret);

        expect(config.update).toHaveBeenCalledWith({
            credentials: {
                accessKeyId: "",
                secretAccessKey: "",
            },
        });
        expect(config.update).toHaveBeenCalledTimes(1);
    });
});