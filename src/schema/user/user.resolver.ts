// Libraries
import {Resolver, Query, FieldResolver, Root} from 'type-graphql';

// Model
import {User, UserModel} from './user.model';
import {Quiz, QuizModel} from '../quiz/quiz.model';

@Resolver(() => User)
export default class UserResolvers {
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    try {
      return await UserModel.find({});
    } catch (error) {
      return error;
    }
  }

  @FieldResolver(() => [Quiz], {name: 'quizzes'})
  async quizzesArray(@Root() user: User): Promise<(Quiz | null)[]> {
    try {
      return await Promise.all(
        user.quizzes.map(async quizId => QuizModel.findById(quizId)),
      );
    } catch (error) {
      return error;
    }
  }
}
