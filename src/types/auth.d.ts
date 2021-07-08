/* eslint-disable import/no-self-import */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */

import {ObjectID} from 'mongodb';

export interface DecodedIdToken {
  aud: string;
  auth_time: number;
  email?: string;
  email_verified?: boolean;
  exp: number;
  firebase: {
    identities: {
      [key: string]: any;
    };
    sign_in_provider: string;
    sign_in_second_factor?: string;
    second_factor_identifier?: string;
    tenant?: string;
    [key: string]: any;
  };
  iat: number;
  iss: number;
  phone_number?: string;
  picture?: string;
  sub: string;
  uid: string;
  [key: string]: any;
}

export type JWT = string;
export type UID = string;
export type MDBID = ObjectID;

declare module 'express-session' {
  interface SessionData {
    auth: {
      uid: UID;
      mdbid: ObjectID;
      jwt: JWT;
      exp: number;
      role: string;
      decodedToken: DecodedToken;
    };
  }
}

export interface Context {
  authToken: JWT;
  decodedToken: DecodedToken;
  mdbid: ObjectID;
  session: Session & Partial<SessionData>;
}
