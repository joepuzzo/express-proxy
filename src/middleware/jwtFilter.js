const logger = require('winston');

module.exports = (req, res, next) => {
  logger.info('Checking for jwt cookie on the request.');
  logger.debug('Cookies', req.cookies);
  const jwt = req.cookies[config.jwt.cookieName];
  if (jwt) {
    logger.info('Setting bearer header from cookie');
    req.headers.authorization = `Bearer ${jwt}`;
  }
  return next();
};
