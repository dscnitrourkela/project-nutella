/* eslint-disable @typescript-eslint/no-unused-vars */
// Libraries
import {Field, ObjectType, ID} from 'type-graphql';
import {prop as Property, getModelForClass} from '@typegoose/typegoose';
import {ObjectId} from 'mongodb';

// Models
import {QuizModel, Quiz} from '../quiz/quiz.model';

@ObjectType({description: 'The User Model'})
export class User {
  @Field(() => ID, {description: 'User MongoDB ObjectID'})
  id: ObjectId;

  @Property({required: true, trim: true})
  @Field({description: 'Name of the user'})
  name: string;

  @Property({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match:
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@gmail(.([^<>()[\].,;:\s@"]{2,})){1,}$/i,
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
  })
  fcmToken: string[];

  @Property({required: true, unique: true})
  @Field({description: 'Firebase ID of the user'})
  uid: string;

  @Property({default: []})
  @Field(() => [String], {
    description: 'An array of IDs of the quiz',
    name: 'questionIds',
  })
  quiz: string[];

  // TODO: resolve the quiz IDs into quizzes after creation of quiz model
}

export const UserModel = getModelForClass(User);
