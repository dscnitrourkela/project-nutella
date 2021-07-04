/* eslint-disable import/prefer-default-export */
// Libraries
import {InputType, Field} from 'type-graphql';
import {ObjectID} from 'mongodb';

// Models
import {User} from './user.model';

// Utils + Types + Scalarss
import {ObjectIdScalar} from '../scalars';

@InputType({description: 'Input Type containing user properties'})
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

  @Field(() => [ObjectIdScalar], {nullable: true})
  quizzes: ObjectID[];
}
