/* eslint-disable @typescript-eslint/no-unused-vars */
// Libraries
import {Field, ObjectType, ID} from 'type-graphql';
import {
  prop as Property,
  getModelForClass,
  modelOptions,
} from '@typegoose/typegoose';
import {ObjectId} from 'mongodb';

@modelOptions({options: {allowMixed: 0}})
@ObjectType({description: 'The Question Model'})
export class Question {
  @Field(() => ID, {description: 'Question MongoDB ObjectID'})
  id: ObjectId;

  @Property({required: true, trim: true})
  @Field({description: 'Question string'})
  question: string;

  @Property({required: false, default: ''})
  @Field({description: 'Image present in the question'})
  image: string;

  @Property({required: true})
  @Field(() => [String], {
    description: 'Multiple choice answers for the question',
  })
  options: string[];

  @Property({required: true, trim: true})
  @Field({description: 'Correct answer'})
  answer: string;

  @Property({required: true})
  @Field({description: 'Positive marks for the question'})
  positiveMark: number;

  @Property({required: false, default: 0})
  @Field({description: 'Possible negative marks for the question answer'})
  negativeMark: number;

  @Property({required: true, trim: true})
  @Field({description: 'Explanation of the answer for the question'})
  explanation: string;
}

export const QuestionModel = getModelForClass(Question);
