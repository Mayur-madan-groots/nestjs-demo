import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";

export default function CommonResponse<T>(classRef: Type<T>): Type<T> {
    @ObjectType({ isAbstract: true })
    abstract class CommonResponseClass {
        @Field(() => Int, { defaultValue: 200 })
        code?: number;

        @Field({ defaultValue: true })
        status: boolean;

        @Field(() => classRef, { nullable: true })
        data?: T;

        @Field({ defaultValue: "No message to display" })
        message: string;
    }

    // @ts-ignore
    return CommonResponseClass;
}
