export const PORT = process.env.PORT || 8000;
export const {MONGO_APP_URL} = process.env;

export const IS_PROD = process.env.NODE_ENV === 'production';
export const PROD_ORIGIN = 'https://aptiche-admin.dscnitrourkela.org';
export const PROD_SERVER = 'https://aptiche.dscnitrourkela.org';
export const DEV_ORIGIN = 'http://localhost:3000';
export const DEV_ORIGIN_IP = 'http://127.0.0.1:3000';
export const DEV_SOURCE = 'http://localhost:8000';
export const DEV_SOURCE_IP = 'http://127.0.0.1:8000';
export const STAGING_ORIGIN =
  'https://aptiche-admin-staging.dscnitrourkela.org';
export const PR_ORIGIN = 'https://apti-che';

export const PERMISSIONS = {
  USER: 'user',
  ADMIN: 'admin',
};
