const jwt = require('jsonwebtoken');
const logger = require('winston');

const getJwtPublicKeyPem = () => {
  const pem = `-----BEGIN PUBLIC KEY-----\n${config.jwt.publicKey}\n-----END PUBLIC KEY-----`;
  return Buffer.from(pem, 'utf8');
};

/**
 * Helper function that validates a jwt
 */
module.exports = (token) => {
  logger.debug(`TOKEN ${token}`);
  const options = {
    algorithms: ['RS256'],
  };
  try {
    jwt.verify(token, getJwtPublicKeyPem(), options);
    return true;
  } catch (err) {
    logger.error('error', err);
    return false;
  } 
};