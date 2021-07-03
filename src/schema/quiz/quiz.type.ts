/* eslint-disable import/prefer-default-export */
// Libraries
import {ObjectType, Field} from 'type-graphql';

// Models + Types
import {User} from '../user/user.model';

@ObjectType()
export class SubmissionType {
  @Field(() => User, {nullable: true})
  user: User | null;

  @Field({nullable: true})
  marks: number;
}
