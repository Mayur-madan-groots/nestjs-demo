import { CreateUserHasDeviceInput } from './create-user-has-device.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserHasDeviceInput extends PartialType(CreateUserHasDeviceInput) {
  @Field(() => Int)
  id: number;
}
