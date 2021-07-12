// Libraries
import {Field, ObjectType} from 'type-graphql';
import {
  prop as Property,
  getModelForClass,
  modelOptions,
} from '@typegoose/typegoose';
import {ObjectID} from 'mongodb';

// Utils + Types + Scalars
import {ObjectIdScalar} from '../scalars';

@modelOptions({options: {allowMixed: 0}})
@ObjectType({description: 'The User Model'})
export class User {
  @Field(() => ObjectIdScalar, {description: 'User MongoDB ObjectID'})
  _id: ObjectID;

  @Property({required: true, trim: true})
  @Field({description: 'Name of the user'})
  name: string;

  @Property({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  })
  @Field({description: 'Unique email of the user'})
  email: string;

  @Property({required: true, unique: true, trim: true})
  @Field({description: 'Unique phoneNo of the user'})
  phoneNo: string;

  @Property({required: true, unique: true, trim: true})
  @Field({description: 'Institute roll number of the student'})
  rollNo: string;

  @Property({default: []})
  @Field(() => [String], {
    description: 'An array of the fcm tokens of user devices',
    nullable: 'items',
  })
  fcmToken: string[];

  // TODO: Remove the nullable field, add unique
  @Property({required: true})
  @Field({description: 'Firebase ID of the user', nullable: true})
  uid: string;

  @Property({default: []})
  @Field(() => [ObjectIdScalar], {
    description: 'An array of IDs of the quiz',
    name: 'quizIds',
    nullable: 'items',
  })
  quizzes: ObjectID[];
}

export const UserModel = getModelForClass(User);
