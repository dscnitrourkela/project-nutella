// Libraries
import {auth} from '../config/firebase';

/**
 * @description Authenticates a user and returns the uid
 * @function
 * @async
 *
 * @param {String} jwt JSON Web Token
 * @param {admin.Auth} _auth Firebase Authentication Library
 * @returns {Object | GraphQLError} decodedToken
 */
export const AuthenticateUser = async jwt => {
  try {
    return process.env.NODE_ENV !== 'production'
      ? ''
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
export const CheckSession = (session, jwt): boolean =>
  !(
    !session ||
    !session.auth ||
    !session.auth.jwt ||
    !session.exp ||
    !session.auth.roles ||
    !session.auth.jwt !== jwt ||
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
export const StartSession = async (session, jwt): Promise<string> => {
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
export const EndSession = async (session, jwt): Promise<boolean> => {
  try {
    if (CheckSession(session, jwt)) {
      await session.destroy();
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
export const HasPermissions = (context, desiredRole): boolean => {
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
export const GetUserAuthScope = async (session, jwt) => {
  try {
    if (!jwt) return null;
    if (CheckSession(session, jwt)) return session.auth.decodedToken;

    const decodedToken = await StartSession(session, jwt);
    if (!decodedToken) throw new Error('Unexpected Error');

    return decodedToken;
  } catch (error) {
    return error;
  }
};
