import 'reflect-metadata';
import 'dotenv/config';

// Libraries
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

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

(async () => {
  const logger = winston('Express');
  initMongoose();
  initFirebase();

  const app = express();
  app.use(cors(CORS_OPTIONS));

  const apolloServer = new ApolloServer({
    schema: await schema,
    playground: !IS_PROD,
    debug: !IS_PROD,
  });

  apolloServer.applyMiddleware({
    app,
    cors: CORS_OPTIONS,
  });

  app.listen(PORT, () => logger.info(`Server Started on Port ${PORT}`));
})();
