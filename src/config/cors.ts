import {
  IS_PROD,
  PROD_ORIGIN,
  DEV_ORIGIN,
  PR_ORIGIN,
  STAGING_ORIGIN,
} from '../constants';

export default {
  credentials: true,
  origin: (
    origin: string,
    callback: (error: null | Error, success?: boolean) => void,
  ): void => {
    if (
      !IS_PROD &&
      (!origin ||
        origin.includes(DEV_ORIGIN) ||
        origin.includes(PR_ORIGIN) ||
        origin === STAGING_ORIGIN)
    ) {
      callback(null, true);
    } else if (origin === PROD_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('Request blocked by CORS. Invalid source!'));
    }
  },
};
