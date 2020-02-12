const logger = require('winston');
const AdfsStrategy = require('../passport/strategies/AdfsStrategy');
const MockStrategy = require('../passport/strategies/MockStrategy');

const passport = require('passport');
const verifyCallback = require('../passport/verifyCallback');

const configurePassport = ( Strategy ) => { 
  logger.info('Configuring passport');
  passport.use('provider', new Strategy({
    authorizationURL: config.OAuth.authorizationURL,
    tokenURL: config.OAuth.tokenURL,
    clientID: config.OAuth.clientID,
    // clientSecret: config.OAuth.clientSecret,
    callbackURL: config.OAuth.callbackURL,
    passReqToCallback: true
  }, verifyCallback));
  
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
    
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};

const setupSpec = () => {
  configurePassport( MockStrategy );
};

const setup = () => {
  configurePassport( AdfsStrategy );
};

module.exports = process.env.NODE_ENV === 'spec' ? setupSpec : setup;