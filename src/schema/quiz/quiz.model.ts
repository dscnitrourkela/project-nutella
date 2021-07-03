// Libraries
import {Field, ObjectType, ID, GraphQLISODateTime} from 'type-graphql';
import {
  prop as Property,
  getModelForClass,
  modelOptions,
} from '@typegoose/typegoose';
import {ObjectId} from 'mongodb';

@modelOptions({options: {allowMixed: 0, customName: 'quizzes'}})
@ObjectType({description: 'The Quiz model'})
export class Quiz {
  @Field(() => ID, {description: 'Quiz MongoDB ObjectID'})
  id: ObjectId;

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
  @Field(() => [String], {
    description: 'An array containing the IDs of the questions',
    name: 'questionIds',
  })
  questions: string[];

  @Property({default: []})
  @Field(() => [String], {
    description: 'A list of all the instructions for the quiz',
  })
  instructions: string[];

  @Property({default: []})
  @Field(() => [String], {
    name: 'submissionIds',
    description:
      'An array of objects containing the student id and corresponding marks',
  })
  submissions: {id: string; marks: number}[];

  @Property({default: false})
  @Field({description: 'Status of the quiz (published or unpublished)'})
  active: boolean;
}

export const QuizModel = getModelForClass(Quiz);
