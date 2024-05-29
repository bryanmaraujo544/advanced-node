import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repos/user-account";
import { IBackup } from "pg-mem";
import { getRepository, Repository, getConnection } from "typeorm";
import { makeFakeDb } from "@/tests/infra/postgres/mocks";

describe("PgUserAccountRepository", () => {
    let sut: PgUserAccountRepository;
    let pgUserRepo: Repository<PgUser>;
    let backup: IBackup;

    beforeAll(async () => {
        const db = await makeFakeDb();
        backup = db.backup();
        pgUserRepo = getRepository(PgUser);
    });
    afterAll(async () => {
        await getConnection().close();
    });
    beforeEach(() => {
        backup.restore();
        sut = new PgUserAccountRepository();
    });

    describe("load", () => {
        it("should return an account if email exists", async () => {
            await pgUserRepo.save({ email: "existing_email" });

            const account = await sut.load({ email: "existing_email" });

            expect(account).toEqual({ id: "1" });
        });

        it("should return undefined if email does not exists", async () => {
            const account = await sut.load({ email: "new_email" });

            expect(account).toBeUndefined();
        });
    });

    describe("saveWithFacebook", () => {
        it("should create an account if id is undefined", async () => {
            const accountCreated = await sut.saveWithFacebook({
                email: "any_email",
                name: "any_name",
                facebookId: "any_fb_id",
            });
            const pgUser = await pgUserRepo.findOne({
                email: "any_email",
            });

            expect(pgUser?.id).toBe(1);
            expect(accountCreated?.id).toBe("1");
        });

        it("should update an account if id is passed", async () => {
            await pgUserRepo.save({
                email: "any_email",
                name: "any_name",
                facebookId: "any_fb_id",
            });

            const accountUpdated = await sut.saveWithFacebook({
                id: "1",
                email: "updated_email",
                name: "updated_name",
                facebookId: "updated_fb_id",
            });
            const pgUser = await pgUserRepo.findOne({
                id: 1,
            });

            expect(pgUser).toEqual({
                id: 1,
                email: "any_email",
                name: "updated_name",
                facebookId: "updated_fb_id",
            });
            expect(accountUpdated?.id).toBe("1");
        });
    });
});