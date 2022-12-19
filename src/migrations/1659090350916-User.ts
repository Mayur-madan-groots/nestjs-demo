import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class User1659090350916 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name   : "users",
            columns: [
                {
                    name              : "id",
                    type              : "int",
                    isPrimary         : true,
                    generationStrategy: "increment",
                    isGenerated       : true
                },
                {
                    name   : "created_at",
                    type   : "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name   : "updated_at",
                    type   : "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name      : "deleted_at",
                    type      : "timestamp",
                    isNullable: true
                },
                {
                    name  : "name",
                    type  : "varchar",
                    length: "255"
                },
                {
                    name  : "email",
                    type  : "varchar",
                    length: "255"
                },
                {
                    name  : "mobile_number",
                    type  : "varchar",
                    length: "255"
                },
                {
                    name  : "password",
                    type  : "varchar",
                    length: "255"
                },
                {
                    name   : "is_active",
                    type   : "boolean",
                    default: true
                },
                {
                    name      : "timezone",
                    type      : "varchar",
                    length    : "255",
                    isNullable: true
                }
            ]
        }));

        await queryRunner.createIndex("users", new TableIndex({
            name       : "IDX_USERS_TABLE_EMAIL",
            columnNames: ["email"]
        }));

        await queryRunner.createIndex("users", new TableIndex({
            name       : "IDX_USERS_TABLE_NAME",
            columnNames: ["name"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("users", "IDX_USERS_TABLE_EMAIL");
        await queryRunner.dropIndex("users", "IDX_USERS_TABLE_NAME");
        await queryRunner.dropTable("users");
    }

}
