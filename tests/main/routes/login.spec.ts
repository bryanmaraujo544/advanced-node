import { getConnection } from "typeorm";
import request from "supertest";
import { IBackup } from "pg-mem";
import { app } from "@/main/config/app";
import { makeFakeDb } from "@/tests/infra/postgres/mocks";
import { UnathorizedError } from "@/application/errors";

describe("LoginRoutes", () => {
    let backup: IBackup;

    beforeAll(async () => {
        const db = await makeFakeDb();
        backup = db.backup();
    });
    afterAll(async () => {
        await getConnection().close();
    });
    beforeEach(() => {
        backup.restore();
    });

    describe("POST /login/facebook", () => {
        const loadUserSpy = jest.fn();
        jest.mock("@/infra/gateways/facebook-api", () => ({
            FacebookApi: jest.fn().mockReturnValue({
                loadUser: loadUserSpy,
            }),
        }));

        it("should return 200 with AccessToken", async () => {
            loadUserSpy.mockResolvedValueOnce({
                facebookId: "any_id",
                name: "any_name",
                email: "any_email",
            });
            const { status, body } = await request(app)
                .post("/api/login/facebook")
                .send({ token: "valid_token" });

            expect(status).toBe(200);
            expect(body.accessToken).toBeDefined();
        });

        it("should return 401 with UnauthorizedError", async () => {
            const { status, body } = await request(app)
                .post("/api/login/facebook")
                .send({ token: "invalid_token" });

            expect(status).toBe(401);
            expect(body.error).toBe(new UnathorizedError().message);
        });
    });
});
