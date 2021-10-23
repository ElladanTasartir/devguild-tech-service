import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTechnologyInput {
  @Field(() => String)
  name: string;
}
