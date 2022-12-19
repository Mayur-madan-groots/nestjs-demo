import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("User")
@Entity("users")
@InputType("UserInput")
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id?: number;

    @Field({ nullable: true })
    @Column()
    public name?: string;

    @Field({ nullable: true })
    @Column()
    public password?: string;

    @Field({ nullable: true })
    @Column()
    public email?: string;

    @Field({ nullable: true })
    @Column()
    public mobile_number?: string;

    @Field({ nullable: true })
    @Column()
    public is_active?: boolean;

    @Field({ nullable: true })
    @CreateDateColumn({ type: "timestamp" })
    public created_at?: Date;

    @Field({ nullable: true })
    @UpdateDateColumn({ type: "timestamp" })
    public updated_at?: Date;

    @Field({ nullable: true })
    @DeleteDateColumn({ type: "timestamp" })
    public deleted_at?: Date;
}
