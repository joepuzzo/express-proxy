
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const logger = require('winston');

class AdfsStrategy extends OAuth2Strategy {
  async userProfile(accessToken, done) {
    logger.debug(`Access Token: ${accessToken}`);

    // TODO: verify token here with ADFS public key - check systemone gateway
    // if fail call done(e)

    // WE HAVE AN ACCESS TOKEN FROM OUR IDP lets go create profile info with it!
    logger.info('Generating user info from access token');
    const profile = helpers.getProfileFromAccessToken(accessToken);
    logger.debug('Profile:', profile);
    // WE CAN NOW CREATE THE SHIT TO FINISH AUTHENTICATION 
    // CALL DONE TO GO TO THE CALLBACK URL
    return done(null, profile);

  }

}

module.exports = AdfsStrategy;