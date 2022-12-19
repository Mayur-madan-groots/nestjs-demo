import { Field, InputType } from "@nestjs/graphql";
import { MaxLength, MinLength } from "class-validator";

@InputType("loginInput")
export class LoginInput {
    @Field({ nullable: true })
    @MaxLength(30)
    username: string;

    @Field({ nullable: true })
    @MinLength(3)
    password: string;
}
