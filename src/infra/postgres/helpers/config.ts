import { ConnectionOptions } from "typeorm";

export const config: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "root",
    database: "advanced_node",
    entities: ["dist/infra/postgres/entities/index.js"],
};
