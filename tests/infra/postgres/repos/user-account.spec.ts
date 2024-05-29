import { PgUser } from "@/infra/postgres/entities";
import { PgUserAccountRepository } from "@/infra/postgres/repos/user-account";
import { IBackup, newDb } from "pg-mem";
import { getRepository, Repository, getConnection } from "typeorm";

const makeFakeDb = async () => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
        type: "postgres",
        entities: [PgUser],
    });
    await connection.synchronize();

    return db;
};

describe("PgUserAccountRepository", () => {
    describe("load", () => {
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

        it("should return an account if email exists", async () => {
            await pgUserRepo.save({ email: "existing_email" });
            const sut = new PgUserAccountRepository();

            const account = await sut.load({ email: "existing_email" });

            expect(account).toEqual({ id: "1" });
        });

        it("should return undefined if email does not exists", async () => {
            const sut = new PgUserAccountRepository();

            const account = await sut.load({ email: "new_email" });

            expect(account).toBeUndefined();
        });
    });
});
