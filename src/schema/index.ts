// Libraries
import { buildSchema } from 'type-graphql';

// Resolvers
import { UserResolvers } from './user/user.resolver';

const resolvers = [UserResolvers] as const;

export const schema = buildSchema({
  resolvers,
});
