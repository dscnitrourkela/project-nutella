export const PORT = process.env.PORT || 8000;
export const {MONGO_APP_URL} = process.env;

export const IS_PROD = process.env.NODE_ENV === 'production';
export const PROD_ORIGIN = 'prod.url';
export const DEV_ORIGIN = 'http://localhost:3000';

export const PERMISSIONS = {
  USER: 'user',
  ADMIN: 'admin',
};
