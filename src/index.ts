/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';

// Libraries
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

// Config
import {init as initMongoose} from './config/mongoose';
import {init as initFirebase} from './config/firebase';
import {CORS_OPTIONS} from './config/cors';

// Schema
import {schema} from './schema';

// Constants
import {PORT, IS_PROD} from './constants';

(async () => {
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

  app.listen(PORT, () =>
    console.info(`Express Server Started on Port ${PORT}`),
  );
})();
