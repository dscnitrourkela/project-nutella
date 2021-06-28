// Libraries
import mongoose from 'mongoose';

// Constants
import {MONGO_APP_URL} from '../constants';

// Initialize Mongoose Connection
export const init = async () => {
  const MONGOOSE_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 100,
    useFindAndModify: false,
    useCreateIndex: true,
  };
  await mongoose.connect(MONGO_APP_URL!, MONGOOSE_OPTIONS);

  const db = mongoose.connection;

  db.on('error', err => console.error('Could not connect to database', err));
  db.once('open', () => console.info('Database Connected'));
};

// Check mongoose connection
export const db = mongoose.connection.readyState !== 1 && mongoose.connection;
