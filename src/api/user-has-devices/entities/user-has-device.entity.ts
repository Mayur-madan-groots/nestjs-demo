import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@ObjectType()
@Entity("user_has_devices")
@InputType("userHasDevice")
export class UserHasDevice extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id?: number;

    @Field({ nullable: true })
    @CreateDateColumn({ type: "timestamp" })
    created_at?: Date;

    @Field({ nullable: true })
    @UpdateDateColumn({ type: "timestamp" })
    updated_at?: Date;

    @Field({ nullable: true })
    @DeleteDateColumn({ type: "timestamp" })
    deleted_at?: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    token?: string;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    user_id?: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    device_type?: string;

    @Field({ nullable: true })
    @DeleteDateColumn({ type: "timestamp" })
    token_expired_at?: Date;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, {
        onDelete: "CASCADE",
        nullable: true
    })
    @JoinColumn({
        name: "user_id"
    })
    user?: User;
}
