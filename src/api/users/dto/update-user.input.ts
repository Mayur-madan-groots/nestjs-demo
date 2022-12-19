import { Field, InputType, Int } from "@nestjs/graphql";

@InputType("updateUserInput")
export class UpdateUserInput {
    @Field(() => Int)
    id: number;
}
