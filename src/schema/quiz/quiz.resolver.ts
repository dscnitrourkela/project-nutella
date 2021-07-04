// Libraries
import {
  Resolver,
  Query,
  FieldResolver,
  Root,
  Arg,
  Mutation,
} from 'type-graphql';
import {ObjectID} from 'mongodb';

// Model
import {Quiz, QuizModel} from './quiz.model';
import {Question, QuestionModel} from '../question/question.model';
import {UserModel} from '../user/user.model';

// Utils + Types + Scalars
import {ObjectIdScalar} from '../scalars';
import {SubmissionResolveType, QuizInput} from './quiz.type';

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
  @Query(() => [Quiz])
  async getQuizzes(
    @Arg('ids', () => [ObjectIdScalar]) ids: ObjectID[],
  ): Promise<(Quiz | null)[]> {
    try {
      // TODO: Use context to allow requests only with the role of user/student to proceed ahead.

      if (ids.length === 0) {
        return await QuizModel.find({});
      }

      return await Promise.all(
        ids.map(async quizId => QuizModel.findById(quizId)),
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * createQuiz mutation creates a new Quiz and takes in the quizInput parameters.
   */
  @Mutation(() => Quiz)
  async createQuiz(@Arg('quizDetails') quizDetails: QuizInput): Promise<Quiz> {
    // TODO: Use context to allow requests only with the admin role to proceed ahead.

    const {name, startTime, endTime, questions, instructions, active} =
      quizDetails;

    if (!name || !startTime || !endTime || !questions || !instructions) {
      throw new Error('Bad Request: Missing Parameters.');
    }

    try {
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
  @Mutation(() => Quiz)
  async updateQuiz(
    @Arg('quizId', () => ObjectIdScalar) quizId: ObjectID,
    @Arg('quizDetails', () => QuizInput) quizDetails: QuizInput,
  ): Promise<Quiz | null> {
    // TODO: Use context to allow requests only with the admin role to proceed ahead.

    try {
      // const updatedQuiz = getUpdateObject(quizDetails);
      const existingQuiz = await QuizModel.findById(quizId);

      if (!existingQuiz) {
        throw new Error('Bad Request: Quiz not found');
      }

      return await QuizModel.findByIdAndUpdate(
        quizId,
        {
          ...quizDetails,
        },
        {new: true},
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * deleteQuiz mutation takes in quizId as a parameter and deletes the corresponding quiz.
   */
  @Mutation(() => Quiz)
  async deleteQuiz(
    @Arg('quizId', () => ObjectIdScalar) quizId: ObjectID,
  ): Promise<Quiz | null> {
    // TODO: Use context to allow requests only with the role of admin to proceed ahead
    try {
      return await QuizModel.findByIdAndDelete(quizId);
    } catch (error) {
      return error;
    }
  }
}
