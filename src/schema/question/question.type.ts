// Libraries
import {InputType, Field} from 'type-graphql';
import {ObjectID} from 'mongodb';

// Models
import {Question} from './question.model';

// Utils + Types + Scalarss
import {ObjectIdScalar} from '../scalars';

@InputType({
  description: 'Input object containing the properties of a question model',
})
export class QuestionInput implements Partial<Question> {
  @Field({nullable: true})
  question: string;

  @Field({nullable: true})
  image: string;

  @Field(() => [String], {nullable: true})
  options: string[];

  @Field({nullable: true})
  answer: string;

  @Field({nullable: true})
  positiveMark: number;

  @Field({nullable: true})
  negativeMark: number;

  @Field({nullable: true})
  explanation: string;
}

@InputType({description: 'Input object for updating questions.'})
export class QuestionUpdateInput {
  @Field(() => ObjectIdScalar)
  id: ObjectID;

  @Field(() => QuestionInput)
  updates: QuestionInput;
}
