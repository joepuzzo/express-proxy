const logger = require('winston');

module.exports = (req, accessToken, refreshToken, profile, done) => {
  // THIS IS CALLED RIGHT BEFORE THE /callback
  logger.info('Completed authentication with IDP.');
  logger.debug('Profile:', profile);
  try{
    req.session.refresh = services.RefreshTokenService.createNewToken();
  } catch(e){
    logger.error('An error occurred when verifying credentials', e);
    return done(e);
  }
  // Passing false will cause the app to redirect to /auth/fail
  return done(null, profile || false);
};