import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "../entities/user.entity";

@InputType("createUserInput")
export class CreateUserInput extends PartialType(User) {
    @IsOptional()
    @Field(() => Int, { nullable: true })
    id: number;

    @IsString()
    @IsNotEmpty()
    @Field({ nullable: true })
    public name: string;

    @IsEmail()
    @Field({ nullable: true })
    public email: string;

    @IsString()
    @Field({ nullable: true })
    public mobile_number: string;
}
