// Libraries
import {
  Resolver,
  // Query,
  FieldResolver,
  Root,
  // Arg,
  // Mutation,
} from 'type-graphql';
// import {ObjectID} from 'mongodb';

// Model
import {
  Quiz,
  // QuizModel
} from './quiz.model';
import {Question, QuestionModel} from '../question/question.model';
import {UserModel} from '../user/user.model';

// Utils + Types
// import {ObjectIdScalar} from '../scalars';
import {SubmissionType} from './quiz.type';
// import getUpdateObject from '../../utils/getUpdateObject';

@Resolver(() => Quiz)
export default class QuizResolvers {
  @FieldResolver(() => [Question], {
    name: 'questions',
    description:
      'An array containing the details of all the questions in this quiz.',
  })
  async questionsArray(@Root() quiz: Quiz): Promise<(Question | null)[]> {
    try {
      if (quiz.questions.length > 0) {
        return await Promise.all(
          quiz.questions.map(questionId => QuestionModel.findById(questionId)),
        );
      }

      return [];
    } catch (error) {
      return error;
    }
  }

  @FieldResolver(() => [SubmissionType], {
    nullable: true,
    name: 'submissions',
    description:
      'An array containing the details of the users who submitted the quiz along with their marks',
  })
  async submissionsArray(
    @Root() quiz: Quiz,
  ): Promise<(SubmissionType | null)[]> {
    try {
      if (quiz.submissions.length > 0) {
        const users = await Promise.all(
          quiz.submissions.map(({id}) => UserModel.findById(id)),
        );
        return users.map((user, index) => ({
          user,
          marks: quiz.submissions[index].marks,
        }));
      }

      return [];
    } catch (error) {
      return error;
    }
  }
}
