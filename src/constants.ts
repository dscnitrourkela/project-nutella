export const PORT = process.env.PORT || 8000;
export const {MONGO_APP_URL} = process.env;

export const IS_PROD = process.env.NODE_ENV === 'production';
export const PROD_ORIGIN = 'https://aptiche-admin.dscnitrourkela.org';
export const DEV_ORIGIN = 'http://localhost';
export const STAGING_ORIGIN =
  'https://aptiche-admin-staging.dscnitrourkela.org';
export const PR_ORIGIN = 'https://apti-che';

export const PERMISSIONS = {
  USER: 'user',
  ADMIN: 'admin',
};
