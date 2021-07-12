// Libraries
import {SessionData, Session} from 'express-session';
import {auth} from '../config/firebase';

// Types + Utils + Constants
import {JWT, Context} from '../types/auth';
import {PERMISSIONS} from '../constants';

/**
 * @description Authenticates a user using firebase verify method.
 * @function
 * @async
 *
 * @param {JWT} jwt
 * @returns {decodedTokenId} decodedToken
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
    !session.auth.role ||
    session.auth.jwt !== jwt ||
    session.auth.exp <= Date.now()
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
  desiredRole: string,
): boolean => {
  if (!context || !context.authToken || !context.session) return false;
  if (!CheckSession(context.session, context.authToken)) return false;

  const {role} = context.session.auth;
  if (role === desiredRole) return true;

  return false;
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
