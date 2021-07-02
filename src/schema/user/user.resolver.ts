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
import {User, UserModel} from './user.model';
import {Quiz, QuizModel} from '../quiz/quiz.model';

// Utils + Types
import {ObjectIdScalar} from '../scalars';
import {UserInput} from './user.types';

@Resolver(() => User)
export default class UserResolvers {
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

  /*
    getUsers query takes an array of UserIds as a parameter and returns an
    array of the Users.
    If no ids are passed, then all the Users are returned.
  */
  @Query(() => [User])
  async getUsers(
    @Arg('ids', () => [ObjectIdScalar]) ids: ObjectID[],
  ): Promise<(User | null)[]> {
    try {
      // TODO: Use context to allow requests only with the role of admin to proceed ahead

      if (ids.length === 0) {
        return await UserModel.find({});
      }

      return await Promise.all(
        ids.map(async userId => UserModel.findById(userId)),
      );
    } catch (error) {
      return error;
    }
  }

  /*
    createUser mutations takes an object of user properties as a parameter and creates a new user.
    The created user is then returned
  */
  @Mutation(() => User)
  async createUser(@Arg('userDetails') userDetails: UserInput): Promise<User> {
    // TODO: Use context to allow requests only with the role of user to proceed ahead

    // TODO: Extract user uid from the Context
    let uid;

    const {name, email, phoneNo, rollNo, fcmToken, quizzes} = userDetails;

    if (!name || !email || !phoneNo || !rollNo) {
      throw new Error('Bad Request: Missing Parameters');
    }

    try {
      const user = new UserModel({
        name,
        email,
        phoneNo,
        rollNo,
        fcmToken,
        uid,
        quizzes: quizzes.length > 0 ? quizzes : [],
      });

      return await user.save();
    } catch (error) {
      return error;
    }
  }
}
