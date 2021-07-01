// Libraries
import {buildSchema} from 'type-graphql';
import {ObjectId} from 'mongodb';

// Resolvers
import UserResolvers from './user/user.resolver';

// Middlewares + Utils
import {TypegooseMiddleware} from '../config/typegoose';
import {ObjectIdScalar} from './scalars';

const resolvers = [UserResolvers] as const;

// eslint-disable-next-line import/prefer-default-export
export const schema = buildSchema({
  resolvers,
  globalMiddlewares: [TypegooseMiddleware],
  scalarsMap: [{type: ObjectId, scalar: ObjectIdScalar}],
  validate: false,
});
