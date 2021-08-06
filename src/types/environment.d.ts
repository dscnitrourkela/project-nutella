declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_APP_URL: string;
      SESSION_SECRET: string | string[];
      SESSION_KEY: string;

      DEV_KEY: string;
      DEV_KEY_EXP: string;

      TYPE: string;
      PROJECT_ID: string;
      PRIVATE_KEY_ID: string;
      PRIVATE_KEY: string;
      CLIENT_EMAIL: string;
      CLIENT_ID: string;
      AUTH_URI: string;
      TOKEN_URI: string;
      AUTH_PROVIDER_X509_CERT_URL: string;
      CLIENT_X509_CERT_URL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
