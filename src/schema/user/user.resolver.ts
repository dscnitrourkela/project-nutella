// Libraries
import { Arg, Mutation, Resolver, Query } from 'type-graphql';

// Model
import { UserModel, User } from './user.model';

@Resolver((_of) => User)
export class UserResolvers {
  // Query to return a user from the username
  @Query((_returns) => User)
  async getUser(@Arg('username', () => String) username: string) {
    try {
      const user = await UserModel.findOne({ username });

      if (!user)
        throw new Error('User not found, please enter the correct username');

      return user;
    } catch (error) {
      throw new Error('User not found, please enter the correct username');
    }
  }

  // Mutation to add a new user
  @Mutation((_returns) => User)
  async addUser(
    @Arg('username', () => String) username: string,
    @Arg('name', () => String) name: string
  ) {
    const user = new UserModel({ username, name });
    try {
      return await user.save();
    } catch (error) {
      throw new Error('User not saved, please try again');
    }
  }
}
