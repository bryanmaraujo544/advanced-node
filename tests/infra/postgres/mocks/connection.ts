import { newDb } from "pg-mem";

export const makeFakeDb = async () => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
        type: "postgres",
        entities: ["src/infra/repos/postgres/entities/index.ts"],
    });
    await connection.synchronize();

    return db;
};
