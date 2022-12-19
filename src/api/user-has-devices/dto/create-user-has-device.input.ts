import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserHasDeviceInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
