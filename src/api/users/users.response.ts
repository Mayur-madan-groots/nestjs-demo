import { Field, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";
import { User } from "./entities/user.entity";

@ObjectType({ isAbstract: true })
export class UsersResponse {
    @Field({ nullable: true })
    token?: string;

    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => [User], { nullable: true })
    users?: User[];

    //custom response object
    @Field(() => GraphQLJSON, { nullable: true })
    response?: typeof GraphQLJSONObject;

    @Field(() => Int, { nullable: true })
    totalCount?: number;
}
