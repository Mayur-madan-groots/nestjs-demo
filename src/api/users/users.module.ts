import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { UserHasDevicesModule } from "../user-has-devices/user-has-devices.module";
import { UsersRepository } from "./users.repository";

@Module({
    imports  : [TypeOrmModule.forFeature([User]), UserHasDevicesModule],
    providers: [UsersService, UsersResolver, UsersRepository],
    exports  : [TypeOrmModule]
})
export class UserModule {
}
