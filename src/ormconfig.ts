import { DataSource } from "typeorm";
import { getEnvPath } from "./common/helper/env.helper";

require("dotenv").config({
    path: getEnvPath(__dirname + "/common/envs")
});

export const AppDataSource = new DataSource({
    name       : "default",
    type       : "postgres",
    replication: {
        master: {
            host    : process.env.DATABASE_HOST,
            port    : parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        },
        slaves: [{
            host    : process.env.DATABASE_HOST,
            port    : parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        }]
    },
    // cache         : {
    //     type   : "redis",
    //     options: {
    //         host: "localhost",
    //         port: 6379
    //     }
    // },
    synchronize  : false,
    migrationsRun: false,
    logging      : [],
    //logging: ["query", "error"],
    migrations : [
        process.env.BUILD_DIR + "/migrations/**/*{.ts,.js}"
    ],
    subscribers: [
        process.env.BUILD_DIR + "/subscriber/**/*{.ts,.js}"
    ],
    entities   : [
        process.env.BUILD_DIR + "/**/*.entity{.ts,.js}"
    ]
});
