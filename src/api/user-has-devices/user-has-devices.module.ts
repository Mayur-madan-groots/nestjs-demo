import { Module } from "@nestjs/common";
import { UserHasDevicesService } from "./user-has-devices.service";
import { UserHasDevicesResolver } from "./user-has-devices.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserHasDevice } from "./entities/user-has-device.entity";

@Module({
  imports  : [TypeOrmModule.forFeature([UserHasDevice])],
  providers: [UserHasDevicesResolver, UserHasDevicesService],
  exports  : [TypeOrmModule, UserHasDevicesService]
})
export class UserHasDevicesModule {
}
