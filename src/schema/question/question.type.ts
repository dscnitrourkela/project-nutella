// Libraries
import {InputType, Field} from 'type-graphql';
import {ObjectID} from 'mongodb';

// Models
import {Question} from './question.model';

// Utils + Types + Scalarss
import {ObjectIdScalar} from '../scalars';

@InputType()
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

@InputType()
export class QuestionUpdateInput {
  @Field(() => ObjectIdScalar)
  id: ObjectID;

  @Field(() => QuestionInput)
  updates: QuestionInput;
}
