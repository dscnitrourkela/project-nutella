// Libraries
import {Resolver, Query} from 'type-graphql';

// Model
import {User, UserModel} from './user.model';

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
}
