// Libraries
import {
  ObjectType,
  Field,
  InputType,
  GraphQLISODateTime,
  ID,
} from 'type-graphql';
import {ObjectID} from 'mongodb';

// Models
import {User} from '../user/user.model';
import {Quiz} from './quiz.model';

// Utils + Types + Scalars
import {ObjectIdScalar} from '../scalars';

@ObjectType({
  description:
    'Submission Resolve Type for Quiz. Returns the user from the User ObjectID',
})
export class SubmissionResolveType {
  @Field(() => User, {nullable: true})
  user: User | null;

  @Field({nullable: true})
  marks: number;
}

@InputType({
  description: 'Input Type for Submissions used in create and update Quizzes',
})
export class SubmissionInputType {
  @Field(() => ID)
  id: ObjectID;

  @Field()
  marks: number;
}

@ObjectType({
  description: 'Object Type for Submissions used while resolving a Quiz',
})
export class SubmissionType {
  @Field(() => ID)
  id: ObjectID;

  @Field()
  marks: number;
}

@InputType({
  description:
    'Input type for Quiz Details. Used in create and update Quiz inputs.',
})
export class QuizInput implements Partial<Quiz> {
  @Field({nullable: true})
  name: string;

  @Field(() => GraphQLISODateTime, {nullable: true})
  startTime: Date;

  @Field(() => GraphQLISODateTime, {nullable: true})
  endTime: Date;

  @Field(() => [ObjectIdScalar], {nullable: true})
  questions: ObjectID[];

  @Field(() => [String], {nullable: true})
  instructions: string[];

  @Field(() => [SubmissionInputType], {nullable: true})
  submissions: {id: ObjectID; marks: number}[];

  @Field({nullable: true})
  active: boolean;
}
