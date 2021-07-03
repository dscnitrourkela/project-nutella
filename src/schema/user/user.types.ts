/* eslint-disable import/prefer-default-export */
// Libraries
import {InputType, Field} from 'type-graphql';

// Models + Types
import {User} from './user.model';

@InputType()
export class UserInput implements Partial<User> {
  @Field({nullable: true})
  name: string;

  @Field({nullable: true})
  email: string;

  @Field({nullable: true})
  phoneNo: string;

  @Field({nullable: true})
  rollNo: string;

  @Field(() => [String], {nullable: true})
  fcmToken: string[];

  @Field(() => [String], {nullable: true})
  quizzes: string[];
}
