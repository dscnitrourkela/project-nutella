import {IS_PROD, PROD_ORIGIN, DEV_ORIGIN} from '../constants';

export default {
  origin: IS_PROD ? PROD_ORIGIN : DEV_ORIGIN,
  credentials: true,
};
