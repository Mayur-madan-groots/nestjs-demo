import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserHasDevice1659091050495 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name   : "user_has_devices",
            columns: [
                {
                    name              : "id",
                    type              : "int",
                    isPrimary         : true,
                    isGenerated       : true,
                    generationStrategy: "increment"
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
                    name      : "token",
                    type      : "text",
                    isNullable: true
                },
                {
                    name: "user_id",
                    type: "int"
                },
                {
                    name  : "device_type",
                    type  : "varchar",
                    length: "255"
                },
                {
                    name      : "token_expired_at",
                    type      : "timestamp",
                    isNullable: true
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(`user_has_devices`);
    }
}
