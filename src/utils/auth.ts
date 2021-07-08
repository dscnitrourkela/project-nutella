// Libraries
import {SessionData, Session} from 'express-session';
import {auth} from '../config/firebase';

// Types
import {JWT, Context} from '../types/auth';

/**
 * @description Authenticates a user and returns the uid
 * @function
 * @async
 *
 * @param {String} jwt JSON Web Token
 * @param {admin.Auth} _auth Firebase Authentication Library
 * @returns {Object | GraphQLError} decodedToken
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const AuthenticateUser = async (jwt: JWT) => {
  try {
    return process.env.NODE_ENV !== 'production'
      ? ' '
      : await auth().verifyIdToken(jwt, true);
  } catch (error) {
    return error;
  }
};

/**
 * @description Checks if user's session is active and valid
 * @function
 *
 * @param {session.Session} session
 * @param {String} jwt
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
    !session.auth.role ||
    session.auth.jwt !== jwt ||
    session.auth.exp <= Date.now()
  );

/**
 * @description Creates a session for a user and authenticates the user
 * @function
 * @async
 *
 * @param {session.Session} session
 * @param {String} jwt
 * @param {auth} _auth Firebase Authentication Library
 * @returns {Object | GraphQLError} decodedToken
 */
export const StartSession = async (
  session: Session & Partial<SessionData>,
  jwt: JWT,
): Promise<string> => {
  try {
    const decodedToken = await AuthenticateUser(jwt);
    if (!decodedToken) throw new Error('Authentication Error');

    const {uid, exp, role, mdbid} = decodedToken;
    // eslint-disable-next-line no-param-reassign
    session.auth = {
      uid,
      mdbid,
      jwt,
      exp,
      role,
      decodedToken,
    };

    await session.save();
    return decodedToken;
  } catch (error) {
    return error;
  }
};

/**
 * @description Ends the running session
 * @function
 * @async
 *
 * @param {session.Session} session
 * @param {String} jwt
 * @returns {NULL | GraphQLError}
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
  desiredRole: string,
): boolean => {
  if (!context || !context.authToken || !context.session) return false;
  if (!CheckSession(context.session, context.authToken)) return false;

  const {role} = context.session.auth;
  if (role === desiredRole) return true;

  return false;
};

/**
 * @description Parses the auth status
 * @function
 *
 * @param {String} jwt
 * @returns {NULL | Object | GraphQLError}
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const GetUserAuthScope = async (
  session: Session & Partial<SessionData>,
  jwt: JWT,
) => {
  try {
    if (!jwt) return null;
    if (CheckSession(session, jwt)) return session?.auth?.decodedToken;

    const decodedToken = await StartSession(session, jwt);
    if (!decodedToken) throw new Error('Unexpected Error');

    return decodedToken;
  } catch (error) {
    return error;
  }
};
