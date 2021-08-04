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
@ObjectType({description: 'The Question Model'})
export class Question {
  @Field(() => ObjectIdScalar, {description: 'Question MongoDB ObjectID'})
  _id: ObjectID;

  @Property({required: true, trim: true})
  @Field({description: 'Question string'})
  question: string;

  @Property({required: false, default: ''})
  @Field({description: 'Image present in the question', nullable: true})
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
  @Field({
    description: 'Possible negative marks for the question answer',
    nullable: true,
  })
  negativeMark: number;

  @Property({required: true, trim: true})
  @Field({description: 'Explanation of the answer for the question'})
  explanation: string;
}

export const QuestionModel = getModelForClass(Question);
