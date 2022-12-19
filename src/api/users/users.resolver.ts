import { Inject } from "@nestjs/common";
import { Args, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { Constants } from "../../utils/constants";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import CommonResponse from "../../responses/common.response";
import { UsersResponse } from "./users.response";
import { Public } from "../auth/auth.guard";
import { LoginInput } from "../../utils/input/login.input";
import { reportErrorSlack } from "../../common/helper/common.helper";
import { CreateUserInput } from "./dto/create-user.input";

@ObjectType()
class UserApiResponse extends CommonResponse(UsersResponse) {
}

@Resolver(() => User)
export class UsersResolver {
    constructor(@Inject(UsersService) private usersService: UsersService) {
    }

    @Public()
    @Query(() => UserApiResponse, { nullable: true })
    async signIn(
        @Args("loginInput") loginInput: LoginInput
    ) {
        try {
            return await this.usersService.signInRepo(loginInput);
        } catch (e) {
            reportErrorSlack(e, true, "signIn", loginInput).then();
            return {
                code   : Constants.Codes.exception,
                message: e?.message,
                status : false
            };
        }
    }

    @Public()
    @Mutation(() => UserApiResponse, { nullable: true })
    async createEditUser(
        @Args("createUserInput") createUserInput: CreateUserInput
    ) {
        try {
            const user = await this.usersService.createEditUserRepo(createUserInput);
            if (user) {
                return {
                    code   : Constants.Codes.success,
                    message: createUserInput?.id ? Constants.CommonMessages.user.updateSuccess : Constants.CommonMessages.user.createSuccess,
                    status : true,
                    data   : { user }
                };
            }
            return {
                code   : Constants.Codes.exception,
                message: Constants.CommonMessages.tryAgain,
                status : false
            };
        } catch (e) {
            reportErrorSlack(e, true, "createEditUser", createUserInput).then();
            return {
                code   : Constants.Codes.exception,
                message: e?.message,
                status : false
            };
        }
    }
}
