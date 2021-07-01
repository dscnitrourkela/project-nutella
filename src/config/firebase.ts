// Libraries
import admin from 'firebase-admin';

// Utils
import winston from './winston';

const logger = winston('Firebase');

// Initialize Firebase Admin SDK
export const init = (): void => {
  try {
    const serviceAccount = {
      type: process.env.TYPE,
      projectId: process.env.PROJECT_ID,
      privateKeyId: process.env.PRIVATE_KEY_ID,
      privateKey: process.env.PRIVATE_KEY,
      clientEmail: process.env.CLIENT_EMAIL,
      clientId: process.env.CLIENT_ID,
      authUri: process.env.AUTH_URI,
      tokenUri: process.env.TOKEN_URI,
      authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
      clientC509CertUrl: process.env.CLIENT_X509_CERT_URL,
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    logger.info('Admin Initialized');
  } catch (error) {
    logger.error('Admin Initialization failed: ', error);
  }
};

export const {auth} = admin;
