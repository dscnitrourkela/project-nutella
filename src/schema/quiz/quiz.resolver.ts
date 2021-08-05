// Libraries
import {
  Resolver,
  Query,
  FieldResolver,
  Root,
  Arg,
  Mutation,
  Ctx,
  Int,
} from 'type-graphql';
import {ObjectID} from 'mongodb';

// Model
import {Quiz, QuizModel} from './quiz.model';
import {Question, QuestionModel} from '../question/question.model';
import {UserModel} from '../user/user.model';

// Utils + Types + Scalars
import {ObjectIdScalar} from '../scalars';
import {SubmissionResolveType, QuizInput} from './quiz.type';
import {PERMISSIONS} from '../../constants';
import {HasPermissions} from '../../utils/auth';
import {Context} from '../../types/auth.d';

@Resolver(() => Quiz)
export default class QuizResolvers {
  /**
   * Resolves the question ids stored in MongoDB into question documents.
   */
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

  /**
   * Resolves the submitted user ids into user documents and their corresponding marks.
   */
  @FieldResolver(() => [SubmissionResolveType], {
    nullable: true,
    name: 'submissions',
    description:
      'An array containing the details of the users who submitted the quiz along with their marks',
  })
  async submissionsArray(
    @Root() quiz: Quiz,
  ): Promise<(SubmissionResolveType | null)[]> {
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

  /**
   * getQuizzes mutation takes an array of ids that needs to be fetched.
   * if the array is empty then it returns all the quizzes.
   */
  @Query(() => [Quiz], {
    nullable: true,
    description:
      'Takes an array of Quiz ObjectIDs and returns an array of the corresponding Quizzes. If an empty array is passed, all Quizzes are returned.',
  })
  async getQuizzes(
    @Arg('ids', () => [ObjectIdScalar], {nullable: 'items'}) ids: ObjectID[],
    @Ctx() context: Context,
  ): Promise<(Quiz | null)[]> {
    try {
      if (!HasPermissions(context, [PERMISSIONS.USER, PERMISSIONS.ADMIN])) {
        throw new Error('Error: Unauthorized');
      }

      if (!ids || ids.length === 0) {
        return await QuizModel.find({});
      }

      return await Promise.all(
        ids.map(async quizId => QuizModel.findById(quizId)),
      );
    } catch (error) {
      return error;
    }
  }

  @Query(() => [Quiz], {
    nullable: true,
    description:
      'Takes an integer as input and returns live, past and upcoming quizzes',
  })
  async getQuizzesByTime(
    @Arg('int', () => Int) int: number,
    @Ctx() context: Context,
  ): Promise<(Quiz | null)[]> {
    try {
      if (!HasPermissions(context, [PERMISSIONS.USER, PERMISSIONS.ADMIN])) {
        throw new Error('Error: Unauthorized');
      }

      if (!int) {
        throw new Error('Bad Request: Missing Parameter');
      }

      const quizzes = await QuizModel.find({});
      if (int === 1) {
        return quizzes.filter(
          ({startTime, endTime}) =>
            startTime.valueOf() < Date.now() && endTime.valueOf() < Date.now(),
        );
      }

      if (int === 2) {
        return quizzes.filter(
          ({startTime, endTime}) =>
            startTime.valueOf() < Date.now() && endTime.valueOf() > Date.now(),
        );
      }

      return quizzes.filter(
        ({startTime, endTime}) =>
          startTime.valueOf() > Date.now() && endTime.valueOf() > Date.now(),
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * createQuiz mutation creates a new Quiz and takes in the quizInput parameters.
   */
  @Mutation(() => Quiz, {
    description:
      'Takes an Object containing quiz properties as parameter, creates a Quiz model in database. If no object passed, a bad request error is thrown.',
  })
  async createQuiz(
    @Arg('quizDetails') quizDetails: QuizInput,
    @Ctx() context: Context,
  ): Promise<Quiz> {
    if (!HasPermissions(context, [PERMISSIONS.ADMIN])) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (!quizDetails) {
        throw new Error('Bad Request: Missing Parameters');
      }

      const {name, startTime, endTime, questions, instructions, active} =
        quizDetails;
      if (!name || !startTime || !endTime || !questions || !instructions) {
        throw new Error('Bad Request: Missing Parameters.');
      }

      return await QuizModel.create({
        ...quizDetails,
        active: active || false,
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * updateQuiz mutation takes the quizInput object as parameter (with the necessary properties),
   * and the id of the quiz to be updated.
   * The updated quiz is then returned.
   */
  @Mutation(() => Quiz, {
    nullable: true,
    description:
      'Takes Quiz ObjectID and Quiz Input object (containing the properties to be updated). In case of missing parameters, a bad request error is thrown',
  })
  async updateQuiz(
    @Arg('quizId', () => ObjectIdScalar) quizId: ObjectID,
    @Arg('quizDetails', () => QuizInput) quizDetails: QuizInput,
    @Ctx() context: Context,
  ): Promise<Quiz | null> {
    if (!HasPermissions(context, [PERMISSIONS.USER, PERMISSIONS.ADMIN])) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (!quizId || !quizDetails) {
        throw new Error('Bad Request: Missing Parameter');
      }

      const existingQuiz = await QuizModel.findById(quizId);
      if (!existingQuiz) {
        throw new Error('Bad Request: Quiz not found');
      }

      return await QuizModel.findByIdAndUpdate(quizId, quizDetails, {
        new: true,
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * deleteQuiz mutation takes in quizId as a parameter and deletes the corresponding quiz.
   */
  @Mutation(() => Quiz, {
    nullable: true,
    description:
      'Takes Quiz ObjectID as a parameter and deletes the corresponding quiz. In case of missing ID, a bad request error is thrown',
  })
  async deleteQuiz(
    @Arg('quizId', () => ObjectIdScalar) quizId: ObjectID,
    @Ctx() context: Context,
  ): Promise<Quiz | null> {
    if (!HasPermissions(context, [PERMISSIONS.ADMIN])) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (!quizId) {
        throw new Error('Bad Request: Missing Parameters');
      }
      return await QuizModel.findByIdAndDelete(quizId);
    } catch (error) {
      return error;
    }
  }
}
