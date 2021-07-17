// Libraries
import {Resolver, Query, Arg, Mutation, Ctx} from 'type-graphql';
import {ObjectID} from 'mongodb';

// Model
import {Question, QuestionModel} from './question.model';
import {QuizModel} from '../quiz/quiz.model';

// Utils + Types + Scalars
import {ObjectIdScalar} from '../scalars';
import {QuestionInput, QuestionUpdateInput} from './question.type';
import {HasPermissions} from '../../utils/auth';
import {PERMISSIONS} from '../../constants';
import {Context} from '../../types/auth';

@Resolver(() => Question)
export default class QuestionResolvers {
  /**
   * getQuestions query takes an array of QuestionIds as a parameter and returns an array of the Questions
   * If no ids are passed (empty array), all the Questions will be returned.
   */
  @Query(() => [Question], {
    nullable: true,
    description:
      'Takes an array of Question ObjectIDs as a parameter and returns an array of the questions as per the IDs. If an empty array is passed, all the questions are returned  ',
  })
  async getQuestions(
    @Arg('ids', () => [ObjectIdScalar], {nullable: 'items'}) ids: ObjectID[],
    @Ctx() context: Context,
  ): Promise<(Question | null)[]> {
    if (!HasPermissions(context, PERMISSIONS.USER)) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (ids.length === 0) {
        return await QuestionModel.find({});
      }

      return await Promise.all(
        ids.map(async questionId => QuestionModel.findById(questionId)),
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * getQuestionsForQuiz query takes an array of QuizIds as a parameter and returns
   * a 2 dimensional array containing the questions for each quiz.
   * If no ids are passed, a bad request error is thrown.
   */
  @Query(() => [Question], {
    nullable: true,
    description:
      'Takes an array of Quiz ObjectIDs as a parameter and returns a 2 Dimensional array containing the questions for each quiz. If an empty array/no array is passed a bad request error is thrown',
  })
  async getQuestionsForQuiz(
    @Arg('ids', () => [ObjectIdScalar]) ids: ObjectID[],
    @Ctx() context: Context,
  ): Promise<Promise<Promise<Question | null>[] | undefined>[]> {
    if (!HasPermissions(context, PERMISSIONS.USER)) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (ids.length && ids.length === 0) {
        throw new Error('Bad Request: Missing Parameters');
      }

      const quizzes = await Promise.all(
        ids.map(async quizId => QuizModel.findById(quizId)),
      );
      const questionsArray = quizzes.map(quiz => quiz?.questions);

      return questionsArray.map(async questions =>
        questions?.map(async questionId => {
          const question = await QuestionModel.findById(questionId);
          return question;
        }),
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * createQuestions mutation gets an array of questions as parameter which are then added to the DB
   * If empty array provided bad request error is thrown.
   */
  @Mutation(() => [Question], {
    description:
      'Takes an array of questions as parameter which are then added to the Database. If empty array is provided, a bad request error is thrown',
  })
  async createQuestions(
    @Arg('questionDetails', () => [QuestionInput]) questionDetails: Question[],
    @Ctx() context: Context,
  ): Promise<(Question | null)[]> {
    if (!HasPermissions(context, PERMISSIONS.ADMIN)) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (questionDetails.length === 0) {
        throw new Error('Bad Request: Missing Parameters');
      }

      return await Promise.all(
        questionDetails.map(async questionDetail => {
          const {question, options, answer, positiveMark, explanation} =
            questionDetail;

          if (
            !question ||
            !options ||
            !answer ||
            !positiveMark ||
            !explanation
          ) {
            throw new Error('Bad Request: Missing Parameters');
          }

          return QuestionModel.create(questionDetail);
        }),
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * updateQuestions takes an array of objects where the object contains the id of the question to be updated
   * and updateObject
   * If the array is empty a Bad request error is thrown.
   */
  @Mutation(() => [Question], {
    nullable: true,
    description:
      'Takes an array of objects as parameter where the object contains the id of the question to be updated and the updateObject. If an array is empty, a bad request error is thrown',
  })
  async updateQuestions(
    @Arg('questionDetails', () => [QuestionUpdateInput])
    questionUpdatesArray: QuestionUpdateInput[],
    @Ctx() context: Context,
  ): Promise<(Question | null)[]> {
    if (!HasPermissions(context, PERMISSIONS.ADMIN)) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (questionUpdatesArray.length === 0) {
        throw new Error('Bad Request: Missing Parameters');
      }

      return await Promise.all(
        questionUpdatesArray.map(async ({id, updates}) =>
          QuestionModel.findByIdAndUpdate(id, updates, {new: true}),
        ),
      );
    } catch (error) {
      return error;
    }
  }

  /**
   * deleteQuestions takes an array of question ids to be deleted.
   * If the array is empty a bad request error is thrown
   */
  @Mutation(() => [Question], {
    nullable: true,
    description:
      'Takes an array of Question ObjectIDs to be deleted as a parameter. If an empty array is passed, a bad request error is thrown',
  })
  async deleteQuestions(
    @Arg('ids', () => ObjectIdScalar) ids: ObjectID[],
    @Ctx() context: Context,
  ): Promise<(Question | null)[]> {
    if (!HasPermissions(context, PERMISSIONS.ADMIN)) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (ids.length === 0) {
        throw new Error('Bad Request: Missing Parametes');
      }

      return await Promise.all(
        ids.map(async questionId =>
          QuestionModel.findByIdAndDelete(questionId),
        ),
      );
    } catch (error) {
      return error;
    }
  }
}
