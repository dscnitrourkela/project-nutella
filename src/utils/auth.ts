/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Libraries
import {SessionData, Session} from 'express-session';
import {auth} from '../config/firebase';

// Types + Utils + Constants
import {PERMISSIONS} from '../constants';
import {JWT, Context} from '../types/auth';

/**
 * @description Authenticates a user using firebase verify method.
 * @function
 * @async
 *
 * @param {JWT} jwt
 * @returns {decodedTokenId} decodedToken
 */
export const AuthenticateUser = async (jwt: JWT) => {
  try {
    return await auth().verifyIdToken(jwt);
  } catch (error) {
    return error;
  }
};

/**
 * @description Verify's users session based on the request session.
 * @function
 *
 * @param {Session & Partial<SessionData>} session
 * @param {JWT} jwt
 * @returns {Boolean}
 */
export const CheckSession = (
  session: Session & Partial<SessionData>,
  jwt: JWT,
): boolean =>
  !(
    !session ||
    !session.auth ||
    !session.auth.jwt ||
    !session.auth.exp ||
    session.auth.jwt !== jwt ||
    session.auth.exp * 1000 <= Date.now()
  );

/**
 * @description Creates a session for a user and authenticates the user
 * @function
 * @async
 *
 * @param {Session & Partial<SessionData>} session
 * @param {JWT} jwt
 * @returns {Promise<string>}
 */
export const StartSession = async (
  session: Session & Partial<SessionData>,
  jwt: JWT,
): Promise<unknown> => {
  try {
    const decodedToken = await AuthenticateUser(jwt);
    if (!decodedToken) throw new Error('Authentication Error');

    const {uid, exp, role, mdbid} = decodedToken;
    session.auth = {
      uid,
      mdbid,
      jwt,
      exp,
      role: decodedToken && (role || PERMISSIONS.USER),
      decodedToken,
    };

    await session.save();
    return decodedToken;
  } catch (error) {
    return error;
  }
};

/**
 * @description Ends the current running session
 * @function
 * @async
 *
 * @param {Session & Partial<SessionData>} session
 * @param {JWT} jwt
 * @returns {boolean}
 */
export const EndSession = async (
  session: Session & Partial<SessionData>,
  jwt: JWT,
): Promise<boolean> => {
  try {
    if (CheckSession(session, jwt)) {
      session.destroy(error => {
        if (error) return error;
        return true;
      });
      return true;
    }

    return false;
  } catch (error) {
    return error;
  }
};

/**
 * @description Checks if the user has a particular permission
 * @function
 *
 * @param {Object} session
 * @param {String} jwt
 * @param {String} permission
 * @returns {Boolean | GraphQLError}
 */
export const HasPermissions = (
  context: Context,
  desiredRole: string[],
): boolean => {
  if (!context || !context.authToken || !context.session) return false;
  if (!CheckSession(context.session, context.authToken)) return false;

  const {role} = context.session.auth;
  return desiredRole.includes(role);
};

/**
 * @description Determines the auth status and returns the decodedToken.
 * The flow is:
 * - If no authToken(jwt), return null
 * - Check session, if active then return decodedToken from the session.
 * - If no session, create a new session after verifying jwt and return the decodedToken
 * @function
 *
 * @param {Session & Partial<SessionData>} session
 * @param {JWT} jwt
 * @returns {DecodedIdToken}
 */
export const GetUserAuthScope = async (
  session: Session & Partial<SessionData>,
  jwt: JWT,
) => {
  try {
    if (!jwt) return null;
    if (CheckSession(session, jwt)) return session?.auth?.decodedToken;

    // Start Session for development usage
    if (jwt === process.env.DEV_KEY) {
      const uid = `development-uid-${Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)}`;

      session.auth = {
        uid,
        jwt: process.env.DEV_KEY,
        role: PERMISSIONS.ADMIN,
        decodedToken: null,
        exp: parseInt(process.env.DEV_KEY_EXP!, 10),
      };

      await session.save();
      return {
        uid,
        role: PERMISSIONS.ADMIN,
        exp: parseInt(process.env.DEV_KEY_EXP!, 10),
      };
    }

    // Start the actual session
    const decodedToken = await StartSession(session, jwt);
    if (!decodedToken) throw new Error('Unexpected Error');

    return decodedToken;
  } catch (error) {
    return error;
  }
};
