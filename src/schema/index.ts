// Libraries
import {buildSchema} from 'type-graphql';

// Resolvers
import UserResolvers from './user/user.resolver';

// Middlewares
import {TypegooseMiddleware} from '../config/typegoose';

const resolvers = [UserResolvers] as const;

// eslint-disable-next-line import/prefer-default-export
export const schema = buildSchema({
  resolvers,
  globalMiddlewares: [TypegooseMiddleware],
  validate: false,
});
