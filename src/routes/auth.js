const router = require('express').Router();
const passport = require('passport');
const logger = require('winston');
const config = require('../../config/config');

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/callback
router.get('/login', passport.authenticate('provider', { scope: config.OAuth.scopes }));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access 
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get('/callback',
  passport.authenticate('provider', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/fail'
  })
);

router.get('/fail', (req, res) => {
  logger.info('Authentication failed redirecting to /unauthorized');
  res.redirect('/unauthorized');
});

router.get('/success', (req, res) => {
  logger.debug('success', req.user);
  logger.debug('refresh', req.session.refresh);
  const redirectTo = req.session.redirectTo || '/';
  delete req.session.redirectTo;
  if (!req.user) {
    return res.sendStatus(500);
  }
  helpers.setCookie(config.jwt.cookieName, helpers.encodeJwt(helpers.buildToken(req.user, process.env.NODE_ENV)), res);
  logger.info(`redirecting to ${redirectTo}`);
  return res.redirect(redirectTo);
});

module.exports = router;