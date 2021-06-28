// Libraries
import mongoose from 'mongoose';

// Utils
import winston from './winston';

const logger = winston('Mongoose');

// Initialize Mongoose Connection
export const init = async (): Promise<void> => {
  const MONGOOSE_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 100,
    useFindAndModify: false,
    useCreateIndex: true,
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await mongoose.connect(process.env.MONGO_APP_URL!, MONGOOSE_OPTIONS);

  const db = mongoose.connection;

  db.on('error', err => logger.error('Database connection failed', err));
  db.once('open', () => logger.info('Database Connected'));
};

// Check mongoose connection
export const db = mongoose.connection.readyState !== 1 && mongoose.connection;
