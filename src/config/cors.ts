import { IS_PROD, PROD_ORIGIN, DEV_ORIGIN } from "./../constants";

export const CORS_OPTIONS = {
  origin: IS_PROD ? PROD_ORIGIN : DEV_ORIGIN,
};
