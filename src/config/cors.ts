/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IS_PROD,
  PROD_ORIGIN,
  DEV_ORIGIN,
  DEV_ORIGIN_IP,
  DEV_SOURCE,
  DEV_SOURCE_IP,
  PR_ORIGIN,
  STAGING_ORIGIN,
  PROD_SERVER,
} from '../constants';

const WHITELIST = [
  DEV_ORIGIN,
  DEV_ORIGIN_IP,
  DEV_SOURCE,
  STAGING_ORIGIN,
  DEV_SOURCE_IP,
  PROD_SERVER,
];

export default {
  credentials: true,
  origin: (
    origin: string | undefined,
    callback: (error: null | Error, success?: boolean) => void,
  ): void => {
    if (
      !IS_PROD &&
      (!origin ||
        WHITELIST.indexOf(origin!) !== -1 ||
        origin?.includes(PR_ORIGIN))
    ) {
      callback(null, true);
    } else if (IS_PROD && (!origin || origin === PROD_ORIGIN)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
