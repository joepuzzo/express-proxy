const jwt = require('jsonwebtoken');
const logger = require('winston');

const formatPublicKey = (publicKey) => {
  const pem = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
  return Buffer.from(pem, 'utf8');
};

const formatPrivateKey = (privateKey) => {
  const pem = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
  return Buffer.from(pem, 'utf8');
};

/**
 * Helper function that creates a JWT and signs it
 *
 * @param input payload to encode in a signed JWT
 * @param privateKey private key to sign JWT with
 */
const encodeJwt = (input, privateKey, options = {}) => {
  logger.info('Encodeing JWT');

  const cert = formatPrivateKey(privateKey);

  if( !options.expiresIn && !input.exp ){
    throw Error('Please provide an expiration or expiresIn option');
  }

  const opts = {
    algorithm: 'RS256',
    ...options 
  };

  return jwt.sign( input, cert, opts);
};

module.exports = {
  encodeJwt,
  formatPublicKey,
  formatPrivateKey
};