// Libraries
import {buildSchema} from 'type-graphql';

// Resolvers
import UserResolvers from './user/user.resolver';

const resolvers = [UserResolvers] as const;

// eslint-disable-next-line import/prefer-default-export
export const schema = buildSchema({
  resolvers,
});
