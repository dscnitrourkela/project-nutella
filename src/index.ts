/* eslint-disable @typescript-eslint/no-var-requires */
import 'reflect-metadata';
import 'dotenv/config';

// Libraries
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import Session from 'express-session';

// Config
import {init as initMongoose} from './config/mongoose';
import {init as initFirebase} from './config/firebase';
import CORS_OPTIONS from './config/cors';

// Schema
import {schema} from './schema';

// Utils
import winston from './config/winston';

// Constants
import {PORT, IS_PROD} from './constants';

// eslint-disable-next-line import/order
const MongoDBStore = require('connect-mongodb-session')(Session);

(async () => {
  // Configure Utilities
  const logger = winston('Express');
  initMongoose();
  initFirebase();

  // Initialize Express Application
  const app = express();
  app.use(cors(CORS_OPTIONS));

  // Initialize Session
  const store = new MongoDBStore({
    uri: process.env.MONGO_APP_URL,
    collection: 'sessionStore',
    expires: 3600000, // 1 Hour
    connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 100,
      serverSelectionTimeoutMS: 10000,
    },
  });
  store.on('error', (error: unknown) => {
    logger.error(`Error on Session Store`, error);
  });
  app.use(
    Session({
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 86400000,
      },
      store,
      resave: true,
      saveUninitialized: true,
    }),
  );

  // Initialize Apollo Server
  const apolloServer = new ApolloServer({
    schema: await schema,
    playground: !IS_PROD,
    debug: !IS_PROD,
  });

  // Configure Express with Apollo Server
  apolloServer.applyMiddleware({
    app,
    cors: CORS_OPTIONS,
  });

  app.listen(PORT, () => logger.info(`Server Started on Port ${PORT}`));
})();
