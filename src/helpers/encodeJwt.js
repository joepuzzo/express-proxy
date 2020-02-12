const jwt = require('jsonwebtoken');
const logger = require('winston');

/**
 * Helper function that creates a JWT and signs it
 *
 * @param input payload to encode in a signed JWT
 */
module.exports = (input) => {
  logger.info('Encoding JWT');
  logger.debug('JWT input:', input);

  const pem = `-----BEGIN PRIVATE KEY-----\n${config.jwt.privateKey}\n-----END PRIVATE KEY-----`;

  logger.debug(pem);

  const cert = Buffer.from(pem, 'utf8');

  const opts = {
    algorithm: 'RS256'
  };

  if( !input.exp ){
    opts.expiresIn = config.jwt.exp;
  }

  return jwt.sign( input, cert, opts);
};