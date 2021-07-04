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

// Utils + Types + Scalars
import {ObjectIdScalar} from '../scalars';
import {UserInput} from './user.types';
import getUpdateObject from '../../utils/getUpdateObject';

@Resolver(() => User)
export default class UserResolvers {
  @FieldResolver(() => [Quiz], {name: 'quizzes'})
  async quizzesArray(@Root() user: User): Promise<(Quiz | null)[]> {
    try {
      if (user.quizzes.length > 0) {
        return await Promise.all(
          user.quizzes.map(async quizId => QuizModel.findById(quizId)),
        );
      }

      return [];
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
    // TODO: Use context to allow requests only with the role of admin to proceed ahead

    try {
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
    createUser mutation takes an object of user properties as a parameter and creates a new user.
    The created user is then returned
  */
  @Mutation(() => User)
  async createUser(@Arg('userDetails') userDetails: UserInput): Promise<User> {
    // TODO: Use context to allow requests only with the role of user to proceed ahead

    // TODO: Extract user uid from the Context
    const uid = 'jadfomewodkljfalkfh';

    const {name, email, phoneNo, rollNo, fcmToken, quizzes} = userDetails;

    try {
      if (!name || !email || !phoneNo || !rollNo) {
        throw new Error('Bad Request: Missing Parameters');
      }

      return await UserModel.create({
        name,
        email,
        phoneNo,
        rollNo,
        fcmToken,
        uid,
        quizzes: quizzes.length > 0 ? quizzes : [],
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * updateUser mutation takes an object of user properties as a parameter, the id of the user
   * to be updated and updates the user.
   * The updated user is then returned.
   */
  @Mutation(() => User)
  async updateUser(
    @Arg('userId', () => ObjectIdScalar) userId: ObjectID,
    @Arg('userDetails', () => UserInput) userDetails: UserInput,
  ): Promise<User | null> {
    // TODO: Use context to allow requests only with the role of user to proceed ahead

    try {
      const updatedUser = getUpdateObject(userDetails);
      const existingUser = await UserModel.findById(userId);

      if (!existingUser) {
        throw new Error('Bad Request: User not found');
      }

      return await UserModel.findByIdAndUpdate(userId, {
        $set: {
          ...existingUser,
          ...updatedUser,
        },
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * deleterUser mutation takes in a userId parameter and deletes the corresponding user.
   */
  @Mutation(() => User)
  async deleteUser(
    @Arg('userId', () => ObjectIdScalar) userId: ObjectID,
  ): Promise<User | null> {
    // TODO: Use context to allow requests only with the role of user to proceed ahead
    try {
      return await UserModel.findByIdAndDelete(userId);
    } catch (error) {
      return error;
    }
  }
}
