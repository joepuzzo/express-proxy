const jwtParser = require('jsonwebtoken');
const logger = require('winston');

const validJWT = (req) => {
  let jwt = req.cookies[config.jwt.cookieName];
  logger.info('Validating JWT');
  logger.debug('JWT', jwt);
  if (jwt) {
    logger.info('Found the jwt cookie on the request.');
    const options = {
      algorithms: ['RS256'],
    };
    try {
      // Verify that the token is valid, and if not, try to get a new one
      jwtParser.verify(jwt, helpers.getJwtPublicKeyPem(), options);
      return true;
    } catch (err) {
      // jwt was invalid
      logger.error('JWT ERROR', err);
      return false;
    }
  }
  return false;
};

const refreshJWT = async (req, res, next) => {
  logger.info('Attempting to refresh JWT');
  // Lookup and validate our OWN refresh token!
  // If we found a valid refresh token ( it exists and its not expired )
  let valid;
  try {
    valid = await services.RefreshTokenService.findAndValidateRefreshToken(req.session.refresh);
  } catch (e) {
    logger.error('An error occured when attempting to lookup a refresh token', e);
    return res.sendStatus(500);
  }
  if (valid) {
    // We have a valid refresh token so Regenerate the jwt
    logger.info('Regenerating a JWT');
    logger.debug('process.env.NODE_ENV passed to buildToken: ' + process.env.NODE_ENV);
    const jwt = helpers.encodeJwt(helpers.buildToken(req.session.passport.user, process.env.NODE_ENV));
    logger.info('jwt:', jwt);
    // Set the new jwt
    helpers.setCookie(config.jwt.cookieName, jwt, res);
    // Update the jwt cookie with new jwt
    logger.info('Adding bearer header');
    req.headers.authorization = `Bearer ${jwt}`;
    // Update the exp on the refresh
    try {
      await services.RefreshTokenService.refreshRefreshToken(req.session.refresh);
    } catch (e) {
      logger.error('An error occured when attempting to refresh token', e);
      return res.sendStatus(500);
    }
    // Continue on!
    next();
  } else {
    logger.error('No valid refresh token was found.');
    throw new Error('Unable to refresh JWT.');
  }
};


const authenticateJWT = async (req, res, next) => {

  logger.info('Checking JWT authentication');

  if (validJWT(req, res)) {
    next();
  } else {
    try {
      await refreshJWT(req, res, next);
    } catch (e) {
      logger.info('Attempt to refresh failed returning 403');
      res.sendStatus(403);
    }
  }
};

const redirect = (req, res) => {
  logger.info('redirecting');
  req.session.redirectTo = req.path;
  res.redirect('/auth/login');
};

const authenticateIDP = async (req, res, next) => {

  logger.info('Checking IDP authentication');

  // First check to see if we ever logged in with IDP
  if (!req.isAuthenticated()) {
    logger.info(`User is not authenticated setting session redirectTo: ${req.path} and redirecting to login!`);
    redirect(req, res);
    return;
  }

  if (validJWT(req, res)) {
    next();
  } else {
    try {
      await refreshJWT(req, res, next);
    } catch (e) {
      logger.error('Failed to refresh', e);
      logger.info(`Attempt to refresh failed setting session redirectTo: ${req.path} and redirecting to login!`);
      redirect(req, res);
    }
  }

};

module.exports = {
  authenticateIDP,
  authenticateJWT
};