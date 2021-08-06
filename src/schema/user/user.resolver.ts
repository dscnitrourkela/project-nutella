/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Libraries
import {
  Resolver,
  Query,
  FieldResolver,
  Root,
  Arg,
  Mutation,
  Ctx,
} from 'type-graphql';
import {ObjectID} from 'mongodb';
import {auth} from '../../config/firebase';

// Model
import {User, UserModel} from './user.model';
import {Quiz, QuizModel} from '../quiz/quiz.model';

// Utils + Types + Scalars
import {ObjectIdScalar} from '../scalars';
import {UserInput} from './user.types';
import {PERMISSIONS} from '../../constants';
import {HasPermissions, CheckSession} from '../../utils/auth';
import {Context} from '../../types/auth';

@Resolver(() => User)
export default class UserResolvers {
  @FieldResolver(() => [Quiz], {name: 'quizzes', nullable: 'items'})
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
  @Query(() => [User], {
    nullable: true,
    description:
      'Takes an array of User ObjectIDs as a parameter and returns an array of corresponding users. If an empty array is passed, All the users are returned.',
  })
  async getUsers(
    @Arg('ids', () => [ObjectID], {nullable: 'items'})
    ids: ObjectID[],
    @Ctx() context: Context,
  ): Promise<(User | null)[]> {
    console.log(context);
    if (!HasPermissions(context, [PERMISSIONS.USER, PERMISSIONS.ADMIN])) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (!ids || ids.length === 0) {
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
  @Mutation(() => User, {
    description:
      'Takes an object containing the User details as parameter and returns the created user. In case of missing parameters, bad request error is thrown.',
  })
  async createUser(
    @Arg('userDetails') userDetails: UserInput,
    @Ctx() context: Context,
  ): Promise<User> {
    if (!CheckSession(context.session, context.authToken)) {
      throw new Error('Error: Unauthorized');
    }

    const uid = context.decodedToken.uid!;

    try {
      if (!userDetails) {
        throw new Error('Bad Request: Missing Parameters');
      }

      const {name, email, phoneNo, rollNo, fcmToken, quizzes} = userDetails;
      if (!name || !email || !phoneNo || !rollNo) {
        throw new Error('Bad Request: Missing Parameters');
      }

      const user = await UserModel.create({
        name,
        email,
        phoneNo,
        rollNo,
        uid,
        fcmToken: fcmToken.length > 0 ? fcmToken : [],
        quizzes: quizzes.length > 0 ? quizzes : [],
      });

      // If development mode (i.e. has dev key) return user without saving custom claims
      if (context.authToken === process.env.DEV_KEY) return user;

      await auth().setCustomUserClaims(context.decodedToken.uid, {
        mdbid: user.id,
        role: PERMISSIONS.USER,
      });

      context.session.auth.mdbid = user.id;
      context.session.auth.role = PERMISSIONS.USER;
      await context.session.save();

      return user;
    } catch (error) {
      return error;
    }
  }

  /**
   * updateUser mutation takes an object of user properties as a parameter, the id of the user
   * to be updated and updates the user.
   * The updated user is then returned.
   */
  @Mutation(() => User, {
    nullable: true,
    description:
      'Takes the User ObjectID and an object containing the properties to be updated as parameter. In case of missing parameters, a bad request error is thrown.',
  })
  async updateUser(
    @Arg('userId', () => ObjectIdScalar) userId: ObjectID,
    @Arg('userDetails', () => UserInput) userDetails: UserInput,
    @Ctx() context: Context,
  ): Promise<User | null> {
    if (!HasPermissions(context, [PERMISSIONS.USER, PERMISSIONS.ADMIN])) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (!userId || !userDetails) {
        throw new Error('Bad Request: Missing Parameters');
      }

      const existingUser = await UserModel.findById(userId);
      if (!existingUser) {
        throw new Error('Bad Request: User not found');
      }

      return await UserModel.findByIdAndUpdate(userId, userDetails, {
        new: true,
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * deleterUser mutation takes in a userId parameter and deletes the corresponding user.
   */
  @Mutation(() => User, {
    nullable: true,
    description:
      'Takes the User ObjectID as parameter and deletes the corresponding User.',
  })
  async deleteUser(
    @Arg('userId', () => ObjectIdScalar) userId: ObjectID,
    @Ctx() context: Context,
  ): Promise<User | null> {
    if (!HasPermissions(context, [PERMISSIONS.USER, PERMISSIONS.ADMIN])) {
      throw new Error('Error: Unauthorized');
    }

    try {
      if (!userId) {
        throw new Error('Bad Request: Missing Parameters');
      }

      return await UserModel.findByIdAndDelete(userId);
    } catch (error) {
      return error;
    }
  }
}
