// Libraries
import admin from 'firebase-admin';

// Utils
import winston from './winston';

const logger = winston('Firebase');

// Initialize Firebase Admin SDK
export const init = (): void => {
  try {
    const serviceAccount = {
      type: process.env.type,
      projectId: process.env.project_id,
      privateKeyId: process.env.private_key_id,
      privateKey: process.env.private_key,
      clientEmail: process.env.client_email,
      clientId: process.env.client_id,
      authUri: process.env.auth_uri,
      tokenUri: process.env.token_uri,
      authProviderX509CertUrl: process.env.auth_provider_x509_cert_url,
      clientC509CertUrl: process.env.client_x509_cert_url,
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
