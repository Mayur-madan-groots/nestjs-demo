import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserHasDevicesService } from "./user-has-devices.service";
import { UserHasDevice } from "./entities/user-has-device.entity";
import { CreateUserHasDeviceInput } from "./dto/create-user-has-device.input";
import { UpdateUserHasDeviceInput } from "./dto/update-user-has-device.input";

@Resolver(() => UserHasDevice)
export class UserHasDevicesResolver {
  constructor(private readonly userHasDevicesService: UserHasDevicesService) {
  }

  @Mutation(() => UserHasDevice)
  createUserHasDevice(@Args("createUserHasDeviceInput") createUserHasDeviceInput: CreateUserHasDeviceInput) {
    //return this.userHasDevicesService.create(createUserHasDeviceInput);
  }

  @Query(() => [UserHasDevice], { name: "userHasDevices" })
  findAll() {
    return this.userHasDevicesService.findAll();
  }

  @Query(() => UserHasDevice, { name: "userHasDevice" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.userHasDevicesService.findOne(id);
  }

  @Mutation(() => UserHasDevice)
  updateUserHasDevice(@Args("updateUserHasDeviceInput") updateUserHasDeviceInput: UpdateUserHasDeviceInput) {
    return ""; //this.userHasDevicesService.update(updateUserHasDeviceInput.id, updateUserHasDeviceInput);
  }

  @Mutation(() => UserHasDevice)
  removeUserHasDevice(@Args("id", { type: () => Int }) id: number) {
    return this.userHasDevicesService.remove(id);
  }
}
