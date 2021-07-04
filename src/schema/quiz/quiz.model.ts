// Libraries
import {Field, ObjectType, GraphQLISODateTime} from 'type-graphql';
import {
  prop as Property,
  getModelForClass,
  modelOptions,
} from '@typegoose/typegoose';
import {ObjectID} from 'mongodb';

// Utils + Types + Scalars
import {ObjectIdScalar} from '../scalars';
import {SubmissionType} from './quiz.type';

@modelOptions({options: {allowMixed: 0, customName: 'quizzes'}})
@ObjectType({description: 'The Quiz model'})
export class Quiz {
  @Field(() => ObjectIdScalar, {description: 'Quiz MongoDB ObjectID'})
  _id: ObjectID;

  @Property({required: true, trim: true})
  @Field({description: 'Name of the Quiz'})
  name: string;

  @Property({required: true})
  @Field(() => GraphQLISODateTime, {description: 'Start time of the Quiz'})
  startTime: Date;

  @Property({required: true})
  @Field(() => GraphQLISODateTime, {description: 'End time of the Quiz'})
  endTime: Date;

  @Property({default: []})
  @Field(() => [ObjectIdScalar], {
    description: 'An array containing the IDs of the questions',
    name: 'questionIds',
    nullable: true,
  })
  questions: ObjectID[];

  @Property({default: []})
  @Field(() => [String], {
    description: 'A list of all the instructions for the quiz',
  })
  instructions: string[];

  @Property({default: []})
  @Field(() => [SubmissionType], {
    name: 'submissionIds',
    description:
      'An array of objects containing the student id and corresponding marks',
  })
  submissions: {id: ObjectID; marks: number}[];

  @Property({default: false})
  @Field({description: 'Status of the quiz (published or unpublished)'})
  active: boolean;
}

export const QuizModel = getModelForClass(Quiz);
