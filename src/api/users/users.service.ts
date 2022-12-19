import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Constants } from "../../utils/constants";
import { comparePwd, generatePwd, generateToken } from "../../common/helper/common.helper";
import * as moment from "moment";
import { CreateUserInput } from "./dto/create-user.input";
import { UserHasDevice } from "../user-has-devices/entities/user-has-device.entity";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        @InjectRepository(UserHasDevice)
        private readonly userDeviceRepository: Repository<UserHasDevice>
    ) {
    }

    async getUser(id: number): Promise<User> {
        return await this.usersRepository.findOne({
            where: {
                id
            }
        });
    }

    async createEditUserRepo(body: CreateUserInput): Promise<User> {
        const user: User = new User();
        Object.assign(user, body);
        if (!body?.id) {
            const pwd     = Math.random().toString(36).slice(-8);
            user.password = generatePwd(pwd);
        }
        await this.usersRepository.save(user);
        return user;
    }

    async getUserByEmailOrName(obj: { username?: string }) {
        const { username } = obj;
        return await this.usersRepository.createQueryBuilder("user")
            .where(`(user.email = :username OR lower(user.name) = :username) AND user.deleted_at IS NULL`, { username: username?.toLowerCase() })
            .getOne();
    }

    async signInRepo(loginInput: any) {
        const user = await this.getUserByEmailOrName(loginInput);
        if (!user) {
            return {
                code   : Constants.Codes.not_authorized,
                message: Constants.CommonMessages.auth.notFound,
                status : false
            };
        }
        if (!user?.is_active) {
            return {
                code   : Constants.Codes.not_authorized,
                message: Constants.CommonMessages.auth.accountNotEnabled,
                status : false
            };
        }
        const pwdVerify = comparePwd(user?.password, loginInput.password);
        if (!pwdVerify) {
            return {
                code   : Constants.Codes.not_authorized,
                message: Constants.CommonMessages.auth.notFound,
                status : false
            };
        }
        const token = await generateToken({
            user_id: user?.id
        });
        await this.userDeviceRepository.save({
            token,
            user_id         : user?.id,
            token_expired_at: moment().add(process.env.JWT_EXPIRY, "days").toDate(),
            device_type     : "android"
        });
        return {
            code   : Constants.Codes.success,
            message: Constants.CommonMessages.auth.success,
            status : true,
            data   : {
                user,
                token
            }
        };
    }
}
