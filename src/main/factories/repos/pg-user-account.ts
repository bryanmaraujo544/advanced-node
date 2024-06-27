import { PgUserAccountRepository } from "@/infra/repos/postgres/user-account";

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
    return new PgUserAccountRepository();
};
