import { db } from './mongoose';

export const getSchemaOptions = () => ({
  existingConnection: db,
  options: {
    runSyncIndexes: true,
  },
  schemaOptions: {
    timestamps: true,
  },
});
